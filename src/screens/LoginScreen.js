import React, { useState, useEffect } from 'react';
import { View, Text, Button, TextInput, Image, TouchableOpacity, StyleSheet, SafeAreaView } from 'react-native';
import { useTranslation } from 'react-i18next';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
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
  const [language, setLanguage] = useState('en');

  useEffect(() => {
    const loadLanguage = async () => {
      const storedLanguage = await AsyncStorage.getItem('userLanguage');
      setLanguage(storedLanguage || 'en');
      i18n.changeLanguage(storedLanguage || 'en');
    };
    loadLanguage();
  }, []);

  const handleLogin = async () => {
    if (username && password) {
      await AsyncStorage.setItem('userCredentials', JSON.stringify({ username, password }));
      await AsyncStorage.setItem('userLanguage', language);
      navigation.replace('BLEScreen');
    } else {
      alert(t('error'));
    }
  };

  const handleLanguageChange = async (selectedLanguage) => {
    setLanguage(selectedLanguage);
    i18n.changeLanguage(selectedLanguage);
    await AsyncStorage.setItem('userLanguage', selectedLanguage);
    // Forza un aggiornamento della schermata
    //navigation.navigate('LoginScreen');
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
        <Button title={t('login')} onPress={handleLogin} />
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
    width: '80%',
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 4,
    marginBottom: 12,
    paddingHorizontal: 8,
  },
  flagsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 24,
    marginTop: 12,
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
});

export default LoginScreen;
