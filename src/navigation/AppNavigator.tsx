import React from 'react';

import {
  Text,
  ActivityIndicator,
  View,
} from 'react-native';

import {
  NavigationContainer,
} from '@react-navigation/native';

import {
  createNativeStackNavigator,
} from '@react-navigation/native-stack';

import {
  createBottomTabNavigator,
} from '@react-navigation/bottom-tabs';

// Screens
import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';
import HomeScreen from '../screens/HomeScreen';
import FavoritesScreen from '../screens/FavoritesScreen';
import StationDetailsScreen from '../screens/StationDetailsScreen';
import ProfileScreen from '../screens/ProfileScreen';
import EditProfileScreen from '../screens/EditProfileScreen';
import ChangePasswordScreen from '../screens/ChangePasswordScreen';
import NotificationsScreen from '../screens/NotificationsScreen';
import AllStationsScreen from '../screens/AllStationsScreen';
import PaymentScreen from '../screens/PaymentScreen';

// Context
import {useAuth} from '../context/AuthContext';

// API Type
import {
  ChargingStation,
} from '../api/chargingStationApi';

// =====================================================
// ROOT STACK
// =====================================================

export type RootStackParamList = {
  Login: undefined;
  Register: undefined;
  MainTabs: undefined;
  AllStations: undefined;
  EditProfile: undefined;
  ChangePassword: undefined;
  Notifications: undefined;
  StationDetails: {
    station: ChargingStation;
  };
};

// =====================================================
// BOTTOM TAB
// =====================================================

export type MainTabParamList = {
  Home: undefined;

  Favorites: undefined;

  Profile: undefined;
};

// =====================================================
// STACK
// =====================================================

const Stack =
  createNativeStackNavigator<RootStackParamList>();

// =====================================================
// TAB
// =====================================================

const Tab =
  createBottomTabNavigator<MainTabParamList>();

// =====================================================
// MAIN TABS
// =====================================================

const MainTabs = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
      }}>

      {/* HOME */}

      <Tab.Screen

        name="Home"

        component={HomeScreen}

        options={{

          tabBarIcon:({color}) => (

            <Text

              style={{

                fontSize: 22,

                color,

              }}>

              🏠

            </Text>

          ),

        }}

      />

      {/* FAVORITES */}

      <Tab.Screen
        name="Favorites"
        component={FavoritesScreen}
        options={{

          tabBarIcon:({color}) => (

            <Text

              style={{

                fontSize: 22,

                color,

              }}>

              ❤️

            </Text>

          ),

        }}
      />

      {/* PROFILE */}

      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{

          tabBarIcon:({color}) => (

            <Text

              style={{

                fontSize: 22,

                color,

              }}>

              🙎

            </Text>

          ),

        }}
      />

      <Tab.Screen
  name="Payment"
  component={PaymentScreen}
  options={{
    tabBarLabel: 'Payment',
    tabBarIcon: ({color, size}) => (
      <Text style={{fontSize: size}}>
        💳
      </Text>
    ),
  }}
/>
    </Tab.Navigator>
  );
};

// =====================================================
// APP NAVIGATOR
// =====================================================

const AppNavigator = () => {
  const {
    user,
    loading,
  } = useAuth();

  // ===================================================
  // AUTH LOADING
  // ===================================================

  if (loading) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
        }}>

        <ActivityIndicator
          size="large"
        />

        <Text
          style={{
            marginTop: 10,
          }}>
          Loading...
        </Text>
      </View>
    );
  }

  // ===================================================
  // NAVIGATION
  // ===================================================

  return (
    <NavigationContainer>

      <Stack.Navigator
        screenOptions={{
          headerShown: false,
        }}>

        {!user ? (
          <>
            {/* LOGIN */}

            <Stack.Screen
              name="Login"
              component={LoginScreen}
            />

            {/* REGISTER */}

            <Stack.Screen
              name="Register"
              component={RegisterScreen}
            />
          </>
        ) : (
          <>
            {/* MAIN APPLICATION */}

            <Stack.Screen
              name="MainTabs"
              component={MainTabs}
            />

            {/* STATION DETAILS */}

            <Stack.Screen
              name="StationDetails"
              component={
                StationDetailsScreen
              }
            />

            {/* EDIT PROFILE */}

            <Stack.Screen
              name="EditProfile"
              component={
                EditProfileScreen
              }
            />

            {/* CHANGE PASSWORD */}

            <Stack.Screen
              name="ChangePassword"
              component={
                ChangePasswordScreen
              }
            />

            {/* NOTIFICATIONS */}

            <Stack.Screen
              name="Notifications"
              component={
                NotificationsScreen
              }
            />

            <Stack.Screen
  name="AllStations"
  component={AllStationsScreen}
  options={{headerShown: false}}
/>
          </>
        )}

      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;