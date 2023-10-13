import React, {Component} from 'react';
import {View, Text, Button} from 'react-native';
import BleManager from 'react-native-ble-manager';
import {
  parseUint8ArrayToEEPROM,
  parseUint8ArrayToDebug,
  parseUint8ArrayToPolling,
} from '../function/Parsing.js';

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
    const deviceIdentifier = 'CC:DB:A7:FD:E4:86'; // Sostituisci con l'ID del tuo dispositivo

    try {
      const device = await BleManager.connect(deviceIdentifier, {
        autoConnect: false,
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
    // Leggi la caratteristica desiderata

    const device = 'CC:DB:A7:FD:E4:86';

    const peripheralData = await BleManager.retrieveServices(device);

    if (peripheralData.characteristics) {
      for (let characteristic of peripheralData.characteristics) {
        if (characteristic.characteristic === 'ff01') {
          try {
            let data = await BleManager.read(
              device,
              characteristic.service,
              characteristic.characteristic,
            );
            parseUint8ArrayToEEPROM(data);
            this.characteristicValue = data;
          } catch (error) {
            console.error('Errore nella lettura della caratteristica:', error);
            this.scheduleNextRead();
          }
        } else if (characteristic.characteristic === 'ff02') {
          try {
            let data = await BleManager.read(
              device,
              characteristic.service,
              characteristic.characteristic,
            );
            parseUint8ArrayToDebug(data);
          } catch (error) {
            console.error('Errore nella lettura della caratteristica:', error);
            this.scheduleNextRead();
          }
        } else if (characteristic.characteristic === 'ff03') {
          try {
            let data = await BleManager.read(
              device,
              characteristic.service,
              characteristic.characteristic,
            );
            parseUint8ArrayToPolling(data);
            this.scheduleNextRead();
          } catch (error) {
            console.error('Errore nella lettura della caratteristica:', error);
            this.scheduleNextRead();
          }
        }
      }
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
