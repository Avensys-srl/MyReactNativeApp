// Importa le librerie necessarie
import React from 'react';
import {View, Text, SafeAreaView, ScrollView, Pressable} from 'react-native';
import {useRoute, useNavigation} from '@react-navigation/native';
import styles from '../styles/styles.js';
import QRCodeGeneratorWithSharing from './QRCodeGeneratorWithSharing.js';
import {eepromData, debugData, pollingData} from '../function/Data.js';
import InfoText from '../icons/Controls.js';

// Definisci il componente InfoScreen
function InfoScreen() {
  const route = useRoute();
  const navigation = useNavigation();

  console.debug(`Eeprom value read as:`, eepromData);
  console.debug(`Debug value read as:`, debugData);
  console.debug(`Polling value read as:`, pollingData);

  const goToBLE = () => {
    navigation.navigate('BLEScreen');
  };

  const eepromlist = [];
  const debuglist = [];
  const pollinglist = [];

  for (const key in eepromData) {
    if (eepromData.hasOwnProperty(key)) {
      eepromlist.push(
        <InfoText descr={key} value={eepromData[key]}></InfoText>,
      );
    }
  }

  for (const key in debugData) {
    if (debugData.hasOwnProperty(key)) {
      debuglist.push(<InfoText descr={key} value={debugData[key]}></InfoText>);
    }
  }

  for (const key in pollingData) {
    if (pollingData.hasOwnProperty(key)) {
      pollinglist.push(
        <InfoText descr={key} value={pollingData[key]}></InfoText>,
      );
    }
  }

  return (
    <SafeAreaView style={styles.body}>
      <ScrollView>
        <Text style={styles.sectionDescription}>{'EEPROM DATA'}</Text>
        <View>{eepromlist}</View>
        <Text style={styles.sectionDescription}>{'DEBUG DATA'}</Text>
        <View>{debuglist}</View>
        <Text style={styles.sectionDescription}>{'POLLING DATA'}</Text>
        <View>{pollinglist}</View>
        <View>
          <QRCodeGeneratorWithSharing inputString={eepromData.SerialString} />
        </View>
        <Pressable style={styles.scanButton} onPress={goToBLE}>
          <Text style={styles.scanButtonText}>{'Back'}</Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}

export default InfoScreen;
