import React, { useState, useEffect, useContext } from 'react';
import {
  SafeAreaView,
  FlatList,
  Text,
  View,
  TouchableOpacity,
  Pressable,
  Image
} from 'react-native';
import styles from '../styles/styles.js';
import BLEReader from './BLEReader.js';
import { withTranslation } from 'react-i18next';
import { BluetoothContext } from '../context/BluetoothContext';
import { WifiContext } from '../context/WiFiContext';

const DeviceSelection = (props) => {
  const [devices, setDevices] = useState([]);
  const [scanning, setScanning] = useState(null);
  const [connected, setConnected] = useState(false);

  const { t } = props;
  const { setDevice } = useContext(BluetoothContext);
  const { isWiFi, serialString } = useContext(WifiContext);

  const handleDeviceFound = (devices) => {
    const filteredDevices = devices.filter(device => device.name && device.name.startsWith('AVENSYS'));
    setDevices(filteredDevices);
  };

  const bluetooth = new BLEReader({ onDeviceFound: handleDeviceFound });

  useEffect(() => {
    bluetooth.componentDidMount();
    checkWiFiStatus();
    return () => {
      bluetooth.componentWillUnmount();
    };
  }, []);

  const checkWiFiStatus = () => {
    if (isWiFi) {
      props.navigation.navigate('MainTabs');
    } else {
      console.log('WiFi is not enabled');
    }
    console.log('Serial String:', serialString);
  };

  const handleDeviceSelect = (device) => {
    bluetooth.connectToDevice(device.id).then(() => {
      setConnected(true);
      setDevice(device);
      props.navigation.navigate('MainTabs');
    });
  };

  const handleDisconnect = () => {
    bluetooth.disconnectDevice().then(() => {
      setConnected(false);
      setDevice(null);
    });
  };

  const startScan = () => {
    setDevices([]);
    setScanning(true);
    bluetooth.startScan().then(() => {
      setScanning(false);
    }).catch(() => {
      setScanning(false);
    });
  };

  const calculateDistance = (rssi, A = -67, n = 2) => {
    if (rssi === 0) {
      return -1.0;
    }
    return Math.pow(10, (A - rssi) / (10 * n));
  };

  const calculateAverageRssi = (rssiValues) => {
    if (!rssiValues || rssiValues.length === 0) {
      return null;
    }

    const sortedValues = [...rssiValues].sort((a, b) => a - b);
    if (sortedValues.length > 2) {
      sortedValues.shift();
      sortedValues.pop();
    }

    const sum = sortedValues.reduce((acc, val) => acc + val, 0);
    return sum / sortedValues.length;
  };

  const renderDeviceItem = ({ item }) => {
    const averageRssi = calculateAverageRssi(item.rssiValues);
    const distance = calculateDistance(averageRssi);

    return (
      <TouchableOpacity
        style={styles.deviceItem}
        onPress={() => handleDeviceSelect(item)}
      >
        <View style={styles.deviceItemContent}>
          <View style={styles.deviceTextContainer}>
            <Text style={styles.deviceName}>{item.name}</Text>
            <Text style={styles.deviceId}>MAC : {item.id}</Text>
            <Text style={styles.deviceRssi}>{t('distance')}: {distance.toFixed(2)} {t('meters')}</Text>
          </View>
          <Image source={require('../assets/s52.png')} style={styles.deviceIcon} />
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.body}>
      <View style={styles.sectionTitle}>
        <Text style={styles.TitleText}>{t('choose_unit')}</Text>
      </View>
      <FlatList
        data={devices}
        renderItem={renderDeviceItem}
        keyExtractor={item => item.id}
      />
      <Pressable style={styles.scanButton} onPress={() => scanning ? null : startScan()} disabled={scanning}>
        <Text style={styles.scanButtonText}>{scanning ? t('scanning') : t('start_scan')}</Text>
      </Pressable>
      {connected && (
        <Pressable style={styles.disconnectButton} onPress={handleDisconnect}>
          <Text style={styles.disconnectButtonText}>{t('disconnect')}</Text>
        </Pressable>
      )}
    </SafeAreaView>
  );
};

export default withTranslation()(DeviceSelection);
