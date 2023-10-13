// Importa le librerie necessarie
import React, {Component} from 'react';
import {View, Text, SafeAreaView, ScrollView, Pressable} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import styles from '../styles/styles.js';
import QRCodeGeneratorWithSharing from './QRCodeGeneratorWithSharing.js';
import {eepromData, debugData, pollingData} from '../function/Data.js';
import InfoText from '../icons/Controls.js';

class InfoScreen extends Component {
  constructor(props) {
    super(props);

    this.state = {
      eepromlist: [], // Array iniziale
      debuglist: [],
      pollinglist: [],
    };
  }

  componentDidMount() {
    // Avvia un intervallo per aggiornare il valore ogni 2 secondi
    this.updateInterval = setInterval(() => {
      const eepromlistcopy = [];
      const debuglistcopy = [];
      const pollinglistcopy = [];

      for (const key in eepromData) {
        if (eepromData.hasOwnProperty(key)) {
          eepromlistcopy.push(
            <InfoText descr={key} value={eepromData[key]}></InfoText>,
          );
        }
      }

      for (const key in debugData) {
        if (debugData.hasOwnProperty(key)) {
          debuglistcopy.push(
            <InfoText descr={key} value={debugData[key]}></InfoText>,
          );
        }
      }

      for (const key in pollingData) {
        if (pollingData.hasOwnProperty(key)) {
          pollinglistcopy.push(
            <InfoText descr={key} value={pollingData[key]}></InfoText>,
          );
        }
      }

      this.setState({eepromlist: eepromlistcopy});
      this.setState({debuglist: debuglistcopy});
      this.setState({pollinglist: pollinglistcopy});
    }, 1000);
  }

  componentWillUnmount() {
    clearInterval(this.updateInterval);
  }

  // Definisci il componente InfoScreen
  render() {
    const {navigation} = this.props;

    //   console.debug(`Eeprom value read as:`, eepromData);
    //   console.debug(`Debug value read as:`, debugData);
    //   console.debug(`Polling value read as:`, pollingData);

    return (
      <SafeAreaView style={styles.body}>
        <ScrollView>
          <Text style={styles.sectionDescription}>{'POLLING DATA'}</Text>
          <View>{this.state.pollinglist}</View>
          <Text style={styles.sectionDescription}>{'DEBUG DATA'}</Text>
          <View>{this.state.debuglist}</View>
          <Text style={styles.sectionDescription}>{'EEPROM DATA'}</Text>
          <View>{this.state.eepromlist}</View>
          <View>
            <QRCodeGeneratorWithSharing inputString={eepromData.SerialString} />
          </View>
          <Pressable
            style={styles.scanButton}
            onPressonPress={() => navigation.navigate('BLEScreen')}>
            <Text style={styles.scanButtonText}>{'Back'}</Text>
          </Pressable>
        </ScrollView>
      </SafeAreaView>
    );
  }
}

export default InfoScreen;

/*  
        <Text style={styles.sectionDescription}>{'EEPROM DATA'}</Text>
        <View>{eepromlist}</View>
        <Text style={styles.sectionDescription}>{'DEBUG DATA'}</Text>
      ' <View>{debuglist}</View>

*/
