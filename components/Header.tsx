import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    ImageBackground,
    Animated
} from 'react-native';
import { useRef } from 'react';
import SunIcon from '../assets/images/icon-sun.svg';
import MoonIcon from '../assets/images/icon-moon.svg';

interface HeaderProps {
    isDarkMode: boolean;
    toggleTheme: () => void;
}

const Header = ({ isDarkMode, toggleTheme }: HeaderProps) => {
    const rotateAnim = useRef(new Animated.Value(0)).current;

    const handleToggleTheme = () => {
        toggleTheme();

        Animated.timing(rotateAnim, {
            toValue: 1,
            duration: 300,
            useNativeDriver: true,
        }).start(() => {
            rotateAnim.setValue(0);
        });
    };

    const rotation = rotateAnim.interpolate({
        inputRange: [0, 1],
        outputRange: ['-30deg', '0deg'],
    });

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

                <TouchableOpacity onPress={handleToggleTheme} style={styles.themeButton}>
                    <Animated.View style={{ transform: [{ rotate: rotation }] }}>
                        {isDarkMode ? (
                            <SunIcon width={26} height={26} />
                        ) : (
                            <MoonIcon width={26} height={26} />
                        )}
                    </Animated.View>
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