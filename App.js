import React from 'react';
import { NavigationContainer, CommonActions } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Image, StyleSheet } from 'react-native';
import Home from './src/screens/Home.js'; 
import AdvEditing from './src/screens/AdvEditing.js';
import SplashScreen from './src/screens/SplashScreen.js';
import LoginScreen from './src/screens/LoginScreen.js';
import Configurator from './src/screens/Configurator.js';
import DeviceSelection from './src/screens/DeviceSelection.js';
import InfoScreen from './src/screens/InfoScreen.js';
import 'react-native-gesture-handler';
import 'intl-pluralrules';
import i18n from './i18n.js';
import { I18nextProvider } from 'react-i18next';
import { BluetoothProvider } from './src/context/BluetoothContext.js';
import { ProfileProvider } from './src/context/ProfileContext.js';
import { WiFiProvider } from './src/context/WiFiContext.js';
import SettingsMenu from './src/screens/SettingsMenu';
import settingsRoutes from './src/screens/settings';
import ServiceRoutes from './src/screens/service';
import ServiceMenu from './src/screens/ServiceMenu.js';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function createResetStackNavigator(StackComponent, initialRouteName) {
  return function ResetStackNavigator({ navigation }) {
    React.useEffect(() => {
      const unsubscribe = navigation.addListener('tabPress', e => {
        e.preventDefault(); // Prevent default behavior
        navigation.navigate(initialRouteName);
      });

      return unsubscribe;
    }, [navigation]);

    return <StackComponent />;
  };
}

function SettingsStack() {
  return (
    <Stack.Navigator initialRouteName="SettingsMenu">
      <Stack.Screen
        name="SettingsMenu"
        component={SettingsMenu}
        options={{ headerShown: false }}
      />
      {settingsRoutes.map((route) => (
        <Stack.Screen
          key={route.name}
          name={route.name}
          component={route.component}
          options={{ headerShown: false }}
        />
      ))}
    </Stack.Navigator>
  );
}

function ServiceStack() {
  const routes = ServiceRoutes(); // Call the function to get routes
  return (
    <Stack.Navigator initialRouteName="ServiceMenu">
      <Stack.Screen
        name="ServiceMenu"
        component={ServiceMenu}
        options={{ headerShown: false }}
      />
      {routes.map((route) => (
        <Stack.Screen
          key={route.name}
          name={route.name}
          component={route.component}
          options={{ headerShown: false }}
        />
      ))}
    </Stack.Navigator>
  );
}

const ResetSettingsStack = createResetStackNavigator(SettingsStack, 'SettingsMenu');
const ResetServiceStack = createResetStackNavigator(ServiceStack, 'ServiceMenu');

function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused }) => {
          let iconSource;

          if (route.name === 'Home') {
            iconSource = require('./src/assets/house.png');
          } else if (route.name === 'Configurator') {
            iconSource = require('./src/assets/info-icon.png');
          } else if (route.name === 'ServiceList') {
            iconSource = require('./src/assets/setting.png');
          } else if (route.name === 'SettingList') {
            iconSource = require('./src/assets/sliders-icon-original.png');
          }

          return <Image source={iconSource} style={styles.icon} />;
        },
        tabBarShowLabel: false,
        tabBarActiveTintColor: 'tomato',
        tabBarInactiveTintColor: 'gray',
        headerShown: false,
      })}
    >
      <Tab.Screen name="Home" component={Home} />
      <Tab.Screen name="SettingList" component={ResetSettingsStack} />
      <Tab.Screen name="ServiceList" component={ResetServiceStack} />
      <Tab.Screen name="Configurator" component={Configurator} />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  icon: {
    width: 50,
    height: 50,
  },
});

function App() {
  return (
    <ProfileProvider>
      <BluetoothProvider>
        <WiFiProvider>
          <I18nextProvider i18n={i18n}>
            <NavigationContainer>
              <Stack.Navigator initialRouteName="SplashScreen">
                <Stack.Screen
                  name="SplashScreen"
                  component={SplashScreen}
                  options={{ headerShown: false }}
                />
                <Stack.Screen
                  name="LoginScreen"
                  component={LoginScreen}
                  options={{ headerShown: false }}
                />
                <Stack.Screen
                  name="DeviceSelection"
                  component={DeviceSelection}
                  options={{ headerShown: false }}
                />
                <Stack.Screen
                  name="MainTabs"
                  component={MainTabs}
                  options={{ headerShown: false }}
                />
              </Stack.Navigator>
            </NavigationContainer>
          </I18nextProvider>
        </WiFiProvider>
      </BluetoothProvider>
    </ProfileProvider>
  );
}

export default App;
