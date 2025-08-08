import { View, StyleSheet } from 'react-native';
import { useState } from 'react';
import Header from '../components/Header';
import ToDoList from '../components/ToDoList';

const ToDo = () => {
    const [isDarkMode, setIsDarkMode] = useState(false);

    const toggleTheme = () => {
        setIsDarkMode(!isDarkMode);
    };

    return (
        <View style={[
            styles.container,
            { backgroundColor: isDarkMode ? 'hsl(235, 21%, 11%)' : 'hsl(0, 0%, 98%)' }
        ]}>
            <Header isDarkMode={isDarkMode} toggleTheme={toggleTheme} />
            <ToDoList isDarkMode={isDarkMode} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
});

export default ToDo;