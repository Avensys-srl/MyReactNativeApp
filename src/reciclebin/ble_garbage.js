/**
 * Sample BLE React Native App
 */

import React, {useState, useEffect} from 'react';
import {
  SafeAreaView,
  View,
  Text,
  StatusBar,
  NativeModules,
  NativeEventEmitter,
  Platform,
  PermissionsAndroid,
  FlatList,
  TouchableHighlight,
  Pressable,
  ScrollView,
} from 'react-native';

import {useNavigation} from '@react-navigation/native';

import CountdownProgressBar from '../icons/CountdownProgressBar.js';
import {Colors} from 'react-native/Libraries/NewAppScreen';

import styles from '../styles/styles.js';
import {
  parseUint8ArrayToEEPROM,
  parseUint8ArrayToDebug,
  parseUint8ArrayToPolling,
} from '../function/Parsing.js';

const SECONDS_TO_SCAN_FOR = 7;
const SERVICE_UUIDS = [];
const ALLOW_DUPLICATES = true;

import BleManager, {
  BleScanCallbackType,
  BleScanMatchMode,
  BleScanMode,
} from 'react-native-ble-manager';

const BleManagerModule = NativeModules.BleManager;
const bleManagerEmitter = new NativeEventEmitter(BleManagerModule);
Eeprom_data_BLE = new Uint8Array();
Debug_data_BLE = new Uint8Array();
Polling_data_BLE = new Uint8Array();

