import React, {Component} from 'react';
import {View, Text, Button} from 'react-native';
import BleManager from 'react-native-ble-manager';
import {
  parseUint8ArrayToEEPROM,
  parseUint8ArrayToDebug,
  parseUint8ArrayToPolling,
  convertEEPROMToUint8Array,
  convertUint8ArrayToByteArray,
} from '../function/Parsing.js';
import {eepromData} from '../function/Data.js';

class BLEReader extends Component {
  constructor(props) {
    super(props);

    this.connectedDevice = null;
    this.characteristicValue = null;
    this.readInterval = null;
    this.readQueue = [];
  }

  componentDidMount() {
    this.connectToDevice();
  }

  async connectToDevice() {
    BleManager.start();
    const deviceIdentifier = 'FC:B4:67:68:54:7E'; // Sostituisci con l'ID del tuo dispositivo
    //const deviceIdentifier = 'CC:DB:A7:FD:E4:86'; // Sostituisci con l'ID del tuo dispositivo

    try {
      const device = await BleManager.connect(deviceIdentifier, {
        autoConnect: true,
      });

      this.connectedDevice = device;
      console.debug('Dispositivo connesso', deviceIdentifier);

      // Inizia la lettura delle caratteristiche
      this.startReadingCharacteristics();
    } catch (error) {
      console.error('Errore nella connessione al dispositivo:', error);
    }
  }

  async startReadingCharacteristics() {
    const device = 'FC:B4:67:68:54:7E';
  
    try {
      const peripheralData = await BleManager.retrieveServices(device);
  
      if (peripheralData.characteristics) {
        // Initial alignment on first connection
        for (let characteristic of peripheralData.characteristics) {
          if (characteristic.characteristic === 'ff01') {
            try {
              let data = await BleManager.read(device, characteristic.service, characteristic.characteristic);
              parseUint8ArrayToEEPROM(data);
              eepromData.updatePreviousState(); // Assuming this updates the EEPROM data structure
              console.debug('EEPROM read and aligned: ', data);
            } catch (error) {
              console.error('Error in initial read of characteristic:', error);
              return; // Exit if initial read fails
            }
            break; // Exit loop after aligning the ff01 characteristic
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
                    await BleManager.write(device, characteristic.service, characteristic.characteristic, buffer, 242);
                  }
                  eepromData.updatePreviousState();
                  eepromData.ValueChange = 0; // Set ValueChange to 0 after writing
                  console.debug('Characteristic written successfully and structure updated');
  
                  // Wait for 20 seconds before the next read
                  await new Promise(resolve => setTimeout(resolve, 20000));
                } catch (error) {
                  console.error('Error writing characteristic:', error);
                }
              } else {
                try {
                  let data = await BleManager.read(device, characteristic.service, characteristic.characteristic);
                  parseUint8ArrayToEEPROM(data);
                  this.characteristicValue = data;
                  console.debug('EEPROM read: ', data);
                } catch (error) {
                  console.error('Error reading characteristic:', error);
                }
              }
            } else if (characteristic.characteristic === 'ff02') {
              try {
                let data = await BleManager.read(device, characteristic.service, characteristic.characteristic);
                parseUint8ArrayToDebug(data);
              } catch (error) {
                console.error('Error reading characteristic:', error);
              }
            } else if (characteristic.characteristic === 'ff03') {
              try {
                let data = await BleManager.read(device, characteristic.service, characteristic.characteristic);
                parseUint8ArrayToPolling(data);
              } catch (error) {
                console.error('Error reading characteristic:', error);
              }
            }
          }
          // Wait for 10 seconds before starting the next cycle
          //await new Promise(resolve => setTimeout(resolve, 10000));
        }
      }
    } catch (error) {
      console.error('Error connecting to device:', error);
    }
  }
  
  
  scheduleNextRead() {
    // Aggiungi la prossima lettura alla coda dopo 3 secondi
    this.readQueue.push(
      setTimeout(() => this.startReadingCharacteristics(), 1000),
    );
  }

  render() {
    return (
      <View>
        <Text>Valore della caratteristica: {this.connectedDevice}</Text>
        <Button title="Disconnetti" onPress={this.disconnectDevice} />
      </View>
    );
  }

  componentWillUnmount() {
    // Pulisci la coda di lettura quando il componente viene smontato
    this.readQueue.forEach(timeoutId => clearTimeout(timeoutId));
  }
}

export default BLEReader;
