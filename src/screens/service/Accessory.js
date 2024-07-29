import React, { useState, useContext } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert, ScrollView } from 'react-native';
import { eepromData } from '../../function/Data';
import { WifiContext } from '../../context/WiFiContext';
import { useTranslation } from 'react-i18next';
import colors from '../../styles/colors';

const HW1 = ['PIR', 'BPD', 'AWP', 'CWD', 'EHD', 'HWD', 'PHWD', 'PEHD'];
const HW2 = ['DPS', 'PCAF', 'PCAP', 'INPUT', 'OUT', 'DDPV2', 'RFM', 'MBUS'];
const HW3 = ['P2CO2', 'P1CO2', 'EBPD', 'P2RH', 'P1RH', 'SSR', 'P1VOC', 'EBP2'];
const HW4 = ['EXT4', 'EXT3', 'EXT2', 'EXT1']; // Removed '---'
const essentialAccessories = ['BPD', 'INPUT', 'OUT', 'DDPV2'];

const AccessoryScreen = () => {
  const { updateEEPROMData } = useContext(WifiContext);
  const { t } = useTranslation();

  const [accessoryHW1, setAccessoryHW1] = useState(eepromData.AccessoyHW1);
  const [accessoryHW2, setAccessoryHW2] = useState(eepromData.AccessoyHW2);
  const [accessoryHW3, setAccessoryHW3] = useState(eepromData.AccessoyHW3);
  const [accessoryHW4, setAccessoryHW4] = useState(eepromData.AccessoyHW4);

  const updateEepromData = (newHW1, newHW2, newHW3, newHW4) => {
    eepromData.AccessoyHW1 = newHW1;
    eepromData.AccessoyHW2 = newHW2;
    eepromData.AccessoyHW3 = newHW3;
    eepromData.AccessoyHW4 = newHW4;
    updateEEPROMData({
      AccessoyHW1: newHW1,
      AccessoyHW2: newHW2,
      AccessoyHW3: newHW3,
      AccessoyHW4: newHW4,
    });
  };

  const handleRemoveAccessory = (hwSet, setHwSet, label) => {
    if (essentialAccessories.includes(label)) {
      Alert.alert('Warning', 'This accessory cannot be removed.');
      return;
    }

    Alert.alert(
      'Warning',
      'Are you sure you want to remove this accessory?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'OK',
          onPress: () => {
            const newHWSet = hwSet.filter(item => item !== label);
            setHwSet(newHWSet);
            updateEepromData(
              hwSet === accessoryHW1 ? newHWSet : accessoryHW1,
              hwSet === accessoryHW2 ? newHWSet : accessoryHW2,
              hwSet === accessoryHW3 ? newHWSet : accessoryHW3,
              hwSet === accessoryHW4 ? newHWSet : accessoryHW4
            );
          },
        },
      ],
      { cancelable: false }
    );
  };

  const handleRemoveAllAccessories = () => {
    const newHW1 = accessoryHW1.filter(label => essentialAccessories.includes(label));
    const newHW2 = accessoryHW2.filter(label => essentialAccessories.includes(label));
    const newHW3 = accessoryHW3.filter(label => essentialAccessories.includes(label));
    const newHW4 = [];

    setAccessoryHW1(newHW1);
    setAccessoryHW2(newHW2);
    setAccessoryHW3(newHW3);
    setAccessoryHW4(newHW4);

    updateEepromData(newHW1, newHW2, newHW3, newHW4);
  };

  const renderButtons = (hwSet, setHwSet, labels) => {
    return labels.map(label => (
      <TouchableOpacity
        key={label}
        style={[styles.button, !hwSet.includes(label) && styles.disabledButton]}
        disabled={!hwSet.includes(label)}
        onPress={() => handleRemoveAccessory(hwSet, setHwSet, label)}
      >
        <Text style={styles.buttonText}>{label}</Text>
      </TouchableOpacity>
    ));
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>{t('Accessory')}</Text>
          <View style={styles.line} />
        </View>
      <View style={styles.table}>
        {renderButtons(accessoryHW1, setAccessoryHW1, HW1)}
        {renderButtons(accessoryHW2, setAccessoryHW2, HW2)}
        {renderButtons(accessoryHW3, setAccessoryHW3, HW3)}
        {renderButtons(accessoryHW4, setAccessoryHW4, HW4)}
      </View>
      <TouchableOpacity style={styles.removeAllButton} onPress={handleRemoveAllAccessories}>
        <Text style={styles.buttonText}>Remove All Accessories</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 16,
    alignItems: 'center',
  },
  header: {
    width: '100%',
    alignItems: 'flex-start',
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    marginLeft: 16,
  },
  line: {
    height: 1,
    width: '100%',
    backgroundColor: colors.gray,
    marginTop: 4,
  },
  table: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  button: {
    width: '40%',
    margin: 8,
    padding: 16,
    backgroundColor: '#007BFF',
    alignItems: 'center',
    borderRadius: 8,
  },
  disabledButton: {
    backgroundColor: '#CCC',
  },
  buttonText: {
    color: '#FFF',
    fontSize: 16,
  },
  removeAllButton: {
    marginTop: 16,
    padding: 16,
    backgroundColor: '#FF0000',
    alignItems: 'center',
    borderRadius: 8,
    width: '80%',
  },
});

export default AccessoryScreen;
