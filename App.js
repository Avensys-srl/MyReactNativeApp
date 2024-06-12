import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Image, StyleSheet } from 'react-native';
import InfoScreen from './src/screens/InfoScreen.js';
import BLEScreen from './src/screens/BLEScreen.js';
import AdvEditing from './src/screens/AdvEditing.js';
import SplashScreen from './src/screens/SplashScreen.js';
import LoginScreen from './src/screens/LoginScreen.js';
import Configurator from './src/screens/Configurator.js';
import DeviceSelection from './src/screens/DeviceSelection.js';
import 'intl-pluralrules';
import i18n from './i18n.js';
import { I18nextProvider } from 'react-i18next';
import { BluetoothProvider } from './src/context/BluetoothContext.js';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused }) => {
          let iconSource;

          if (route.name === 'Configurator') {
            iconSource = focused
              ? require('./src/assets/house.png')
              : require('./src/assets/house.png');
          } else if (route.name === 'InfoScreen') {
            iconSource = focused
              ? require('./src/assets/info-icon.png')
              : require('./src/assets/info-icon.png');
          } else if (route.name === 'BLEScreen') {
            iconSource = focused
              ? require('./src/assets/setting.png')
              : require('./src/assets/setting.png');
          } else if (route.name === 'AdvEditing') {
            iconSource = focused
              ? require('./src/assets/sliders-icon-original.png')
              : require('./src/assets/sliders-icon-original.png');
          }

          return <Image source={iconSource} style={styles.icon} />;
        },
        tabBarShowLabel: false,
        tabBarActiveTintColor: 'tomato',
        tabBarInactiveTintColor: 'gray',
        headerShown: false,
      })}
    >
      <Tab.Screen name="Configurator" component={Configurator} />
      <Tab.Screen name="InfoScreen" component={InfoScreen} />
      <Tab.Screen name="BLEScreen" component={BLEScreen} />
      <Tab.Screen name="AdvEditing" component={AdvEditing} />
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
    <BluetoothProvider>
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
    </BluetoothProvider>
  );
}

export default App;