const BLESCreen = () => {
  const [isScanning, setIsScanning] = useState(false);
  const [isReading, setIsReading] = useState(false);
  const [peripherals, setPeripherals] = useState(new Map());

  console.debug('peripherals map updated', [...peripherals.entries()]);

  const addOrUpdatePeripheral = (id, updatedPeripheral) => {
    setPeripherals(map => new Map(map.set(id, updatedPeripheral)));
  };

  const startScan = () => {
    if (!isScanning) {
      setPeripherals(new Map());

      try {
        console.debug('[startScan] starting scan...');
        setIsScanning(true);
        BleManager.scan(SERVICE_UUIDS, SECONDS_TO_SCAN_FOR, ALLOW_DUPLICATES, {
          matchMode: BleScanMatchMode.Sticky,
          scanMode: BleScanMode.LowLatency,
          callbackType: BleScanCallbackType.AllMatches,
        })
          .then(() => {
            console.debug('[startScan] scan promise returned successfully.');
          })
          .catch(err => {
            console.error('[startScan] ble scan returned in error', err);
          });
      } catch (error) {
        console.error('[startScan] ble scan error thrown', error);
      }
    }
  };

  const handleStopScan = () => {
    setIsScanning(false);
    console.debug('[handleStopScan] scan is stopped.');
  };

  const handleDisconnectedPeripheral = event => {
    let peripheral = peripherals.get(event.peripheral);
    if (peripheral) {
      console.debug(
        `[handleDisconnectedPeripheral][${peripheral.id}] previously connected peripheral is disconnected.`,
        event.peripheral,
      );
      addOrUpdatePeripheral(peripheral.id, {...peripheral, connected: false});
    }
    console.debug(
      `[handleDisconnectedPeripheral][${event.peripheral}] disconnected.`,
    );
  };

  const handleUpdateValueForCharacteristic = data => {
    console.debug(
      `[handleUpdateValueForCharacteristic] received data from '${data.peripheral}' with characteristic='${data.characteristic}' and value='${data.value}'`,
    );
  };

  const handleDiscoverPeripheral = peripheral => {
    console.debug('[handleDiscoverPeripheral] new BLE peripheral=', peripheral);
    if (!peripheral.name) {
      peripheral.name = 'NO NAME';
    }
    if (peripheral.name.includes('AVENSYS'))
      addOrUpdatePeripheral(peripheral.id, peripheral);
  };

  const togglePeripheralConnection = async peripheral => {
    if (peripheral && peripheral.connected) {
      try {
        await BleManager.disconnect(peripheral.id);
      } catch (error) {
        console.error(
          `[togglePeripheralConnection][${peripheral.id}] error when trying to disconnect device.`,
          error,
        );
      }
    } else {
      await connectPeripheral(peripheral);
    }
  };

  const readCharacteristic = async () => {
    setIsReading(true);
    try {
      devicefound = await BleManager.getConnectedPeripherals();
      if (devicefound.length === 0) {
        console.warn('[readCharacteristic] No connected peripherals found.');
        return;
      }

      console.debug('[readCharacteristic] connectedPeripherals', devicefound);

      for (var i = 0; i < devicefound.length; i++) {
        var peripheral = devicefound[i];
      }
    } catch (error) {
      console.error(
        '[readCharacteristic] unable to retrieve connected peripherals.',
        error,
      );
    }
    setIsReading(false);
  };

  const checkdata = () => {
    if (!isReading || !isScanning) {
      readCharacteristic();
    }
  };

  // setInterval(checkdata, 10000);

  const retrieveConnected = async () => {
    try {
      const connectedPeripherals = await BleManager.getConnectedPeripherals();
      if (connectedPeripherals.length === 0) {
        console.warn('[retrieveConnected] No connected peripherals found.');
        return;
      }

      console.debug(
        '[retrieveConnected] connectedPeripherals',
        connectedPeripherals,
      );

      for (var i = 0; i < connectedPeripherals.length; i++) {
        var peripheral = connectedPeripherals[i];
        addOrUpdatePeripheral(peripheral.id, {...peripheral, connected: true});
      }
    } catch (error) {
      console.error(
        '[retrieveConnected] unable to retrieve connected peripherals.',
        error,
      );
    }
  };

  const connectPeripheral = async peripheral => {
    try {
      if (peripheral) {
        addOrUpdatePeripheral(peripheral.id, {...peripheral, connecting: true});

        const options = {
          autoConnect: true,
        };

        await BleManager.connect(peripheral.id, options);
        console.debug(`[connectPeripheral][${peripheral.id}] connected.`);

        addOrUpdatePeripheral(peripheral.id, {
          ...peripheral,
          connecting: false,
          connected: true,
        });

        await sleep(2000);

        const peripheralData = await BleManager.retrieveServices(peripheral.id);
        console.debug(
          `[connectPeripheral][${peripheral.id}] retrieved peripheral services`,
          peripheralData,
        );

        const rssi = await BleManager.readRSSI(peripheral.id);
        console.debug(
          `[connectPeripheral][${peripheral.id}] retrieved current RSSI value: ${rssi}.`,
        );

        if (peripheralData.characteristics) {
          for (let characteristic of peripheralData.characteristics) {
            if (characteristic.characteristic === 'ff01') {
              try {
                let data = await BleManager.read(
                  peripheral.id,
                  characteristic.service,
                  characteristic.characteristic,
                );
                Eeprom_data_BLE = data;
                console.debug(
                  `[connectPeripheral][${peripheral.id}] characteristic ${characteristic.characteristic} value read as:`,
                  Eeprom_data_BLE,
                );
              } catch (error) {
                console.error(
                  `[connectPeripheral][${peripheral.id}] failed to retrieve data for service ${characteristic.service} and characteristic ${characteristic.characteristic}:`,
                  error,
                );
              }
            } else if (characteristic.characteristic === 'ff02') {
              try {
                let data = await BleManager.read(
                  peripheral.id,
                  characteristic.service,
                  characteristic.characteristic,
                );
                Debug_data_BLE = data;
                console.debug(
                  `[connectPeripheral][${peripheral.id}] characteristic ${characteristic.characteristic} value read as:`,
                  Debug_data_BLE,
                );
              } catch (error) {
                console.error(
                  `[connectPeripheral][${peripheral.id}] failed to retrieve data for service ${characteristic.service} and characteristic ${characteristic.characteristic}:`,
                  error,
                );
              }
            } else if (characteristic.characteristic === 'ff03') {
              try {
                let data = await BleManager.read(
                  peripheral.id,
                  characteristic.service,
                  characteristic.characteristic,
                );
                Polling_data_BLE = data;
                console.debug(
                  `[connectPeripheral][${peripheral.id}] characteristic ${characteristic.characteristic} value read as:`,
                  Polling_data_BLE,
                );
              } catch (error) {
                console.error(
                  `[connectPeripheral][${peripheral.id}] failed to retrieve data for service ${characteristic.service} and characteristic ${characteristic.characteristic}:`,
                  error,
                );
              }
            }
          }
        }

        let p = peripherals.get(peripheral.id);
        if (p) {
          addOrUpdatePeripheral(peripheral.id, {...peripheral, rssi});
        }
      }
    } catch (error) {
      console.error(
        `[connectPeripheral][${peripheral.id}] connectPeripheral error`,
        error,
      );
    }
  };

  function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  useEffect(() => {
    try {
      BleManager.start({showAlert: false})
        .then(() => console.debug('BleManager started.'))
        .catch(error =>
          console.error('BeManager could not be started.', error),
        );
    } catch (error) {
      console.error('unexpected error starting BleManager.', error);
      return;
    }

    const listeners = [
      bleManagerEmitter.addListener(
        'BleManagerDiscoverPeripheral',
        handleDiscoverPeripheral,
      ),
      bleManagerEmitter.addListener('BleManagerStopScan', handleStopScan),
      bleManagerEmitter.addListener(
        'BleManagerDisconnectPeripheral',
        handleDisconnectedPeripheral,
      ),
      bleManagerEmitter.addListener(
        'BleManagerDidUpdateValueForCharacteristic',
        handleUpdateValueForCharacteristic,
      ),
    ];

    handleAndroidPermissions();

    return () => {
      console.debug('[app] main component unmounting. Removing listeners...');
      for (const listener of listeners) {
        listener.remove();
      }
    };
  }, []);

  const handleAndroidPermissions = () => {
    if (Platform.OS === 'android' && Platform.Version >= 31) {
      PermissionsAndroid.requestMultiple([
        PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
        PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
      ]).then(result => {
        if (result) {
          console.debug(
            '[handleAndroidPermissions] User accepts runtime permissions android 12+',
          );
        } else {
          console.error(
            '[handleAndroidPermissions] User refuses runtime permissions android 12+',
          );
        }
      });
    } else if (Platform.OS === 'android' && Platform.Version >= 23) {
      PermissionsAndroid.check(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      ).then(checkResult => {
        if (checkResult) {
          console.debug(
            '[handleAndroidPermissions] runtime permission Android <12 already OK',
          );
        } else {
          PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          ).then(requestResult => {
            if (requestResult) {
              console.debug(
                '[handleAndroidPermissions] User accepts runtime permission android <12',
              );
            } else {
              console.error(
                '[handleAndroidPermissions] User refuses runtime permission android <12',
              );
            }
          });
        }
      });
    }
  };

  const renderItem = ({item}) => {
    const backgroundColor = item.connected ? '#069400' : Colors.white;
    return (
      <TouchableHighlight
        underlayColor="#0082FC"
        onPress={() => togglePeripheralConnection(item)}>
        <View style={[styles.row, {backgroundColor}]}>
          <Text style={styles.peripheralName}>
            {item.name} - {item?.advertising?.localName}
            {item.connecting && ' - Connecting...'}
          </Text>
          <Text style={styles.rssi}>RSSI: {item.rssi}</Text>
          <Text style={styles.peripheralId}>{item.id}</Text>
        </View>
      </TouchableHighlight>
    );
  };

  const navigation = useNavigation();
  const handlePress = () => {
    if (Eeprom_data_BLE === null || Eeprom_data_BLE === undefined)
      Eeprom_data_BLE == ['Eeprom data not available'];
    else parseUint8ArrayToEEPROM(Eeprom_data_BLE);

    if (Debug_data_BLE === null || Debug_data_BLE === undefined)
      Debug_data_BLE == ['Debug data not available'];
    else parseUint8ArrayToDebug(Debug_data_BLE);

    if (Polling_data_BLE === null || Polling_data_BLE === undefined)
      Polling_data_BLE == ['Debug data not available'];
    else parseUint8ArrayToPolling(Polling_data_BLE);

    navigation.navigate('InfoScreen'); // Assicurati che 'InfoScreen' sia il nome dello screen che desideri raggiungere
  };

  return (
    <>
      <StatusBar />

      <SafeAreaView style={styles.body}>
        <ScrollView>
          <Pressable style={styles.scanButton} onPress={handlePress}>
            <Text style={styles.scanButtonText}>{'Check info data'}</Text>
          </Pressable>

          <CountdownProgressBar
            label="Ventilation Speed [%]"
            min_val={0}
            max_val={100}
            init_val={0.37}></CountdownProgressBar>

          <Pressable style={styles.scanButton} onPress={startScan}>
            <Text style={styles.scanButtonText}>
              {isScanning ? 'Scanning...' : 'Scan Bluetooth'}
            </Text>
          </Pressable>

          <Pressable style={styles.scanButton} onPress={retrieveConnected}>
            <Text style={styles.scanButtonText}>
              {'Retrieve connected peripherals'}
            </Text>
          </Pressable>

          {Array.from(peripherals.values()).length === 0 && (
            <View style={styles.row}>
              <Text style={styles.noPeripherals}>
                No Peripherals, press "Scan Bluetooth" above.
              </Text>
            </View>
          )}

          <FlatList
            data={Array.from(peripherals.values())}
            contentContainerStyle={{rowGap: 12}}
            renderItem={renderItem}
            keyExtractor={item => item.id}
          />
        </ScrollView>
      </SafeAreaView>
    </>
  );
};

export default BLESCreen;
