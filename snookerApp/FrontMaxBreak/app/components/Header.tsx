import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, StatusBar, Animated, Dimensions, Image } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter, usePathname } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Feather, Ionicons } from '@expo/vector-icons';


const Header = ({ onMenuPress } : any) => {  
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  
  // בדיקה האם המשתמש מחובר
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
  
  const handleLogout = async () => {
    await AsyncStorage.removeItem('userToken');
    setIsLoggedIn(false);
    setTimeout(() => {
      router.replace('/');
  }, 500);
  };
  
  const goToLogin = () => {
    setTimeout(() => {
      router.replace('/Login');
  }, 500);
  };
  
  const goToSignup = () => {
    setTimeout(() => {
      router.replace('/Signup');
  }, 500);
  };

  return (
    <View style={[styles.header, { paddingTop: insets.top }]}>
      <StatusBar backgroundColor="#0B5D2F" barStyle="light-content" />
      
      <View style={styles.headerRow}>
        {isLoggedIn && (
          <TouchableOpacity style={styles.menuButton} onPress={onMenuPress}> 
            <Feather name="menu" size={20} color="white" />
          </TouchableOpacity>
        )}
        
        <Text style={styles.title}>Snooker.org App</Text>
        
        {isLoggedIn ? (
          <TouchableOpacity style={styles.loginButton} onPress={handleLogout}>
            <Text style={styles.loginButtonText}>Logout</Text>
          </TouchableOpacity>
        ) : (
          <View style={styles.authButtonsContainer}>
            <TouchableOpacity style={styles.loginButton} onPress={goToLogin}>
              <Text style={styles.loginButtonText}>Login</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.signupButton} onPress={goToSignup}>
              <Text style={styles.loginButtonText}>Signup</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </View>
  );
};



const styles = StyleSheet.create({
  header: {
    backgroundColor: 'rgba(11, 93, 47, 0.95)',
    width: '100%',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.15)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 4,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  menuButton: {
    padding: 10,
  },
  title: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '700',
    fontFamily: 'System',
    letterSpacing: 0.5,
  },
  loginButton: {
    backgroundColor: '#D6A346',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  signupButton: {
    backgroundColor: '#D6A346',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
    marginLeft: 6,
  },
  loginButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 13,
    fontFamily: 'System',
  },
  authButtonsContainer: {
    flexDirection: 'row',
  },
});

export default Header;