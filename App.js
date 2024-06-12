import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
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
            name="BLEScreen"
            component={BLEScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="Configurator"
            component={Configurator}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="InfoScreen"
            component={InfoScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="AdvEditing"
            component={AdvEditing}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="DeviceSelection"
            component={DeviceSelection}
            options={{ headerShown: false }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </I18nextProvider>
    </BluetoothProvider>
  );
}

export default App;
