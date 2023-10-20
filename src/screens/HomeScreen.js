import React, {useState} from 'react';
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  Dimensions,
  Image,
} from 'react-native';
import CustomNavigation from './CustomNavigation';
import HI from '../assets/house-icon-original.png';
import PI from '../assets/sliders-icon-original.png';
import II from '../assets/info-icon-original.png';
import SI from '../assets/wrench-icon-original.png';

const HomeScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={{textAlign: 'center', fontSize: 25}}>Home Screen</Text>
      <View style={{flex: 1, alignItems: 'center', justifyContent: 'flex-end'}}>
        <CustomNavigation HI={HI} PI={PI} II={II} SI={SI} OC={0} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    height: '100%',
    borderWidth: 1,
    borderColor: 'red',
    justifyContent: 'flex-end',
  },
});

export default HomeScreen;
