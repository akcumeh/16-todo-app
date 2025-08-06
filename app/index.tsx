import { View, StyleSheet } from 'react-native';
import Header from '../components/Header';
import ToDoList from '../components/ToDoList';

const ToDo = () => {
    return (
        <View style={styles.container}>
            <Header />
            <ToDoList />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
});

export default ToDo;