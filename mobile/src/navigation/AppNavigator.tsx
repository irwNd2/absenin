import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigatorScreenParams } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../contexts/AuthContext';
import type { Attendance } from '../types/attendance';

// Import screens
import LoginScreen from '../screens/LoginScreen';
import HomeScreen from '../screens/HomeScreen';
import AttendanceScreen from '../screens/AttendanceScreen';
import ProfileScreen from '../screens/ProfileScreen';
import NewAttendanceScreen from '../screens/NewAttendanceScreen';
import AttendanceDetailScreen from '../screens/AttendanceDetailScreen';
import EditAttendanceScreen from '../screens/EditAttendanceScreen';
import WelcomeScreen from '../screens/WelcomeScreen';
import AsyncStorage from '@react-native-async-storage/async-storage';

export type RootStackParamList = {
  Auth: undefined;
  MainTabs: NavigatorScreenParams<TabParamList>;
  NewAttendance: undefined;
  Welcome: undefined;
  AttendanceDetail: { id: string };
  EditAttendance: { id: string };
};

export type TabParamList = {
  Home: undefined;
  Attendance: undefined;
  Profile: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<TabParamList>();

const TabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'Home') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'Attendance') {
            iconName = focused ? 'calendar' : 'calendar-outline';
          } else if (route.name === 'Profile') {
            iconName = focused ? 'person' : 'person-outline';
          }

          return <Ionicons name={iconName as any} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#007AFF',
        tabBarInactiveTintColor: 'gray',
        headerShown: false,
      })}
      
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Attendance" component={AttendanceScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
};

const AppNavigator = () => {
  const { isAuthenticated } = useAuth();
  const [isFirstLaunch, setIsFirstLaunch] = useState<boolean | null>(null);

  useEffect(() => {
    const checkFirstLaunch = async () => {
      try {
        const hasLaunched = await AsyncStorage.getItem('hasLaunched');
        if (hasLaunched === null) {
          await AsyncStorage.setItem('hasLaunched', 'true');
          setIsFirstLaunch(true);
        } else {
          setIsFirstLaunch(false);
        }
      } catch (error) {
        console.error('Error checking first launch:', error);
        setIsFirstLaunch(false);
      }
    };

    checkFirstLaunch();
  }, []);

  if (isFirstLaunch === null) {
    return null; // or a loading screen
  }

  return (
    <NavigationContainer>
      <Stack.Navigator 
        screenOptions={{ 
          headerShown: false,
          headerTitle: () => null,
        }}
      >
        {isFirstLaunch ? (
          <Stack.Screen name="Welcome" component={WelcomeScreen} />
        ) : !isAuthenticated ? (
          <Stack.Screen name="Auth" component={LoginScreen} />
        ) : (
          <>
            <Stack.Screen name="MainTabs" component={TabNavigator} />
            <Stack.Screen name="NewAttendance" component={NewAttendanceScreen} />
            <Stack.Screen name="AttendanceDetail" component={AttendanceDetailScreen} />
            <Stack.Screen name="EditAttendance" component={EditAttendanceScreen} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator; 