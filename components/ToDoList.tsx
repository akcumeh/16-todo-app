import { useState, useRef } from 'react';
import { View, Text, TouchableOpacity, FlatList, StyleSheet, Animated } from 'react-native';
import TodoInput from './ToDoInput';
import CrossIcon from '../assets/images/icon-cross.svg';
import CheckIcon from '../assets/images/icon-check.svg';

interface Todo {
    id: number;
    text: string;
    completed: boolean;
}

interface ToDoItemProps {
    text: string;
    completed: boolean;
    onToggle: () => void;
    onDelete: () => void;
    isDarkMode: boolean;
}

interface ToDoListProps {
    isDarkMode: boolean;
}

const ToDoItem = ({ text, completed = false, onToggle, onDelete, isDarkMode }: ToDoItemProps) => {
    const slideAnim = useRef(new Animated.Value(0)).current;
    const opacityAnim = useRef(new Animated.Value(1)).current;

    const handleDelete = () => {
        Animated.parallel([
            Animated.timing(slideAnim, {
                toValue: -300,
                duration: 250,
                useNativeDriver: true,
            }),
            Animated.timing(opacityAnim, {
                toValue: 0,
                duration: 250,
                useNativeDriver: true,
            }),
        ]).start(() => {
            onDelete();
        });
    };

    return (
        <Animated.View style={[
            styles.itemContainer,
            {
                borderBottomColor: isDarkMode ? 'hsl(237, 14%, 26%)' : '#f3f4f6',
                transform: [{ translateX: slideAnim }],
                opacity: opacityAnim,
            }
        ]}>
            <TouchableOpacity
                style={[
                    styles.checkbox,
                    { borderColor: isDarkMode ? 'hsl(237, 14%, 26%)' : '#e5e7eb' },
                    completed && styles.checkboxCompleted
                ]}
                onPress={onToggle}
            >
                {completed && <CheckIcon width={11} height={9} />}
            </TouchableOpacity>

            <Text
                style={[
                    styles.text,
                    {
                        color: completed
                            ? (isDarkMode ? 'hsl(235, 16%, 43%)' : '#9ca3af')
                            : (isDarkMode ? 'hsl(234, 39%, 85%)' : '#333'),
                        textDecorationLine: completed ? 'line-through' : 'none'
                    }
                ]}
                numberOfLines={0}
            >
                {text}
            </Text>

            <TouchableOpacity onPress={handleDelete} style={styles.deleteButton}>
                <CrossIcon width={18} height={18} />
            </TouchableOpacity>
        </Animated.View>
    );
};

const ToDoList = ({ isDarkMode }: ToDoListProps) => {
    const [todos, setToDos] = useState<Todo[]>([
        { id: 1, text: 'Complete online JavaScript course', completed: true },
        { id: 2, text: 'Jog around the park 3x', completed: false },
        { id: 3, text: '10 minutes meditation', completed: false },
        { id: 4, text: 'Read for 1 hour', completed: false },
        { id: 5, text: 'Pick up groceries', completed: false },
        { id: 6, text: 'Complete ToDo App on Frontend Mentor', completed: false },
    ]);

    const addToDo = (text: string) => {
        const newToDo: Todo = {
            id: Date.now(),
            text: text,
            completed: false,
        };
        setToDos([newToDo, ...todos]);
    };

    const toggleToDo = (id: number) => {
        setToDos(todos.map(todo =>
            todo.id === id ? { ...todo, completed: !todo.completed } : todo
        ));
    };

    const deleteToDo = (id: number) => {
        setToDos(todos.filter(todo => todo.id !== id));
    };

    return (
        <View style={styles.container}>
            <TodoInput onAddTodo={addToDo} isDarkMode={isDarkMode} />

            <View style={[
                styles.todoListContainer,
                { backgroundColor: isDarkMode ? 'hsl(235, 24%, 19%)' : 'white' }
            ]}>
                <FlatList
                    data={todos}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={({ item }) => (
                        <ToDoItem
                            text={item.text}
                            completed={item.completed}
                            onToggle={() => toggleToDo(item.id)}
                            onDelete={() => deleteToDo(item.id)}
                            isDarkMode={isDarkMode}
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
    },
    checkbox: {
        width: 24,
        height: 24,
        borderRadius: 12,
        borderWidth: 1,
        marginRight: 16,
        justifyContent: 'center',
        alignItems: 'center',
    },
    checkboxCompleted: {
        backgroundColor: '#a78bfa',
        borderColor: '#a78bfa',
    },
    text: {
        flex: 1,
        fontSize: 18,
        fontFamily: 'JosefinSans_400Regular',
    },
    deleteButton: {
        marginLeft: 12,
        padding: 4,
    },
});

export default ToDoList;