import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

interface FilterProps {
    isDarkMode: boolean;
    activeFilter: 'all' | 'active' | 'completed';
    onFilterChange: (filter: 'all' | 'active' | 'completed') => void;
    itemsLeft: number;
    onClearCompleted: () => void;
}

const Filter = ({ isDarkMode, activeFilter, onFilterChange, itemsLeft, onClearCompleted }: FilterProps) => {
    return (
        <View style={[
            styles.container,
            {
                backgroundColor: isDarkMode ? 'hsl(235, 24%, 19%)' : 'white',
                borderTopColor: isDarkMode ? 'hsl(237, 14%, 26%)' : '#f3f4f6'
            }
        ]}>
            <Text style={[
                styles.itemsLeft,
                { color: isDarkMode ? 'hsl(235, 16%, 43%)' : '#9ca3af' }
            ]}>
                {itemsLeft} items left
            </Text>

            <View style={styles.filterButtons}>
                <TouchableOpacity
                    onPress={() => onFilterChange('all')}
                    style={styles.filterButton}
                >
                    <Text style={[
                        styles.filterText,
                        {
                            color: activeFilter === 'all'
                                ? 'hsl(220, 98%, 61%)'
                                : (isDarkMode ? 'hsl(235, 16%, 43%)' : '#9ca3af')
                        }
                    ]}>
                        All
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity
                    onPress={() => onFilterChange('active')}
                    style={styles.filterButton}
                >
                    <Text style={[
                        styles.filterText,
                        {
                            color: activeFilter === 'active'
                                ? 'hsl(220, 98%, 61%)'
                                : (isDarkMode ? 'hsl(235, 16%, 43%)' : '#9ca3af')
                        }
                    ]}>
                        Active
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity
                    onPress={() => onFilterChange('completed')}
                    style={styles.filterButton}
                >
                    <Text style={[
                        styles.filterText,
                        {
                            color: activeFilter === 'completed'
                                ? 'hsl(220, 98%, 61%)'
                                : (isDarkMode ? 'hsl(235, 16%, 43%)' : '#9ca3af')
                        }
                    ]}>
                        Completed
                    </Text>
                </TouchableOpacity>
            </View>

            <TouchableOpacity onPress={onClearCompleted}>
                <Text style={[
                    styles.clearCompleted,
                    { color: isDarkMode ? 'hsl(235, 16%, 43%)' : '#9ca3af' }
                ]}>
                    Clear Completed
                </Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 25,
        paddingVertical: 16,
        borderTopWidth: 1,
    },
    itemsLeft: {
        fontSize: 14,
        fontFamily: 'JosefinSans_400Regular',
    },
    filterButtons: {
        flexDirection: 'row',
        gap: 15,
    },
    filterButton: {
        paddingHorizontal: 5,
    },
    filterText: {
        fontSize: 16,
        fontFamily: 'JosefinSans_700Bold',
    },
    clearCompleted: {
        fontSize: 14,
        fontFamily: 'JosefinSans_400Regular',
    },
});

export default Filter;