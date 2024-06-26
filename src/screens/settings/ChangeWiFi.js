import React, { useState, useEffect } from 'react';
import { SafeAreaView, View, Text, TextInput, TouchableOpacity, StyleSheet, Dimensions, Image, PermissionsAndroid, Platform, Alert } from 'react-native';
import { useTranslation } from 'react-i18next';
import colors from '../../styles/colors';
import DropDownPicker from 'react-native-dropdown-picker';
import WifiManager from 'react-native-wifi-reborn';
import { WifiData } from '../../function/Data.js';

const ChangeWiFi = () => {
  const { t } = useTranslation();
  const [ssid, setSsid] = useState('');
  const [password, setPassword] = useState('');
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(null);
  const [items, setItems] = useState([]);

  useEffect(() => {
    requestLocationPermission();
  }, []);

  const requestLocationPermission = async () => {
    if (Platform.OS === 'android') {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          {
            title: 'Location Permission',
            message: 'This app needs access to your location to scan for WiFi networks.',
            buttonNeutral: 'Ask Me Later',
            buttonNegative: 'Cancel',
            buttonPositive: 'OK',
          }
        );
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          scanForWiFiNetworks();
        } else {
          console.log('Location permission denied');
        }
      } catch (err) {
        console.warn(err);
      }
    } else {
      scanForWiFiNetworks();
    }
  };

  const scanForWiFiNetworks = () => {
    WifiManager.loadWifiList()
      .then(networks => {
        const formattedNetworks = networks.map(network => ({
          label: network.SSID,
          value: network.SSID,
          icon: () => <Image source={require('../../assets/calibration.png')} style={styles.flag} />,
        }));
        setItems(formattedNetworks);
      })
      .catch(error => {
        console.error('Error scanning for WiFi networks:', error);
      });
  };

  const handleSave = () => {
    if (!ssid || !password) {
      Alert.alert(t('error'), t('Please fill in all fields'));
      return;
    }

    WifiData.WifiSSID = ssid;
    WifiData.WifiPSWD = password;
    WifiData.WifiValueChanged = true;
    console.log('SSID:', ssid);
    console.log('Password:', password);
  };

  const handleSelectNetwork = (selectedValue) => {
    setSsid(selectedValue);
  };

  return (
    <SafeAreaView style={styles.body}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>{t('ChangeWiFi')}</Text>
          <View style={styles.line} />
        </View>
        <View style={styles.content}>
          <DropDownPicker
            open={open}
            value={value}
            items={items}
            setOpen={setOpen}
            setValue={setValue}
            setItems={setItems}
            onChangeValue={handleSelectNetwork}
            placeholder={t('select_wifi')}
            style={styles.dropdown}
            containerStyle={styles.dropdownContainer}
            labelStyle={styles.dropdownLabel}
            dropDownContainerStyle={styles.dropdownList}
            zIndex={5000}
          />
          <Text style={styles.label}>{t('wifi_password')}</Text>
          <TextInput
            style={styles.input}
            value={password}
            onChangeText={setPassword}
            placeholder={t('enter_password')}
            secureTextEntry
          />
          <TouchableOpacity style={styles.searchButton} onPress={scanForWiFiNetworks}>
            <Text style={styles.searchButtonText}>{t('search_wifi_net')}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={handleSave}>
            <Text style={styles.buttonText}>{t('save')}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

const screenWidth = Dimensions.get('window').width;
const maxContentWidth = 1000;
const contentWidth = ((screenWidth - 32) * 1) > maxContentWidth ? maxContentWidth : ((screenWidth - 32) * 1);

const styles = StyleSheet.create({
  body: {
    flex: 1,
    backgroundColor: colors.white,
  },
  container: {
    flexGrow: 1,
    alignItems: 'center',
    padding: 16,
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
  content: {
    width: contentWidth,
    alignItems: 'flex-start',
  },
  label: {
    fontSize: 18,
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: colors.gray,
    borderRadius: 4,
    padding: 8,
    marginBottom: 16,
    fontSize: 16,
    width: '100%',
  },
  button: {
    backgroundColor: colors.lightblue,
    paddingVertical: 12,
    borderRadius: 4,
    alignItems: 'center',
    width: '100%',
  },
  buttonText: {
    color: colors.white,
    fontSize: 18,
  },
  searchButton: {
    backgroundColor: colors.lightblue,
    paddingVertical: 12,
    borderRadius: 4,
    alignItems: 'center',
    width: '100%',
    marginBottom: 16,
  },
  searchButtonText: {
    color: colors.white,
    fontSize: 18,
  },
  dropdown: {
    backgroundColor: colors.white,
  },
  dropdownContainer: {
    width: '100%',
    marginBottom: 20,
  },
  dropdownLabel: {
    fontSize: 16,
    color: colors.black,
  },
  dropdownList: {
    backgroundColor: colors.white,
  },
  flag: {
    width: 30,
    height: 20,
    marginRight: 10,
  },
});

export default ChangeWiFi;
