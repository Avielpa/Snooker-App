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
    { name: 'Ranking', icon: 'ranking', route: '/Ranking' },
    { name: 'Calendar', icon: 'calendar', route: '/CalendarScreen' },
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
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
  },
  sidebar: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    width: 270,
    backgroundColor: 'rgba(11, 93, 47, 0.95)',
    paddingTop: 60,
    paddingHorizontal: 16,
    borderTopRightRadius: 16,
    borderBottomRightRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 3, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 8,
  },
  sidebarHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 30,
  },
  sidebarTitle: {
    color: '#FFFFFF',
    fontSize: 22,
    fontWeight: '700',
    fontFamily: 'System',
  },
  sidebarContent: {
    flex: 1,
  },
  sidebarItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  sidebarItemText: {
    color: '#FFFFFF',
    fontSize: 16,
    marginLeft: 12,
    fontWeight: '500',
    fontFamily: 'System',
  },
});

export default Sidebar

