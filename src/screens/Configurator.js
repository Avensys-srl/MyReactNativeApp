import React, { Component, useContext, useState, useEffect } from 'react';
import {
  SafeAreaView,
  ScrollView,
  Text,
  View,
  Image,
  Pressable,
  StyleSheet,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import styles from '../styles/styles.js';
import { eepromData, pollingData, WifiData } from '../function/Data.js';
import { InfoText } from '../icons/Controls.js';
import { withTranslation } from 'react-i18next';
import { ProfileContext } from '../context/ProfileContext';
import { BluetoothContext } from '../context/BluetoothContext';

const Configurator = ({ navigation, t }) => {
  const [serial, setSerial] = useState(0);
  const [isFirstCycle, setIsFirstCycle] = useState(true);
  const [isDataAvailable, setIsDataAvailable] = useState(false);
  const [alarm, setAlarm] = useState(null);
  const [eepromlist, setEepromList] = useState([]);
  const [wifi, setWifi] = useState(null);
  const [password, setPassword] = useState(null);
  const [username, setUsername] = useState(null);
  const [passwordText, setPasswordText] = useState(null);

  const profileContext = useContext(ProfileContext);
  const bluetoothContext = useContext(BluetoothContext);
  const { isService } = profileContext;
  const { disconnect } = bluetoothContext;

  useEffect(() => {
    const updateInterval = setInterval(() => {
      setSerial(prevSerial => isFirstCycle && eepromData.SerialString > 0 ? eepromData.SerialString : prevSerial);
      setIsFirstCycle(false);
      setAlarm(pollingData.getAlarmString());
      setEepromList(eepromData);
      setIsDataAvailable(eepromData.SerialString !== 0);
      setWifi(WifiData.WifiSSID);
      setPassword(WifiData.WifiPSWD);
    }, 1000);

    readUserCredentials();

    return () => clearInterval(updateInterval);
  }, [isFirstCycle]);

  const readUserCredentials = async () => {
    try {
      const userCredentials = await AsyncStorage.getItem('userCredentials');
      if (userCredentials !== null) {
        const { username, password } = JSON.parse(userCredentials);
        setUsername(username);
        setPasswordText(password);
      }
    } catch (error) {
      console.error('Error reading user credentials:', error);
    }
  };

  const handleLogout = async () => {
    await AsyncStorage.removeItem('stayLoggedIn');
    if (disconnect) disconnect();
    navigation.replace('LoginScreen');
  };

  const displayAlarm = isService ? (alarm ? alarm : t('no_alarm')) : (alarm ? t('generic_alarm') : t('no_alarm'));
  const alarmColor = (alarm ? "red" : "gray");

  if (!isDataAvailable) {
    return (
      <SafeAreaView style={styles.body}>
        <ScrollView>
          <View style={styles.image_container}>
            <Image source={require('../assets/s52.png')} style={styles.image} />
            <View style={styles.buttonContainer}>
              <Text style={styles.TitleText}>{t('loading_data')}</Text>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.body}>
      <ScrollView>
        <View style={styles.image_container}>
          <Image source={require('../assets/s52.png')} style={styles.image} />
          {isDataAvailable && (
            <>
              <View style={styles.buttonContainer}>
                <Text style={styles.TitleText}>{t('info')}</Text>
              </View>
              <InfoText descr={t('serial')} value={eepromlist.SerialString} />
              <InfoText descr={t('HW_vers')} value={eepromlist.HW_Vers} />
              <InfoText descr={t('SW_vers')} value={eepromlist.SW_Vers} />
              <InfoText descr={t('alarm_list')} value={displayAlarm} textcolor={alarmColor} />
              <InfoText descr={t('wifi_ssid')} value={wifi} />
              <InfoText descr={t('wifi_password')} value={password} />
              <InfoText descr={t('profile')} value={username} />
            </>
          )}
        </View>
      </ScrollView>
      <Pressable style={styles.disconnectButton} onPress={handleLogout}>
        <Text style={styles.disconnectButtonText}>{t('logout')}</Text>
      </Pressable>
    </SafeAreaView>
  );
};


export default withTranslation()(Configurator);
