import {
    View,
    Text,
    TouchableOpacity,
    // Image,
    StyleSheet,
    ImageBackground
} from 'react-native';
import { useState } from 'react';

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

                <TouchableOpacity
                    onPress={toggleTheme}
                    style={styles.themeButton}
                >
                    <Text style={styles.themeIcon}>
                        {
                            isDarkMode
                                ? "☀️"
                                : "🌙"
                        }
                    </Text>
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
        paddingHorizontal: 20,
    },
    container: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        flex: 1,
    },
    title: {
        fontSize: 32,
        fontWeight: '700',
        color: '#FFFFFF',
        letterSpacing: 8,
        fontFamily: 'System',
    },
    themeButton: {
        padding: 8,
    },
    themeIcon: {
        width: 24,
        height: 24,
        tintColor: '#FFFFFF',
    },
});

export default Header;