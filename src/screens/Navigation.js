import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import HomeScreen from './HomeScreen';
import ServiceTwoOne from './ServiceTwoOne';
import Service22 from './Service22';
import CustomHeaderBackButton from '../icons/CustomHeaderBackButton';
import BackButton from '../icons/BackButton';
import BLEScreen from './BLEScreen';

const Stack = createStackNavigator();

function Navigation() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="HomeScreen"
          component={BLEScreen}
          options={{headerShown: false}}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default Navigation;
