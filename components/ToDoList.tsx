import { useState, useRef, useMemo } from 'react';
import { View, Text, TouchableOpacity, FlatList, StyleSheet, Animated } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import TodoInput from './ToDoInput';
import Filter from './Filter';
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
    const [isHovered, setIsHovered] = useState(false);

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

    const renderCheckbox = () => {
        if (completed) {
            return (
                <LinearGradient
                    colors={['hsl(192, 100%, 67%)', 'hsl(280, 87%, 65%)']}
                    style={styles.checkboxCompleted}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                >
                    <CheckIcon width={11} height={9} />
                </LinearGradient>
            );
        }

        if (isHovered) {
            return (
                <LinearGradient
                    colors={['hsl(192, 100%, 67%)', 'hsl(280, 87%, 65%)']}
                    style={styles.checkboxHovered}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                >
                    <View style={[
                        styles.checkboxInner,
                        { backgroundColor: isDarkMode ? 'hsl(235, 24%, 19%)' : 'white' }
                    ]} />
                </LinearGradient>
            );
        }

        return (
            <View style={[
                styles.checkboxEmpty,
                { borderColor: isDarkMode ? 'hsl(237, 14%, 26%)' : '#e5e7eb' }
            ]} />
        );
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
                onPress={onToggle}
                onPressIn={() => setIsHovered(true)}
                onPressOut={() => setIsHovered(false)}
                // @ts-ignore
                onMouseEnter={() => setIsHovered(true)}
                // @ts-ignore
                onMouseLeave={() => setIsHovered(false)}
                style={styles.checkboxContainer}
            >
                {renderCheckbox()}
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
    const [activeFilter, setActiveFilter] = useState<'all' | 'active' | 'completed'>('all');
    const [highlightAnimation] = useState(new Animated.Value(0));

    const filteredTodos = useMemo(() => {
        switch (activeFilter) {
            case 'active':
                return todos.filter(todo => !todo.completed);
            case 'completed':
                return todos.filter(todo => todo.completed);
            default:
                return todos;
        }
    }, [todos, activeFilter]);

    const itemsLeft = todos.filter(todo => !todo.completed).length;

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

    const clearCompleted = () => {
        setToDos(todos.filter(todo => !todo.completed));
    };

    const handleFilterChange = (filter: 'all' | 'active' | 'completed') => {
        const newPosition = filter === 'all' ? 0 : filter === 'active' ? 1 : 2;

        Animated.timing(highlightAnimation, {
            toValue: newPosition,
            duration: 300,
            useNativeDriver: true,
        }).start();

        setActiveFilter(filter);
    };

    return (
        <View style={styles.container}>
            <TodoInput onAddTodo={addToDo} isDarkMode={isDarkMode} />

            <View style={[
                styles.todoListContainer,
                { backgroundColor: isDarkMode ? 'hsl(235, 24%, 19%)' : 'white' }
            ]}>
                <FlatList
                    data={filteredTodos}
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
                    scrollEnabled={false}
                    showsVerticalScrollIndicator={false}
                />

                <Filter
                    isDarkMode={isDarkMode}
                    activeFilter={activeFilter}
                    onFilterChange={handleFilterChange}  // Make sure this is handleFilterChange
                    itemsLeft={itemsLeft}
                    onClearCompleted={clearCompleted}
                    highlightAnimation={highlightAnimation}
                />
            </View>

            <View style={[
                styles.dragNoticeContainer,
                {
                    borderColor: isDarkMode ? 'hsl(237, 14%, 26%)' : '#e5e7eb',
                }
            ]}>
                <Text style={[
                    styles.dragNotice,
                    { color: isDarkMode ? 'hsl(235, 16%, 43%)' : '#9ca3af' }
                ]}>
                    Drag and drop to reorder list
                </Text>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    todoListContainer: {
        marginHorizontal: 20,
        borderRadius: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 10,
        elevation: 5,
        marginTop: 10,
    },
    itemContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 25,
        paddingVertical: 16,
        borderBottomWidth: 1,
    },
    checkboxContainer: {
        marginRight: 16,
    },
    checkboxEmpty: {
        width: 24,
        height: 24,
        borderRadius: 12,
        borderWidth: 1,
    },
    checkboxCompleted: {
        width: 24,
        height: 24,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
    },
    checkboxHovered: {
        width: 24,
        height: 24,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 1,
    },
    checkboxInner: {
        width: 20,
        height: 20,
        borderRadius: 10,
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
    filterContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 25,
        paddingVertical: 16,
        borderTopWidth: 1,
        borderTopColor: '#f3f4f6',
    },
    filterButtonContainer: {
        position: 'relative',
        flexDirection: 'row',
    },
    highlight: {
        position: 'absolute',
        width: 45,
        height: 24,
        borderRadius: 4,
        top: -4,
        left: -5,
        zIndex: 1,
    },
    filterButtons: {
        flexDirection: 'row',
        gap: 15,
        zIndex: 2,
    },
    filterButton: {
        paddingHorizontal: 10,
        paddingVertical: 4,
    },
    filterText: {
        fontSize: 14,
        fontWeight: '700',
        fontFamily: 'JosefinSans_700Bold',
    },
    clearCompleted: {
        fontSize: 14,
        fontFamily: 'JosefinSans_400Regular',
    },
    dragNoticeContainer: {
        marginHorizontal: 20,
        marginTop: 20,
        paddingHorizontal: 20,
        paddingVertical: 16,
        alignItems: 'center',
    },
    dragNotice: {
        fontSize: 14,
        fontFamily: 'JosefinSans_400Regular',
        textAlign: 'center',
    },
});

export default ToDoList;