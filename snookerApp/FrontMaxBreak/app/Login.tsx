import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ImageBackground } from 'react-native';
import { useRouter } from 'expo-router';
import { login } from '../services/authService';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function Login() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleLogin = async () => {
        setLoading(true);
        if (!username || !password) {
            Alert.alert('Error', 'Please fill in all fields');
            setLoading(false);
            return;
        }

        try {
            const userData = await login({ username, password });
            if (userData && userData.access) {
                await AsyncStorage.setItem('userToken', userData.access);
                router.replace('/')
            } else {
                Alert.alert('Error', 'Login failed. Please check your credentials.');
            }
        } catch (error: any) {
            Alert.alert('Error', error.message || 'Login failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <ImageBackground source={require('../assets/snooker_background.jpg')} style={styles.backgroundImage}>
            <View style={styles.container}>
                <Text style={styles.title}>Login</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Usernam"
                        value={username}
                        onChangeText={setUsername}
                    />
                <TextInput
                    style={styles.input}
                    placeholder="Password"
                    secureTextEntry
                    value={password}
                    onChangeText={setPassword}
                />
                <TouchableOpacity style={styles.button} onPress={handleLogin} disabled={loading}>
                    <Text style={styles.buttonText}>{loading ? 'Logging in...' : 'Login'}</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => router.push('/Signup')}>
                    <Text style={styles.signupText}>You don't have a user? Signup here</Text>
                </TouchableOpacity>
            </View>
        </ImageBackground>

    );
}

const styles = StyleSheet.create({
    backgroundImage: {
        flex: 1,
        resizeMode: 'cover',
    },
    container: {
        flex: 1,
        justifyContent: 'center',
        padding: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center',
        color: 'white',
    },
    input: {
        height: 40,
        borderColor: 'gray',
        borderWidth: 1,
        marginBottom: 10,
        padding: 10,
        backgroundColor: 'white',
    },
    button: {
        backgroundColor: 'green',
        padding: 10,
        borderRadius: 5,
        alignItems: 'center',
    },
    buttonText: {
        color: 'white',
        fontSize: 16,
    },
    signupText: {
        color: 'white',
        marginTop: 10,
        textAlign: 'center',
    },
});