import React, { Component, useContext } from 'react';
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

class DeviceSelection extends Component {
  constructor(props) {
    super(props);
    this.state = {
      devices: [],
      scanning: null,
      connected: false,
    };

    this.bluetooth = new BLEReader({ onDeviceFound: this.handleDeviceFound });
  }

  componentDidMount() {
    this.bluetooth.componentDidMount();
  }

  componentWillUnmount() {
    this.bluetooth.componentWillUnmount();
  }

  handleDeviceFound = (devices) => {
    const filteredDevices = devices.filter(device => device.name && device.name.startsWith('AVENSYS'));
    this.setState({ devices: filteredDevices });
  };

  handleDeviceSelect = (device) => {
    this.bluetooth.connectToDevice(device.id).then(() => {
      this.setState({ connected: true });
      const { setDevice } = this.context;
      setDevice(device);
      this.props.navigation.navigate('MainTabs');
    });
  };

  handleDisconnect = () => {
    this.bluetooth.disconnectDevice().then(() => {
      this.setState({ connected: false });
      const { setDevice } = this.context;
      setDevice(null);
    });
  };

  startScan = () => {
    this.setState({ devices: [], scanning: true });
    this.bluetooth.startScan().then(() => {
      this.setState({ scanning: false });
    }).catch(() => {
      this.setState({ scanning: false });
    });
  };

  calculateDistance(rssi, A = -67, n = 2) {
    if (rssi === 0) {
      return -1.0;
    }
    return Math.pow(10, (A - rssi) / (10 * n));
  }

  calculateAverageRssi(rssiValues) {
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
  }

  renderDeviceItem = ({ item }) => {
    const { t } = this.props;
    const averageRssi = this.calculateAverageRssi(item.rssiValues);
    const distance = this.calculateDistance(averageRssi);

    return (
      <TouchableOpacity
        style={styles.deviceItem}
        onPress={() => this.handleDeviceSelect(item)}
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

  render() {
    const { t } = this.props;
    const { devices, scanning, connected } = this.state;

    return (
      <SafeAreaView style={styles.body}>
        <View style={styles.sectionTitle}>
          <Text style={styles.TitleText}>{t('choose_unit')}</Text>
        </View>
        <FlatList
          data={devices}
          renderItem={this.renderDeviceItem}
          keyExtractor={item => item.id}
        />
        <Pressable style={styles.scanButton} onPress={() => scanning ? null : this.startScan()} disabled={scanning}>
          <Text style={styles.scanButtonText}>{scanning ? t('scanning') : t('start_scan')}</Text>
        </Pressable>
        {connected && (
          <Pressable style={styles.disconnectButton} onPress={this.handleDisconnect}>
            <Text style={styles.disconnectButtonText}>{t('disconnect')}</Text>
          </Pressable>
        )}
      </SafeAreaView>
    );
  }
}

DeviceSelection.contextType = BluetoothContext;

export default withTranslation()(DeviceSelection);
