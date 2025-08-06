import { useState } from 'react';
import { View, Text, TouchableOpacity, FlatList, StyleSheet } from 'react-native';
import TodoInput from './ToDoInput';

const ToDoItem = ({ text, completed = false, onToggle, onDelete }) => {
    return (
        <View style={styles.itemContainer}>
            <TouchableOpacity
                style={[styles.checkbox, completed && styles.checkboxCompleted]}
                onPress={onToggle}
            >
                {completed && <Text style={styles.checkmark}>✓</Text>}
            </TouchableOpacity>

            <Text
                style={[
                    styles.text,
                    completed && styles.textCompleted
                ]}
                numberOfLines={0}
            >
                {text}
            </Text>

            <TouchableOpacity onPress={onDelete} style={styles.deleteButton}>
                <Text style={styles.crossText}>×</Text>
            </TouchableOpacity>
        </View>
    );
};

const ToDoList = () => {
    const [todos, setToDos] = useState([
        { id: 1, text: 'Complete online JavaScript course', completed: true },
        { id: 2, text: 'Jog around the park 3x', completed: false },
        { id: 3, text: '10 minutes meditation', completed: false },
        { id: 4, text: 'Read for 1 hour', completed: false },
        { id: 5, text: 'Pick up groceries', completed: false },
        { id: 6, text: 'Complete ToDo App on Frontend Mentor', completed: false },
    ]);

    const addToDo = (text) => {
        const newToDo = {
            id: Date.now(),
            text: text,
            completed: false,
        };
        setToDos([newToDo, ...todos]);
    };

    const toggleToDo = (id) => {
        setToDos(todos.map(todo =>
            todo.id === id ? { ...todo, completed: !todo.completed } : todo
        ));
    };

    const deleteToDo = (id) => {
        setToDos(todos.filter(todo => todo.id !== id));
    };

    return (
        <View style={styles.container}>
            <TodoInput onAddTodo={addToDo} />

            <View style={styles.todoListContainer}>
                <FlatList
                    data={todos}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={({ item }) => (
                        <ToDoItem
                            text={item.text}
                            completed={item.completed}
                            onToggle={() => toggleToDo(item.id)}
                            onDelete={() => deleteToDo(item.id)}
                        />
                    )}
                    contentContainerStyle={{ flexGrow: 1 }}
                    style={{ height: '100%' }}
                />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    todoListContainer: {
        flex: 1,
        minHeight: 350,
        // both flex & height required for iOS render
        backgroundColor: 'white',
        marginHorizontal: 20,
        borderRadius: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 10,
        elevation: 5,
    },
    itemContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 25,
        paddingVertical: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#f3f4f6',
    },
    checkbox: {
        width: 24,
        height: 24,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#e5e7eb',
        marginRight: 16,
        justifyContent: 'center',
        alignItems: 'center',
    },
    checkboxCompleted: {
        backgroundColor: '#a78bfa',
        borderColor: '#a78bfa',
    },
    checkmark: {
        color: 'white',
        fontSize: 14,
        fontWeight: 'bold',
    },
    text: {
        flex: 1,
        fontSize: 18,
        color: '#333',
        fontFamily: 'JosefinSans_400Regular',
    },
    textCompleted: {
        textDecorationLine: 'line-through',
        color: '#9ca3af',
    },
    deleteButton: {
        marginLeft: 12,
        padding: 4,
    },
    crossText: {
        fontSize: 18,
        color: '#6b7280',
        fontWeight: 'bold',
    },
});

export default ToDoList;