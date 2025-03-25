import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ImageBackground } from 'react-native';
import { useRouter } from 'expo-router';
import { register } from '../services/authService';

export default function Signup() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleSignup = async () => {
        setLoading(true);
        if (!username || !password || !confirmPassword) {
            Alert.alert('Error', 'Please fill in all fields');
            setLoading(false);
            return;
        }

        if (password !== confirmPassword) {
            Alert.alert('Error', 'Passwords do not match');
            setLoading(false);
            return;
        }

        try {
            await register({ username, password, confirmPassword });
            Alert.alert('Success', 'Signup successful. Please login.');
            setTimeout(() => {
                router.replace('/Login');
            }, 500);
        } catch (error: any) {
            Alert.alert('Error', error.message || 'Signup failed');
        } finally {
            setLoading(false);
        }
    };

    return (
            <View style={styles.container}>
                <Text style={styles.title}>Signup</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Username"
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
                <TextInput
                    style={styles.input}
                    placeholder="Confirm Password"
                    secureTextEntry
                    value={confirmPassword}
                    onChangeText={setConfirmPassword}
                />
                <TouchableOpacity style={styles.button} onPress={handleSignup} disabled={loading}>
                    <Text style={styles.buttonText}>{loading ? 'Signing up...' : 'Signup'}</Text>
                </TouchableOpacity>
            </View>
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
});