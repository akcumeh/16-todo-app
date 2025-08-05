import { useState } from 'react';
import { View, TextInput, TouchableOpacity, StyleSheet, Animated, Image } from 'react-native';

const TodoInput = ({ onAddTodo }) => {
    const [inputText, setInputText] = useState('');
    const [crossOpacity] = useState(new Animated.Value(0));

    const handleTextChange = (text) => {
        setInputText(text);

        Animated.timing(crossOpacity, {
            toValue: text.length > 0 ? 1 : 0,
            duration: 250,
            useNativeDriver: true,
        }).start();
    };

    const handleSubmit = () => {
        if (inputText.trim()) {
            onAddTodo(inputText.trim());
            setInputText('');
            Animated.timing(crossOpacity, {
                toValue: 0,
                duration: 250,
                useNativeDriver: true,
            }).start();
        }
    };

    const handleClear = () => {
        setInputText('');
        Animated.timing(crossOpacity, {
            toValue: 0,
            duration: 250,
            useNativeDriver: true,
        }).start();
    };

    return (
        <View style={styles.container}>
            <View style={styles.emptyCircle} />

            <TextInput
                style={styles.textInput}
                value={inputText}
                onChangeText={handleTextChange}
                placeholder="Create a new todo..."
                placeholderTextColor="#9ca3af"
                onSubmitEditing={handleSubmit}
                returnKeyType="done"
                multiline={false}
                numberOfLines={1}
            />

            <Animated.View style={[styles.crossContainer, { opacity: crossOpacity }]}>
                <TouchableOpacity onPress={handleClear} style={styles.crossButton}>
                    <Image
                        source={require('../assets/images/icon-cross.svg')}
                        style={styles.crossIcon}
                    />
                </TouchableOpacity>
            </Animated.View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'white',
        borderRadius: 5,
        paddingHorizontal: 20,
        paddingVertical: 16,
        marginHorizontal: 20,
        marginTop: -30,
        marginBottom: 20,
        gap: 16,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 10,
        elevation: 5,
    },
    emptyCircle: {
        width: 24,
        height: 24,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#e5e7eb',
    },
    textInput: {
        flex: 1,
        fontSize: 16,
        color: '#374151',
        padding: 0,
    },
    crossContainer: {
        width: 20,
        height: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
    crossButton: {
        padding: 2,
    },
    crossIcon: {
        width: 18,
        height: 18,
    },
});

export default TodoInput;