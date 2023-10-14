import React from 'react';
import {SafeAreaView, ScrollView, Pressable, Text} from 'react-native';
import {useNavigation} from '@react-navigation/native';

import styles from '../styles/styles.js';

import BLEReader from './BLEReader.js';
import SingleButton from '../icons/SingleButton.js';
import CustomBottomNavigation from '../icons/CustomBottomNavigation.js';
import TrippleBtn from '../icons/TrippleBtn.js';
import ToggleSwitch from '../icons/ToggleSwitch.js';

const bluetooth = new BLEReader();

function BLEScreen() {
  bluetooth.componentDidMount();

  const navigation = useNavigation();

  const goToInfo = () => {
    navigation.navigate('InfoScreen');
  };

  return (
    <SafeAreaView style={styles.body}>
      <ScrollView>
        <Pressable style={styles.scanButton} onPress={goToInfo}>
          <Text style={styles.scanButtonText}>{'Check Data'}</Text>
        </Pressable>

        <ToggleSwitch
          TOO={'Communication'}
          CL={'wifi'}
          CR={'bt'}
          BG={0}></ToggleSwitch>
      </ScrollView>
    </SafeAreaView>
  );
}

export default BLEScreen;
