import React, { Component } from 'react';
import {
  SafeAreaView,
  ScrollView,
  Pressable,
  Text,
  View,
  FlatList,
  TouchableOpacity,
} from 'react-native';

import styles from '../styles/styles.js';
import BLEReader from './BLEReader.js';
import CountdownProgressBar from '../icons/CountdownProgressBar.js';
import { eepromData, pollingData, debugData } from '../function/Data.js';
import InfoText from '../icons/Controls.js';
import { convertEEPROMToUint8Array } from '../function/Parsing.js';

class BLEScreen extends Component {
  constructor(props) {
    super(props);

    this.state = {
      TR: 0,
      TS: 0,
      TF: 0,
      TE: 0,
      speedR: 0,
      speedF: 0,
      isFirstCycle: true,
      airflow: 0,
      serial: 0,
      Bypass: 'Close',
      CO2: 0,
      RH: 0,
      VOC: 0,
      devices: [],
      connected: false,
      scanning: null,
    };

    this.bluetooth = new BLEReader({ onDeviceFound: this.handleDeviceFound });
    this.bluetooth.componentDidMount();
  }

  componentDidMount() {
    this.updateInterval = setInterval(() => {
      this.setState(prevState => ({
        TR: pollingData.MeasTemp2R,
        TS: pollingData.MeasTemp3S,
        TF: pollingData.MeasTemp1F,
        TE: pollingData.MeasTemp4E,
        speedF: debugData.SpeedMotorF1,
        speedR: debugData.SpeedMotorR1,
        Vr: debugData.VoutMotorR,
        Vf: debugData.VoutMotorF,
        airflow: eepromData.Set_StepMotorsFSC_CAF4 / 10,
        index: eepromData.sel_idxStepMotors,
        Bypass: eepromData.Config_Bypass,
        CO2: pollingData.CO2Level,
        RH: pollingData.RHLevel,
        VOC: pollingData.VOCLevel,
        serial: prevState.isFirstCycle && eepromData.SerialString > 0 ? eepromData.SerialString : prevState.serial,
        isFirstCycle: false,
        scanning: this.bluetooth.scanning,
      }));
    }, 1000);
  }

  componentWillUnmount() {
    clearInterval(this.updateInterval);
  }

  navigateToInfo = () => {
    this.props.navigation.navigate('InfoScreen');
  };

  handleDeviceFound = (devices) => {
    const filteredDevices = devices.filter(device => device.name && device.name.startsWith('AVENSYS'));
    this.setState({ devices: filteredDevices });
  };

  handleDeviceSelect = (device) => {
    this.bluetooth.connectToDevice(device.id);
    this.setState({ connected: true });
  };

  handleProgressBarChange = (value) => {
    eepromData.Set_StepMotorsFSC_CAF4 = Number(value) * 100;
    eepromData.sel_idxStepMotors = 3;
    console.debug('SPEED INDEX', eepromData.sel_idxStepMotors);
    this.setState({ airflow: eepromData.Set_StepMotorsFSC_CAF4 / 10 });
    const newEEPROM = convertEEPROMToUint8Array(eepromData);
    eepromData.ValueChange = 1;
    console.debug(newEEPROM);
  };

  updateConfig = (value) => {
    eepromData.Config_Bypass = Number(value);
    const newEEPROM = convertEEPROMToUint8Array(eepromData);
    eepromData.ValueChange = 1;
    console.debug(newEEPROM);
  };

  updateSpeed = (value) => {
    eepromData.sel_idxStepMotors = Number(value);
    console.debug('SPEED INDEX', value);
    const newEEPROM = convertEEPROMToUint8Array(eepromData);
    eepromData.ValueChange = 1;
    console.debug(newEEPROM);
  };

  calculateDistance(rssi, A = -67, n = 2) {
    if (rssi === 0) {
      return -1.0; // se il rssi è 0, non possiamo stimare la distanza
    }
    
    return Math.pow(10, (A - rssi) / (10 * n));
  }

  calculateAverageRssi(rssiValues) {
    if (!rssiValues || rssiValues.length === 0) {
      return null;
    }

    const sortedValues = [...rssiValues].sort((a, b) => a - b);
    if (sortedValues.length > 2) {
      sortedValues.shift(); // Remove the lowest value
      sortedValues.pop(); // Remove the highest value
    }

    const sum = sortedValues.reduce((acc, val) => acc + val, 0);
    return sum / sortedValues.length;
  }


