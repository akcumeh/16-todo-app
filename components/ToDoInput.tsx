import { useState } from 'react';
import { View, TextInput, TouchableOpacity, StyleSheet, Animated } from 'react-native';
import CrossIcon from '../assets/images/icon-cross.svg';

interface TodoInputProps {
    onAddTodo: (text: string) => void;
    isDarkMode: boolean;
}

const TodoInput = ({ onAddTodo, isDarkMode }: TodoInputProps) => {
    const [inputText, setInputText] = useState<string>('');
    const [crossOpacity] = useState(new Animated.Value(0));

    const handleTextChange = (text: string) => {
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
        <View style={[
            styles.container,
            { backgroundColor: isDarkMode ? 'hsl(235, 24%, 19%)' : 'white' }
        ]}>
            <View style={[
                styles.emptyCircle,
                { borderColor: isDarkMode ? 'hsl(237, 14%, 26%)' : '#e5e7eb' }
            ]} />

            <TextInput
                style={[
                    styles.textInput,
                    { color: isDarkMode ? 'hsl(234, 39%, 85%)' : '#374151' }
                ]}
                value={inputText}
                onChangeText={handleTextChange}
                placeholder="Create a new todo..."
                placeholderTextColor={isDarkMode ? 'hsl(235, 16%, 43%)' : '#9ca3af'}
                onSubmitEditing={handleSubmit}
                returnKeyType="done"
                multiline={false}
                numberOfLines={1}
            />

            <Animated.View style={[styles.crossContainer, { opacity: crossOpacity }]}>
                <TouchableOpacity onPress={handleClear} style={styles.crossButton}>
                    <CrossIcon width={18} height={18} />
                </TouchableOpacity>
            </Animated.View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: 5,
        paddingHorizontal: 25,
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
    },
    textInput: {
        flex: 1,
        fontSize: 16,
        padding: 0,
        fontFamily: 'JosefinSans_400Regular',
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
});

export default TodoInput;