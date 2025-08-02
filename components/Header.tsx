import { View, Text, Button } from 'react-native';

const Header = () => {
    return (
        <View>
            <Text>TODO</Text>
            <Button
                title={"Switch Theme"}
                onPress={() => console.log(`Switched theme.`)}
            />
            <Text>Welcome to the To-Do App!</Text>
        </View>
    )
}

export default Header;