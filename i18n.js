import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import AsyncStorage from '@react-native-async-storage/async-storage';

import translationEN from './src/translations/en.json';
import translationNL from './src/translations/nl.json';
import translationIT from './src/translations/it.json';
import translationDE from './src/translations/de.json';
import translationFR from './src/translations/fr.json';
import translationLT from './src/translations/lt.json';
import translationPL from './src/translations/pl.json';
import translationDA from './src/translations/da.json';
import translationSV from './src/translations/sv.json';

const resources = {
  en: {
    translation: translationEN,
  },
  nl: {
    translation: translationNL,
  },
  it: {
    translation: translationIT,
  },
  de: {
    translation: translationDE,
  },
  fr: {
    translation: translationFR,
  },
  lt: {
    translation: translationLT,
  },
  pl: {
    translation: translationPL,
  },
  da: {
    translation: translationDA,
  },
  sv: {
    translation: translationSV,
  },
};

const getStoredLanguage = async () => {
  const storedLanguage = await AsyncStorage.getItem('userLanguage');
  return storedLanguage || 'en'; // Default language
};

const setStoredLanguage = async (language) => {
    try {
      await AsyncStorage.setItem('userLanguage', language);
    } catch (error) {
      console.error('Error saving language to AsyncStorage:', error);
    }
  };
  
  getStoredLanguage().then((language) => {
    i18n
      .use(initReactI18next)
      .init({
        resources,
        lng: language,
        fallbackLng: 'en',
        interpolation: {
          escapeValue: false,
        },
      });
  });
  
  // Aggiungi questa funzione per aggiornare la lingua memorizzata
  const changeLanguage = async (language) => {
    await i18n.changeLanguage(language);
    await setStoredLanguage(language); // Aggiorna la lingua memorizzata
  };
  
  export default i18n;