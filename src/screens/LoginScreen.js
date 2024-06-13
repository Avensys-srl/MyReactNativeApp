// src/screens/LoginScreen.js

import React, { useState, useEffect, useContext } from 'react';
import {
  View, Text, TextInput, Image, TouchableOpacity,
  StyleSheet, SafeAreaView, Pressable, Alert
} from 'react-native';
import { useTranslation } from 'react-i18next';
import AsyncStorage from '@react-native-async-storage/async-storage';
import BouncyCheckbox from 'react-native-bouncy-checkbox';
import { useNavigation } from '@react-navigation/native';
import { ProfileContext } from '../context/ProfileContext';
import colors from '../styles/colors';

const languages = {
  en: require('../assets/flags/en.png'),
  de: require('../assets/flags/de.png'),
  fr: require('../assets/flags/fr.png'),
  it: require('../assets/flags/it.png'),
  nl: require('../assets/flags/nl.png'),
  da: require('../assets/flags/da.png'),
  sv: require('../assets/flags/sv.png'),
  pl: require('../assets/flags/pl.png'),
  lt: require('../assets/flags/lt.png')
};

const LoginScreen = () => {
  const { t, i18n } = useTranslation();
  const navigation = useNavigation();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [language, setLanguage] = useState(i18n.language);
  const [stayLoggedIn, setStayLoggedIn] = useState(false);
  const { setIsService } = useContext(ProfileContext);

  useEffect(() => {
    checkLoginStatus();
  }, []);

  const checkLoginStatus = async () => {
    const userCredentials = await AsyncStorage.getItem('userCredentials');
    const stayLoggedInFlag = await AsyncStorage.getItem('stayLoggedIn');
    if (userCredentials && stayLoggedInFlag === 'true') {
      navigation.replace('DeviceSelection');
    }
  };

  const handleLogin = async () => {
    if (username === 'User' && password === '12345') {
      setIsService(false);
      await AsyncStorage.setItem('userCredentials', JSON.stringify({ username, password }));
      await AsyncStorage.setItem('userLanguage', language);
      await AsyncStorage.setItem('stayLoggedIn', stayLoggedIn.toString());
      navigation.replace('DeviceSelection');
    } else if (username === 'Service' && password === '02015') {
      setIsService(true);
      await AsyncStorage.setItem('userCredentials', JSON.stringify({ username, password }));
      await AsyncStorage.setItem('userLanguage', language);
      await AsyncStorage.setItem('stayLoggedIn', stayLoggedIn.toString());
      navigation.replace('DeviceSelection');
    } else {
      Alert.alert(t('error'), t('Invalid username or password'));
    }
  };

  const handleLanguageChange = async (selectedLanguage) => {
    setLanguage(selectedLanguage);
    i18n.changeLanguage(selectedLanguage);
  };

  return (
    <SafeAreaView style={styles.body}>
      <View style={styles.container}>
        <Image source={require('../assets/SMART_ICON.png')} style={styles.image} />
        <TextInput
          style={styles.input}
          placeholder={t('username')}
          value={username}
          onChangeText={setUsername}
        />
        <TextInput
          style={styles.input}
          placeholder={t('password')}
          value={password}
          secureTextEntry
          onChangeText={setPassword}
        />
        <View style={styles.checkboxContainer}>
          <BouncyCheckbox
            size={25}
            style={styles.checkbox}
            fillColor={colors.lightblue}
            TouchableComponent={Pressable}
            iconStyle={{ borderColor: colors.lightblue }}
            disableText={false}
            unFillColor={colors.white}
            text={t('stay_logged_in')}
            textStyle={{
              textDecorationLine: 'none',
            }}
            onPress={setStayLoggedIn}
            isChecked={stayLoggedIn}
          />
        </View>
        <View style={styles.flagsContainer}>
          {Object.keys(languages).map((lang, index) => (
            <React.Fragment key={lang}>
              <TouchableOpacity onPress={() => handleLanguageChange(lang)}>
                <Image
                  source={languages[lang]}
                  style={[styles.flag, language === lang && styles.selectedFlag]}
                />
              </TouchableOpacity>
              {(index + 1) % 3 === 0 && index !== Object.keys(languages).length - 1 && (
                <View style={styles.lineContainer}>
                  <View style={styles.newline} />
                </View>
              )}
            </React.Fragment>
          ))}
        </View>
        <TouchableOpacity onPress={handleLogin} style={styles.BPButton}>
          <Text style={styles.BPButtonText}>{t('login')}</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  body: {
    flex: 1,
    backgroundColor: '#fff',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  image: {
    width: '60%',
    height: undefined,
    aspectRatio: 1,
    resizeMode: 'contain',
    marginBottom: 24,
  },
  input: {
    width: '90%',
    height: 50,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 4,
    marginBottom: 12,
    fontSize: 18,
    paddingHorizontal: 8,
  },
  label: {
    margin: 8,
  },
  flagsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 24,
    marginTop: 24,
    flexWrap: 'wrap',
  },
  flag: {
    width: 50,
    height: 30,
    marginHorizontal: 10,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: colors.gray,
  },
  selectedFlag: {
    borderWidth: 2.5,
    borderColor: colors.black,
  },
  newline: {
    width: '100%',
    height: 1,
  },
  lineContainer: {
    width: '100%',
    alignItems: 'center',
  },
  BPButton: {
    backgroundColor: colors.lightblue, // Colore di sfondo blu
    borderRadius: 4,
    paddingVertical: 14,
    paddingHorizontal: 20,
    marginTop: 20, // Spazio superiore
    width: '90%',
  },
  BPButtonText: {
    color: colors.white, // Colore del testo bianco
    fontSize: 20,
    textAlign: 'center',
  },
  checkbox: {
    marginTop: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 20,
    alignItems: 'center',
    width: '90%'
  },
});

export default LoginScreen;
