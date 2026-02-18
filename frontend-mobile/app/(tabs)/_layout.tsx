import { Tabs, useRouter } from 'expo-router';
import {
  Text,
  Image,
  View,
  TouchableOpacity,
  Pressable
} from 'react-native';

import Ionicons from '@expo/vector-icons/Ionicons';
import { useState } from 'react';

import { useAuth } from '@/context/auth_context';
//ionicons for movie library
//logo-amazon
//disc
//document = hard drive?



export default function TabLayout() {
  const { user, showLoginModal, logout } = useAuth();
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);

  function toggleMenu() {
    if (!user) {
      showLoginModal(); return;
    } setMenuOpen((prev) => !prev);
  }

  function goToProfile() {
    setMenuOpen(false);
    router.push('/profile');
  }

  function handleLogout() {
    setMenuOpen(false);
    logout();
  }

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#ffd33d',
        headerStyle: {
          backgroundColor: '#25292e',
        },
        headerShadowVisible: false,
        //headerShown: false, //hide header
        headerTintColor: '#fff',
        headerRight: () => (
          <View style={{ marginRight: 12 }}>
            <TouchableOpacity onPress={toggleMenu}>
              {user ? (
                user.avatarUrl ? (
                  <Image source={{ uri: user.avatarUrl }} style={{ width: 32, height: 32, borderRadius: 8, }} />
                ) : (
                  <View style={{ width: 32, height: 32, borderRadius: 8, backgroundColor: '#444', justifyContent: 'center', alignItems: 'center', }} >
                    <Ionicons name="person" size={20} color="#fff" />
                  </View>
                )
              ) : (
                <View style={{ width: 32, height: 32, borderRadius: 8, backgroundColor: '#444', justifyContent: 'center', alignItems: 'center', }} >
                  <Ionicons name="log-in" size={20} color="#fff" />
                </View>
              )}
            </TouchableOpacity>

            {/* Dropdown menu */}
            {menuOpen && user && (
              <>
                {/* Background overlay to close menu */}
                <Pressable onPress={() => setMenuOpen(false)}
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: -500,
                    right: 0,
                    bottom: -500,
                  }}
                />

                <View style={{ position: 'absolute', top: 40, right: 0, backgroundColor: '#333', paddingVertical: 8, borderRadius: 8, width: 150, shadowColor: '#000', shadowOpacity: 0.3, shadowRadius: 6, elevation: 5, }} >
                  <Pressable onPress={goToProfile} style={{ padding: 10 }} >
                    <Text style={{ color: '#fff', fontSize: 16 }}>Profile</Text>
                  </Pressable>

                  <Pressable onPress={handleLogout} style={{ padding: 10 }} >
                    <Text style={{ color: '#ff6666', fontSize: 16 }}>Logout</Text>
                  </Pressable>
                </View>
              </>
            )}
          </View>
      ),
        tabBarStyle: {
          backgroundColor: '#25292e',
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? 'home-sharp' : 'home-outline'} color={color} size={24} />
          ),
        }}
      />
      <Tabs.Screen
        name="about"
        options={{
          title: 'About',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? 'information-circle' : 'information-circle-outline'} color={color} size={24}/>
          ),
        }}
      />
      <Tabs.Screen
        name="movies"
        options={{
          title: 'Movies',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? 'film' : 'film-outline'} color={color} size={24}/>
          ),
        }}
      />
      <Tabs.Screen
        name="games"
        options={{
          title: 'Games',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? 'game-controller' : 'game-controller-outline'} color={color} size={24}/>
          ),
        }}
      />
    </Tabs>
  );
}
