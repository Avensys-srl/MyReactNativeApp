import React from 'react';
import {View, Text, Button} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import InfoScreen from './src/screens/InfoScreen.js';
import BLEScreen from './src/screens/BLEScreen.js';
import Service22 from './src/screens/Service22.js';
import {useNavigation} from '@react-navigation/native';
import Navigation from './src/screens/Navigation.js';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const ProfileScreen = () => {
  const navigation = useNavigation();

  const goToSubMenu = () => {
    navigation.navigate('InfoScreen');
  };

  return (
    <View>
      <Text>Contenuto del servizio</Text>
      <Button title="Vai a info screen" onPress={goToSubMenu} />
    </View>
  );
};

const MainTabs = () => {
  return (
    <Tab.Navigator options={{headerShown: false}}>
      <Tab.Screen
        name="Home"
        component={BLEScreen}
        options={{tabBarLabel: 'Home', headerShown: false}}
      />
      <Tab.Screen
        name="Profile"
        component={Service22}
        options={{tabBarLabel: 'Service22', headerShown: false}}
      />
    </Tab.Navigator>
  );
};

function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="MainTabs"
          component={MainTabs}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="BLEScreen"
          component={BLEScreen}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="InfoScreen"
          component={InfoScreen}
          options={{headerShown: false}}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;

// <Stack.Screen name="BLEScreen" component={BLEScreen} />

/*    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="MainTabs"
          component={MainTabs}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="BLEScreen"
          component={BLEScreen}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="InfoScreen"
          component={InfoScreen}
          options={{headerShown: false}}
        />
      </Stack.Navigator>
    </NavigationContainer>*/
