import React, { Component } from 'react';
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
import colors from '../styles/colors.js';
import { BluetoothContext } from '../context/BluetoothContext';

class Configurator extends Component {
  constructor(props) {
    super(props);

    this.state = {
      serial: 0,
      isFirstCycle: true,
      isDataAvailable: false,
      alarm: null,
      eepromlist: [],
      wifi: null,
      password: null,
    };
  }

  static contextType = ProfileContext;
  static contextType = BluetoothContext;

  componentDidMount() {
    this.updateInterval = setInterval(() => {
      this.setState(prevState => ({
        serial: prevState.isFirstCycle && eepromData.SerialString > 0 ? eepromData.SerialString : prevState.serial,
        isFirstCycle: false,
        alarm: pollingData.getAlarmString(),
        eepromlist: eepromData,
        isDataAvailable: eepromData.SerialString !== 0,
        wifi: WifiData.WifiSSID,
        password: WifiData.WifiPSWD,
      }));
    }, 1000);
  }

  componentWillUnmount() {
    clearInterval(this.updateInterval);
  }

  handleLogout = async () => {
    const { disconnect } = this.context; // Ottieni la funzione di disconnessione dal contesto Bluetooth
    await AsyncStorage.removeItem('stayLoggedIn');
    if (disconnect) disconnect(); // Disconnetti dal Bluetooth
    this.props.navigation.replace('LoginScreen'); // Reindirizza alla schermata di login
  };

  render() {
    const { t } = this.props;
    const { isDataAvailable, eepromlist, alarm, wifi, password } = this.state;
    const { isService } = this.context;

    const displayAlarm = isService ? alarm : (alarm ? t('generic_alarm') : "");

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
                <InfoText descr={t('alarm_list')} value={displayAlarm} textcolor="red" />
                <InfoText descr={t('wifi_ssid')} value={wifi} />
                <InfoText descr={t('wifi_password')} value={password} />
              </>
            )}
          </View>
        </ScrollView>
        <Pressable style={styles.disconnectButton} onPress={this.handleLogout}>
            <Text style={styles.disconnectButtonText}>{t('logout')}</Text>
          </Pressable>
      </SafeAreaView>
    );
  }
}

const localStyles = StyleSheet.create({
  logoutButtonContainer: {
    margin: 20,
    alignItems: 'center',
  },
});

export default withTranslation()(Configurator);
