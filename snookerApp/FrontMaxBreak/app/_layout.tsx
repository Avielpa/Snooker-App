import React, { useState, useEffect } from 'react';
import { ImageBackground, View } from 'react-native';
import './globals.css';
import { Stack } from 'expo-router';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import BottomBar from './components/BottomBar';

export default function RootLayout() {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    
    useEffect(() => {
        const checkLoginStatus = async () => {
            const token = await AsyncStorage.getItem('userToken');
            setIsLoggedIn(!!token);
        };
        
        checkLoginStatus();
        // האזנה לשינויים במצב ההתחברות
        const interval = setInterval(checkLoginStatus, 1000);
        return () => clearInterval(interval);
    }, []);

    return (
        <SafeAreaProvider>
            <ImageBackground 
                source={require('../assets/snooker_background.jpg')} 
                resizeMode='cover' 
                style={{ flex: 1 }}
            >
                <Header onMenuPress={() => setIsSidebarOpen(true)} />
                
                <View style={{ flex: 1 }}>
                    <Stack 
                        screenOptions={{
                            headerShown: false,
                            contentStyle: {
                                backgroundColor: 'transparent'
                            }
                        }}
                    />
                </View>
                
                {isLoggedIn && <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />}
                <BottomBar />
            </ImageBackground>
        </SafeAreaProvider>
    );
}