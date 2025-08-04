import { View } from 'react-native';

import Header from '../components/Header';
import ToDoList from '../components/ToDoList';

const ToDo = () => {
    return (
        <View>
            <Header />
            <ToDoList />
            {/* Filter */}
        </View>
    )
}

export default ToDo;