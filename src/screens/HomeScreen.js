import React, {useState} from 'react';
import {
  ScrollView,
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
    <ScrollView style={styles.container}>      
      <CustomNavigation HI={HI} PI={PI} II={II} SI={SI} OC={0} />
    </ScrollView>
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
