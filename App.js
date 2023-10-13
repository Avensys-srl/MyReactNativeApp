import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import BLEScreen from './src/screens/BLEScreen.js';
import InfoScreen from './src/screens/InfoScreen.js';

const Stack = createNativeStackNavigator();

function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="BLEScreen">
        <Stack.Screen name="BLEScreen" component={BLEScreen} />
        <Stack.Screen name="InfoScreen" component={InfoScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;
