import React, { useState, useRef, useMemo } from 'react';
import { View, Text, TouchableOpacity, FlatList, StyleSheet, Animated, LayoutChangeEvent } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Reanimated, {
    useSharedValue,
    useAnimatedStyle,
    runOnJS,
    withSpring,
} from 'react-native-reanimated';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
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
    onDrag: (draggedY: number) => void;
    onDragEnd: () => void;
    index: number;
    draggedIndex: number | null;
    hoveredIndex: number | null;
    onLayout: (index: number, height: number) => void;
    itemHeights: { [key: number]: number };
}

interface ToDoListProps {
    isDarkMode: boolean;
}

const MIN_ITEM_HEIGHT = 65;

const ToDoItem = ({
    text,
    completed = false,
    onToggle,
    onDelete,
    isDarkMode,
    onDrag,
    onDragEnd,
    index,
    draggedIndex,
    hoveredIndex,
    onLayout,
    itemHeights
}: ToDoItemProps) => {
    const [isHovered, setIsHovered] = useState(false);
    const translateY = useSharedValue(0);
    const scale = useSharedValue(1);
    const zIndex = useSharedValue(0);

    const slideAnim = useRef(new Animated.Value(0)).current;
    const opacityAnim = useRef(new Animated.Value(1)).current;

    const currentItemHeight = itemHeights[index] || MIN_ITEM_HEIGHT;

    const panGesture = Gesture.Pan()
        .minPointers(1)
        .activateAfterLongPress(500)
        .onStart(() => {
            scale.value = withSpring(1.05);
            zIndex.value = 1000;
        })
        .onUpdate((event) => {
            translateY.value = event.translationY;
            runOnJS(onDrag)(event.absoluteY);
        })
        .onEnd(() => {
            translateY.value = withSpring(0, { duration: 200 });
            scale.value = withSpring(1, { duration: 200 });
            zIndex.value = 0;
            runOnJS(onDragEnd)();
        });

    const handleDelete = () => {
        Animated.parallel([
            Animated.timing(slideAnim, {
                toValue: -400,
                duration: 300,
                useNativeDriver: true,
            }),
            Animated.timing(opacityAnim, {
                toValue: 0,
                duration: 300,
                useNativeDriver: true,
            }),
        ]).start(() => {
            onDelete();
        });
    };

    const handleLayout = (event: LayoutChangeEvent) => {
        const { height } = event.nativeEvent.layout;
        const finalHeight = Math.max(height, MIN_ITEM_HEIGHT);
        onLayout(index, finalHeight);
    };

    const dragAnimatedStyle = useAnimatedStyle(() => {
        let shiftAmount = 0;

        if (draggedIndex !== null && hoveredIndex !== null && draggedIndex !== index) {
            if (hoveredIndex > draggedIndex) {
                // Dragging downward
                if (index > draggedIndex && index <= hoveredIndex) {
                    shiftAmount = -currentItemHeight;
                }
            } else {
                // Dragging upward
                if (index >= hoveredIndex && index < draggedIndex) {
                    shiftAmount = currentItemHeight;
                }
            }
        }

        return {
            transform: [
                { translateY: translateY.value + shiftAmount },
                { scale: scale.value },
            ],
            zIndex: zIndex.value,
        };
    });

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
        <GestureDetector gesture={panGesture}>
            <Reanimated.View style={[dragAnimatedStyle]}>
                <Animated.View
                    style={[
                        styles.itemContainer,
                        {
                            backgroundColor: isDarkMode ? 'hsl(235, 24%, 19%)' : 'white',
                            borderBottomColor: isDarkMode ? 'hsl(237, 14%, 26%)' : '#f3f4f6',
                            minHeight: MIN_ITEM_HEIGHT,
                            transform: [{ translateX: slideAnim }],
                            opacity: opacityAnim,
                        }
                    ]}
                    onLayout={handleLayout}
                >
                    <TouchableOpacity
                        onPress={onToggle}
                        onPressIn={() => setIsHovered(true)}
                        onPressOut={() => setIsHovered(false)}
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
            </Reanimated.View>
        </GestureDetector>
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
    const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
    const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
    const [itemHeights, setItemHeights] = useState<{ [key: number]: number }>({});
    const listRef = useRef<View>(null);

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

    const handleItemLayout = (index: number, height: number) => {
        setItemHeights(prev => ({ ...prev, [index]: height }));
    };

    const getCumulativeHeight = (upToIndex: number): number => {
        let totalHeight = 0;
        for (let i = 0; i < upToIndex; i++) {
            totalHeight += itemHeights[i] || MIN_ITEM_HEIGHT;
        }
        return totalHeight;
    };

    const getIndexFromPosition = (yPosition: number): number => {
        let currentHeight = 0;
        for (let i = 0; i < filteredTodos.length; i++) {
            const itemHeight = itemHeights[i] || MIN_ITEM_HEIGHT;
            if (yPosition < currentHeight + itemHeight / 2) {
                return i;
            }
            currentHeight += itemHeight;
        }
        return filteredTodos.length - 1;
    };

    const handleDrag = (index: number) => (absoluteY: number) => {
        setDraggedIndex(index);

        if (listRef.current) {
            listRef.current.measure((x, y, width, height, pageX, pageY) => {
                const relativeY = absoluteY - pageY;
                const newHoveredIndex = getIndexFromPosition(relativeY);
                const clampedIndex = Math.max(0, Math.min(filteredTodos.length - 1, newHoveredIndex));
                setHoveredIndex(clampedIndex);
            });
        }
    };

    const handleDragEnd = () => {
        if (draggedIndex === null || hoveredIndex === null || draggedIndex === hoveredIndex) {
            setDraggedIndex(null);
            setHoveredIndex(null);
            return;
        }

        const draggedItem = filteredTodos[draggedIndex];

        if (activeFilter === 'all') {
            const newTodos = [...todos];
            const draggedOriginalIndex = newTodos.findIndex(todo => todo.id === draggedItem.id);
            const hoveredOriginalIndex = newTodos.findIndex(todo => todo.id === filteredTodos[hoveredIndex].id);

            newTodos.splice(draggedOriginalIndex, 1);
            newTodos.splice(hoveredOriginalIndex, 0, draggedItem);
            setToDos(newTodos);
        } else {
            const newFilteredTodos = [...filteredTodos];
            newFilteredTodos.splice(draggedIndex, 1);
            newFilteredTodos.splice(hoveredIndex, 0, draggedItem);

            const newTodos = todos.map(todo => {
                const filteredIndex = newFilteredTodos.findIndex(ft => ft.id === todo.id);
                if (filteredIndex !== -1) {
                    return newFilteredTodos[filteredIndex];
                }
                return todo;
            });

            setToDos(newTodos);
        }
        
        setItemHeights({});
        setDraggedIndex(null);
        setHoveredIndex(null);
    };

    return (
        <View style={styles.container}>
            <TodoInput onAddTodo={addToDo} isDarkMode={isDarkMode} />

            <View
                ref={listRef}
                style={[
                    styles.todoListContainer,
                    { backgroundColor: isDarkMode ? 'hsl(235, 24%, 19%)' : 'white' }
                ]}
            >
                <FlatList
                    data={filteredTodos}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={({ item, index }) => (
                        <ToDoItem
                            text={item.text}
                            completed={item.completed}
                            onToggle={() => toggleToDo(item.id)}
                            onDelete={() => deleteToDo(item.id)}
                            isDarkMode={isDarkMode}
                            onDrag={handleDrag(index)}
                            onDragEnd={handleDragEnd}
                            index={index}
                            draggedIndex={draggedIndex}
                            hoveredIndex={hoveredIndex}
                            onLayout={handleItemLayout}
                            itemHeights={itemHeights}
                        />
                    )}
                    scrollEnabled={false}
                    showsVerticalScrollIndicator={false}
                    style={styles.flatList}
                    contentContainerStyle={styles.flatListContent}
                />

                <Filter
                    isDarkMode={isDarkMode}
                    activeFilter={activeFilter}
                    onFilterChange={setActiveFilter}
                    itemsLeft={itemsLeft}
                    onClearCompleted={clearCompleted}
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
        width: '100%',
        maxWidth: 720,
        alignSelf: 'center',
    },
    todoListContainer: {
        marginHorizontal: 25,
        borderRadius: 5,
        marginTop: 10,
    },
    flatList: {
        flexGrow: 0,
    },
    flatListContent: {
    },
    itemContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 25,
        paddingVertical: 16,
        borderBottomWidth: 1,
        backgroundColor: 'transparent',
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