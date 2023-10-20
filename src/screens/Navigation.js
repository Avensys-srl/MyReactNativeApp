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
        <Stack.Screen
          name="ServiceTwoOne"
          component={ServiceTwoOne}
          options={{
            headerTitle: 'Preheat Settings',
            headerStyle: {
              backgroundColor: '#92d050',
            },
            headerTitleStyle: {
              color: 'white',
              fontSize: 20,
            },
            headerTintColor: 'white',
            headerRight: () => <CustomHeaderBackButton />,
            headerLeft: () => <BackButton />,
          }}
        />
        <Stack.Screen
          name="Service22"
          component={Service22}
          options={{
            headerTitle: 'Preheat Settings',
            headerStyle: {
              backgroundColor: '#92d050',
            },
            headerTitleStyle: {
              color: 'white',
              fontSize: 20,
            },
            headerTintColor: 'white',
            headerRight: () => <CustomHeaderBackButton />,
            headerLeft: () => <BackButton />,
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default Navigation;
