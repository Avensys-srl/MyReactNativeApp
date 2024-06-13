import React, { createContext, useState } from 'react';
import BleManager from 'react-native-ble-manager';

export const BluetoothContext = createContext();

export const BluetoothProvider = ({ children }) => {
  const [device, setDevice] = useState(null);

  const disconnect = async () => {
    if (device) {
      try {
        // Logica per disconnettere il dispositivo Bluetooth
        console.log('Disconnecting from Bluetooth device:', device);
        await BleManager.disconnect(device.id);
        setDevice(null);
      } catch (error) {
        console.error('Error disconnecting from Bluetooth device:', error);
      }
    }
  };

  return (
    <BluetoothContext.Provider value={{ device, setDevice, disconnect }}>
      {children}
    </BluetoothContext.Provider>
  );
};
