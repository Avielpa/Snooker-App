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
    backgroundColor: '#0B5D2F',
    width: '100%', // or use Dimensions.get('window').width if needed
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.2)',
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
    paddingVertical: 8,
  },
  menuButton: {
    padding: 8,
  },
  title: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
  },
  loginButton: {
    backgroundColor: '#D6A346',
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 4,
  },
  signupButton: {
    backgroundColor: '#D6A346',
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 4,
    marginLeft: 5,
  },
  loginButtonText: {
    color: 'white',
    fontWeight: "600",
    fontSize: 12,
  },
  authButtonsContainer: {
    flexDirection: 'row',
  }
})

export default Header;