  renderDeviceItem = ({ item }) => {
    
    const averageRssi = this.calculateAverageRssi(item.rssiValues);
    const distance = this.calculateDistance(averageRssi);
    
    return (
    <TouchableOpacity
      style={styles.deviceItem}
      onPress={() => this.handleDeviceSelect(item)}
    >
      <Text style={styles.deviceName}>{item.name}</Text>
      <Text style={styles.deviceId}>{item.id}</Text>
      <Text style={styles.deviceRssi}>Distance: {distance.toFixed(2)} meters</Text> 
    </TouchableOpacity>
  );}

  render() {

    if (this.state.serial <= 0 && this.state.isFirstCycle) {
      if (this.state.devices.length === 0) {
        return (
          <View>
            <Text>Loading data...</Text>
          </View>
        );
      } else {
        return (
          <SafeAreaView style={styles.body}>
            <FlatList
              data={this.state.devices}
              renderItem={this.renderDeviceItem}
              keyExtractor={item => item.id}
            />
            
          </SafeAreaView>
        );
      }
    }

    if (!this.state.connected) {
      return (
        <SafeAreaView style={styles.body}>
          <FlatList
            data={this.state.devices}
            renderItem={this.renderDeviceItem}
            keyExtractor={item => item.id}
          />
        <Pressable style={styles.scanButton}  onPress={() => this.state.scanning ? null : this.bluetooth.startScan()}  disabled={this.state.scanning}>
            <Text style={styles.scanButtonText}>{this.state.scanning ? 'Scanning...' : 'Start Scan'}</Text>
          </Pressable>
        </SafeAreaView>

      );
    }

    return (
      <SafeAreaView style={styles.body}>
        <ScrollView>
          <Pressable style={styles.scanButton} onPress={this.navigateToInfo}>
            <Text style={styles.scanButtonText}>All Data</Text>
          </Pressable>
          <Pressable style={styles.scanButton}>
            <Text style={styles.scanButtonText}>Disconnect</Text>
          </Pressable>
          <CountdownProgressBar
            label="Airflow"
            key={this.state.airflow}
            max_val={100}
            min_val={0}
            init_val={Number(this.state.airflow) / 100}
            onValueChange={this.handleProgressBarChange}
          />
        <View style={styles.buttonContainer}>
          <Text style={styles.TitleText}>3 Step Speed</Text>
        </View>
        <View style={styles.buttonContainer}>
          <Pressable style={styles.BPButton} onPress={() => this.updateSpeed(0)}>
            <Text style={styles.BPButtonText}>1</Text>
          </Pressable>
          <Pressable style={styles.BPButton} onPress={() => this.updateSpeed(1)}>
            <Text style={styles.BPButtonText}>2</Text>
          </Pressable>
          <Pressable style={styles.BPButton} onPress={() => this.updateSpeed(2)}>
            <Text style={styles.BPButtonText}>3</Text>
          </Pressable>
        </View>
        <View style={styles.buttonContainer}>
          <Text style={styles.TitleText}>Bypass Control</Text>
        </View>
        <View style={styles.buttonContainer}>
          <Pressable style={styles.BPButton} onPress={() => this.updateConfig(4)}>
            <Text style={styles.BPButtonText}>Close</Text>
          </Pressable>
          <Pressable style={styles.BPButton} onPress={() => this.updateConfig(3)}>
            <Text style={styles.BPButtonText}>Open</Text>
          </Pressable>
          <Pressable style={styles.BPButton} onPress={() => this.updateConfig(0)}>
            <Text style={styles.BPButtonText}>Automatic</Text>
          </Pressable>
        </View>
        <InfoText descr="Return Temperature" value={this.state.TR / 10 + ' °C'} />
        <InfoText descr="Fresh Temperature" value={this.state.TF / 10 + ' °C'} />
        <InfoText descr="Supply Temperature" value={this.state.TS / 10 + ' °C'} />
        <InfoText descr="Exhaust Temperature" value={this.state.TE / 10 + ' °C'} />
        <InfoText descr="Speed Fan Fresh/Supply" value={[this.state.speedF + ' RPM', this.state.Vf / 100 + ' V']} />
        <InfoText descr="Speed Fan Return/Exhaust" value={[this.state.speedR + ' RPM', this.state.Vr / 100 + ' V']} />
        <InfoText descr="RH Level" value={this.state.RH + ' %'} />
        <InfoText descr="CO2 Level" value={this.state.CO2 + ' PPM'} />
        <InfoText descr="VOC Level" value={this.state.VOC + ' PPM'} />
        <InfoText descr="Bypass" value={this.state.Bypass === 0 ? 'Automatic' : this.state.Bypass === 3 ? 'Open' : this.state.Bypass === 4 ? 'Close' : 'Unknown'} />
        </ScrollView>
      </SafeAreaView>
    );
  }
}

export default BLEScreen;
