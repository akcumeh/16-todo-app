import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    ImageBackground
} from 'react-native';
import { useState } from 'react';
import SunIcon from '../assets/images/icon-sun.svg';
import MoonIcon from '../assets/images/icon-moon.svg';

const Header = () => {
    const [isDarkMode, setIsDarkMode] = useState(false);

    const toggleTheme = () => {
        setIsDarkMode(!isDarkMode);
    };

    return (
        <ImageBackground
            source={
                isDarkMode
                    ? require('../assets/images/bg-mobile-dark.jpg')
                    : require('../assets/images/bg-mobile-light.jpg')
            }
            style={styles.backgroundImage}
        >
            <View style={styles.container}>
                <Text style={styles.title}>TODO</Text>

                <TouchableOpacity onPress={toggleTheme} style={styles.themeButton}>
                    {isDarkMode ? (
                        <SunIcon width={26} height={26} />
                    ) : (
                        <MoonIcon width={26} height={26} />
                    )}
                </TouchableOpacity>
            </View>
        </ImageBackground>
    );
};

const styles = StyleSheet.create({
    backgroundImage: {
        width: '100%',
        height: 200,
        paddingTop: 50,
    },
    container: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        flex: 1,
        paddingHorizontal: 25,
    },
    title: {
        fontSize: 32,
        fontWeight: '700',
        color: '#FFFFFF',
        letterSpacing: 8,
        fontFamily: 'JosefinSans_700Bold',
    },
    themeButton: {
        padding: 8,
    },
});

export default Header;