// Importa le librerie necessarie
import React, {Component} from 'react';
import {View, Text, SafeAreaView, ScrollView, Pressable, Linking} from 'react-native';
import styles from '../styles/styles.js';
import QRCodeGeneratorWithSharing from '../icons/QRCodeGeneratorWithSharing.js';
import {eepromData, debugData, pollingData} from '../function/Data.js';
import InfoText from '../icons/Controls.js';
import { TouchableOpacity } from 'react-native-gesture-handler';

class InfoScreen extends Component {
  constructor(props) {
    super(props);

    this.state = {
      eepromlist: [],
      debuglist: [],
      pollinglist: [],
    };
  }

  componentDidMount() {
    this.updateInterval = setInterval(() => {
      const eepromlistcopy = [];
      const debuglistcopy = [];
      const pollinglistcopy = [];

      for (const key in eepromData) {
        if (eepromData.hasOwnProperty(key) && key !== 'previousState') {
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

  navigateToScreen = () => {
    this.props.navigation.navigate('BLEScreen');
  };

  handleOpenLink = () => {
    const url = `https://g5c5rcqqjl.execute-api.eu-central-1.amazonaws.com/api/rispondi?address=${eepromData.SerialString}&topic=polling`; // Adjust URL as needed
    Linking.openURL(url).catch(err => console.error('An error occurred', err));
  }


  render() {
    const QRstring =
      eepromData.SerialString +
      '|' +
      eepromData.AccessoyHW1 +
      '|' +
      eepromData.AccessoyHW2 +
      '|' +
      eepromData.AccessoyHW3 +
      '|' +
      eepromData.AccessoyHW4 +
      '|' +
      eepromData.HW_Vers +
      '|' +
      eepromData.SW_Vers +
      '|' +
      eepromData.hour_runnig;

    const isDataLoaded =
      this.state.pollinglist.length > 0 &&
      this.state.debuglist.length > 0 &&
      this.state.eepromlist.length > 0;

    return (
      <SafeAreaView style={styles.body}>
        <ScrollView>
          <Pressable style={styles.scanButton} onPress={this.navigateToScreen}>
            <Text style={styles.scanButtonText}>{'Back to home'}</Text>
          </Pressable>
          <View>
            <QRCodeGeneratorWithSharing inputString={QRstring} />
          </View>
          {!isDataLoaded && (
            <View>
              <Text style={styles.sectionDescription}>
                {'Data Loading please wait...'}
              </Text>
            </View>
          )}
          {this.state.eepromlist.length > 0 && (
            <View>
            <Text style={styles.sectionDescription}>{'SERIAL NUMBER'}</Text>
            <Pressable onPress={this.handleOpenLink}>
            <Text style={styles.sectionDescription}>{eepromData.SerialString}</Text>
            </Pressable>
              <Text style={styles.sectionDescription}>{'EEPROM DATA'}</Text>
              <View>{this.state.eepromlist}</View>
            </View>
          )}
          {this.state.pollinglist.length > 0 && (
            <View>
              <Text style={styles.sectionDescription}>{'POLLING DATA'}</Text>
              <View>{this.state.pollinglist}</View>
            </View>
          )}
          {this.state.debuglist.length > 0 && (
            <View>
              <Text style={styles.sectionDescription}>{'DEBUG DATA'}</Text>
              <View>{this.state.debuglist}</View>
            </View>
          )}
        </ScrollView>
      </SafeAreaView>
    );
  }
}

export default InfoScreen;
