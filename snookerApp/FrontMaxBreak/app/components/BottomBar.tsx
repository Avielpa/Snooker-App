import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { usePathname, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { TouchableOpacity, View, Text, StyleSheet } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Header from "./Header";
import Sidebar from "./Sidebar"




const BottomBar = () => {
    const router = useRouter();
    const pathname = usePathname();
    const insets = useSafeAreaInsets();
    
    const goHome = () => {
      setTimeout(() => {
        router.replace('/');
    }, 500);
    };
    
    return (
      <View style={[styles.bottomBar, { paddingBottom: Math.max(insets.bottom, 10) }]}>
        <TouchableOpacity 
          style={[styles.bottomBarItem, pathname === '/' && styles.activeBottomBarItem]} 
          onPress={goHome}
        >
          <Ionicons 
            name={pathname === '/' ? 'home' : 'home-outline'} 
            size={24} 
            color={pathname === '/' ? '#D6A346' : 'white'} 
          />
          <Text style={[styles.bottomBarText, pathname === '/' && styles.activeBottomBarText]}>Home</Text>
        </TouchableOpacity>
      </View>
    );
  };
  
  // קומפוננטה ראשית שמחברת את כל הקומפוננטות הקודמות
  const NavigationComponents = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    
    useEffect(() => {
      const checkLoginStatus = async () => {
        const token = await AsyncStorage.getItem('userToken');
        setIsLoggedIn(!!token);
      };
      
      checkLoginStatus();
      const interval = setInterval(checkLoginStatus, 1000);
      return () => clearInterval(interval);
    }, []);
    
    return (
      <>
        <Header onMenuPress={() => setIsSidebarOpen(true)} />
        {isLoggedIn && <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />}
        <BottomBar />
      </>
    );
};
  

const styles = StyleSheet.create({
    
    // סגנונות לסרגל תחתון
    bottomBar: {
        backgroundColor: '#0B5D2F',
        flexDirection: 'row',
        justifyContent: 'center',
        borderTopWidth: 1,
        borderTopColor: 'rgba(255,255,255,0.2)',
    },
    bottomBarItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 10,
        paddingHorizontal: 20,
    },
    activeBottomBarItem: {
        borderTopWidth: 2,
        borderTopColor: '#D6A346',
    },
    bottomBarText: {
        color: 'white',
        marginLeft: 5,
        fontSize: 14,
    },
    activeBottomBarText: {
        color: '#D6A346',
        fontWeight: 'bold',
    },
});


export default BottomBar;