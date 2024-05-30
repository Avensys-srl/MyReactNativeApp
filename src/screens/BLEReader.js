import React, { Component } from 'react';
import { View, Text, Button } from 'react-native';
import BleManager from 'react-native-ble-manager';
import { NativeEventEmitter, NativeModules } from 'react-native';
import {
  parseUint8ArrayToEEPROM,
  parseUint8ArrayToDebug,
  parseUint8ArrayToPolling,
  convertEEPROMToUint8Array,
  convertUint8ArrayToByteArray,
} from '../function/Parsing.js';
import { eepromData } from '../function/Data.js';

const BleManagerModule = NativeModules.BleManager;
const bleManagerEmitter = new NativeEventEmitter(BleManagerModule);

class BLEReader extends Component {
  constructor(props) {
    super(props);

    this.connectedDevice = null;
    this.characteristicValue = null;
    this.readInterval = null;
    this.readQueue = [];
    this.peripherals = new Map();
  }

  componentDidMount() {
    BleManager.start({ showAlert: false });

    this.handlerDiscover = bleManagerEmitter.addListener('BleManagerDiscoverPeripheral', this.handleDiscoverPeripheral);
    this.handlerStop = bleManagerEmitter.addListener('BleManagerStopScan', this.handleStopScan);
    this.handlerDisconnect = bleManagerEmitter.addListener('BleManagerDisconnectPeripheral', this.handleDisconnectedPeripheral);
    this.handlerUpdate = bleManagerEmitter.addListener('BleManagerDidUpdateValueForCharacteristic', this.handleUpdateValueForCharacteristic);

    this.startScan();
  }

  componentWillUnmount() {
    this.handlerDiscover.remove();
    this.handlerStop.remove();
    this.handlerDisconnect.remove();
    this.handlerUpdate.remove();
  }

  startScan() {
    BleManager.scan([], 5, true).then(() => {
      console.log('Scanning...');
    }).catch(err => {
      console.error('Error starting scan', err);
    });
  }

  handleDiscoverPeripheral = (peripheral) => {
    const { id, name } = peripheral;
    if (!name) return;

    this.peripherals.set(id, peripheral);
    if (name.includes('AVENSYS')) {
      this.connectToDevice(id);
    }
  };

  handleStopScan = () => {
    console.log('Scan is stopped');
    if (this.peripherals.size === 0) {
      console.log('No peripherals found');
    }
  };

  handleDisconnectedPeripheral = (data) => {
    let peripheral = this.peripherals.get(data.peripheral);
    if (peripheral) {
      peripheral.connected = false;
      this.peripherals.set(peripheral.id, peripheral);
    }
    console.log('Disconnected from ' + data.peripheral);
  };

  handleUpdateValueForCharacteristic = (data) => {
    console.log('Received data from ' + data.peripheral + ' characteristic ' + data.characteristic, data.value);
  };

  async connectToDevice(deviceIdentifier) {
    try {
      await BleManager.connect(deviceIdentifier);

      this.connectedDevice = deviceIdentifier;
      console.debug('Dispositivo connesso', deviceIdentifier);

      // Inizia la lettura delle caratteristiche
      this.startReadingCharacteristics();
    } catch (error) {
      console.error('Errore nella connessione al dispositivo:', error);
    }
  }

  async startReadingCharacteristics() {
    try {
      const peripheralData = await BleManager.retrieveServices(this.connectedDevice);

      if (peripheralData.characteristics) {
        // Initial alignment on first connection
        for (let characteristic of peripheralData.characteristics) {
          if (characteristic.characteristic === 'ff01') {
            try {
              let data = await BleManager.read(this.connectedDevice, characteristic.service, characteristic.characteristic);
              parseUint8ArrayToEEPROM(data);
              eepromData.updatePreviousState();
              console.debug('EEPROM read and aligned: ', data);
            } catch (error) {
              console.error('Error in initial read of characteristic:', error);
              return;
            }
            break;
          }
        }

        // Main operation cycle
        while (true) {
          for (let characteristic of peripheralData.characteristics) {
            if (characteristic.characteristic === 'ff01') {
              console.debug('Value changed: ', eepromData.hasValueChanged());
              if (eepromData.hasValueChanged() && eepromData.AddrUnit) {
                try {
                  const data = convertEEPROMToUint8Array(eepromData);
                  const buffer = convertUint8ArrayToByteArray(data);
                  console.debug('Writing to characteristic: ', characteristic.characteristic, 'data: ', buffer);
                  if (data.length === 242) {
                    await BleManager.write(this.connectedDevice, characteristic.service, characteristic.characteristic, buffer, 242);
                  }
                  eepromData.updatePreviousState();
                  eepromData.ValueChange = 0;

                  console.debug('Characteristic written successfully and structure updated');

                  await new Promise(resolve => setTimeout(resolve, 10000));
                } catch (error) {
                  console.error('Error writing characteristic:', error);
                }
              } else {
                try {
                  let data = await BleManager.read(this.connectedDevice, characteristic.service, characteristic.characteristic);
                  parseUint8ArrayToEEPROM(data);
                  this.characteristicValue = data;
                  console.debug('EEPROM read: ', data);
                } catch (error) {
                  console.error('Error reading characteristic:', error);
                }
              }
            } else if (characteristic.characteristic === 'ff02') {
              try {
                let data = await BleManager.read(this.connectedDevice, characteristic.service, characteristic.characteristic);
                parseUint8ArrayToDebug(data);
              } catch (error) {
                console.error('Error reading characteristic:', error);
              }
            } else if (characteristic.characteristic === 'ff03') {
              try {
                let data = await BleManager.read(this.connectedDevice, characteristic.service, characteristic.characteristic);
                parseUint8ArrayToPolling(data);
              } catch (error) {
                console.error('Error reading characteristic:', error);
              }
            }
          }
        }
      }
    } catch (error) {
      console.error('Error connecting to device:', error);
    }
  }

  scheduleNextRead() {
    this.readQueue.push(
      setTimeout(() => this.startReadingCharacteristics(), 1000),
    );
  }

  render() {
    return (
      <View>
        <Text>Valore della caratteristica: {this.characteristicValue}</Text>
        <Button title="Disconnetti" onPress={this.disconnectDevice} />
      </View>
    );
  }

  componentWillUnmount() {
    this.readQueue.forEach(timeoutId => clearTimeout(timeoutId));
  }
}

export default BLEReader;
