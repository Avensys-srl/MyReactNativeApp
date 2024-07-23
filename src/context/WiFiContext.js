import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { eepromData, debugData, pollingData } from '../function/Data';

export const WifiContext = createContext();

export const WiFiProvider = ({ children }) => {
  const [isWiFi, setIsWiFi] = useState(false);
  const [serialString, setSerialString] = useState('');

  useEffect(() => {
    const loadSettings = async () => {
      try {
        const savedIsWiFi = await AsyncStorage.getItem('isWiFi');
        const savedSerialString = await AsyncStorage.getItem('serialString');

        if (savedIsWiFi !== null) {
          setIsWiFi(JSON.parse(savedIsWiFi));
        }
        if (savedSerialString !== null) {
          setSerialString(savedSerialString);
        }
      } catch (error) {
        console.error('Failed to load settings.', error);
      }
    };

    loadSettings();
  }, []);

  useEffect(() => {
    const saveSettings = async () => {
      try {
        await AsyncStorage.setItem('isWiFi', JSON.stringify(isWiFi));
        await AsyncStorage.setItem('serialString', serialString);
      } catch (error) {
        console.error('Failed to save settings.', error);
      }
    };

    saveSettings();
  }, [isWiFi, serialString]);

  useEffect(() => {
    let intervalId;

    const fetchData = async () => {
      if (isWiFi && serialString) {
        try {
          const pollingResponse = await axios.get(`https://g5c5rcqqjl.execute-api.eu-central-1.amazonaws.com/api/rispondi?address=${serialString}&topic=polling`);
          const debugResponse = await axios.get(`https://g5c5rcqqjl.execute-api.eu-central-1.amazonaws.com/api/rispondi?address=${serialString}&topic=debug`);
          const eepromResponse = await axios.get(`https://g5c5rcqqjl.execute-api.eu-central-1.amazonaws.com/api/rispondi?address=${serialString}&topic=eeprom`);
          // Aggiorna le strutture con i dati ricevuti
          pollingData.updateFromJSON(pollingResponse.data);
          debugData.updateFromJSON(debugResponse.data);
          if (!eepromData.hasValueChanged || eepromData.hasAllValuesEqualToZero)
          {
             eepromData.updateFromJSON(eepromResponse.data);
          }

          console.log('Polling data:', pollingResponse.data);
          console.log('Debug data:', debugResponse.data);
          console.log('EEPROM data:', eepromResponse.data);
        } catch (error) {
          console.error('Failed to fetch data from API.', error);
        }
      }
    };

    if (isWiFi && serialString) {
      fetchData();
      intervalId = setInterval(fetchData, 4000);
    }

    return () => clearInterval(intervalId);
  }, [isWiFi, serialString]);

  const updateEEPROMData = async (updates) => {

    if (!isWiFi) {
      console.log('WiFi is not connected. No Action on WiFi.');
      return;
    }

    if (!serialString) {
      console.error('Serial string is not set.');
      return;
    }

    const queryParams = new URLSearchParams({ address: serialString, ...updates }).toString();
    const url = `https://g5c5rcqqjl.execute-api.eu-central-1.amazonaws.com/api/eepromchange?${queryParams}`;

    try {
      const response = await axios.get(url);
      if (response.status === 200) {
        // Aggiorna localmente eepromData con i nuovi valori
        eepromData.updateFromJSON(updates);
        console.log('EEPROM data updated successfully:', updates);
        eepromData.ValueChange = 0;
      } else {
        console.error('Failed to update EEPROM data:', response);
      }
    } catch (error) {
      console.error('Failed to update EEPROM data:', error);
    }
  };

  return (
    <WifiContext.Provider value={{ isWiFi, setIsWiFi, serialString, setSerialString, updateEEPROMData }}>
      {children}
    </WifiContext.Provider>
  );
};
