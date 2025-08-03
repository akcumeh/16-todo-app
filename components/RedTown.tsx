import { View, Text, Button, StyleSheet } from 'react-native';
import { useState } from 'react';

const RedTown = () => {
    const [isRed, setIsRed] = useState(false);

    const toggleColor = () => {
        setIsRed(!isRed);
    };

    return (
        <View style={[
            styles.container,
            { backgroundColor: isRed ? 'red' : 'white' }
        ]}>
            <Text style={[
                styles.text,
                { color: isRed ? 'white' : 'purple' }
            ]}>
                this town is red 
            </Text>

            <Button
                title={isRed ? "Reset" : "Paint the town red!"}
                onPress={toggleColor}
                color={isRed ? 'red' : 'purple'}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    text: {
        fontSize: 20,
        fontWeight: 'bold',
        textAlign: 'center',
    }
});

export default RedTown;