import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { Animated, Dimensions, TouchableOpacity, View, Text, StyleSheet } from "react-native";

const Sidebar = ({ isOpen, onClose }: any) => {
  const translateX = useState(new Animated.Value(isOpen ? 0 : -300))[0];
  const screenWidth = Dimensions.get('window').width;
  const router = useRouter();
  
  useEffect(() => {
    Animated.timing(translateX, {
      toValue: isOpen ? 0 : -300,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, [isOpen]);
  
  const menuItems = [
    { name: 'Home', icon: 'home', route: '/' },
    { name: 'Profile', icon: 'user', route: '/Profile' },
    { name: 'Matches', icon: 'calendar', route: '/Matches' },
    { name: 'Ranking', icon: 'ranking', route: '/Ranking'},
    { name: 'Settings', icon: 'settings', route: '/Settings' },
  ];
  
  const navigateTo = (route : any) => {
    router.push(route);
    onClose();
  };
  
  if (!isOpen) return null;
  
  return (
    <View style={styles.sidebarContainer}>
      <TouchableOpacity style={styles.overlay} onPress={onClose} />
      
      <Animated.View style={[styles.sidebar, { transform: [{ translateX }] }]}>
        <View style={styles.sidebarHeader}>
          <Text style={styles.sidebarTitle}>Menu</Text>
          <TouchableOpacity onPress={onClose}>
            <Feather name="x" size={24} color="white" />
          </TouchableOpacity>
        </View>
        
        <View style={styles.sidebarContent}>
          {menuItems.map((item) => (
            <TouchableOpacity 
              key={item.name} 
              style={styles.sidebarItem}
              onPress={() => navigateTo(item.route)}
            >
              <Feather name={item.icon as keyof typeof Feather.glyphMap} size={20} color="white" />
              <Text style={styles.sidebarItemText}>{item.name}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  
    // סגנונות לסרגל צד
    sidebarContainer: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      zIndex: 1000,
    },
    overlay: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.5)',
    },
    sidebar: {
      position: 'absolute',
      top: 0,
      left: 0,
      bottom: 0,
      width: 250,
      backgroundColor: '#0B5D2F',
      paddingTop: 50,
    },
    sidebarHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingHorizontal: 20,
      marginBottom: 20,
    },
    sidebarTitle: {
      color: 'white',
      fontSize: 20,
      fontWeight: 'bold',
    },
    sidebarContent: {
      flex: 1,
    },
    sidebarItem: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: 12,
      paddingHorizontal: 20,
    },
    sidebarItemText: {
      color: 'white',
      fontSize: 16,
      marginLeft: 10,
    },
})

export default Sidebar