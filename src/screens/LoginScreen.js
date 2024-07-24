import React, { useState, useEffect, useContext } from 'react';
import {
  View, Text, TextInput, Image, TouchableOpacity,
  StyleSheet, SafeAreaView, Pressable, Alert, Dimensions, Modal, FlatList
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

  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    checkLoginStatus();
  }, []);

  const checkLoginStatus = async () => {
    try {
      const userCredentialsString = await AsyncStorage.getItem('userCredentials');
      const stayLoggedInFlag = await AsyncStorage.getItem('stayLoggedIn');
      if (userCredentialsString && stayLoggedInFlag === 'true') {
        const userCredentials = JSON.parse(userCredentialsString);
        if (userCredentials.username === 'Service' && userCredentials.password === '02015') {
          setIsService(true);
        } else {
          setIsService(false);
        }
        navigation.replace('DeviceSelection');
      }
    } catch (error) {
      console.error('Error checking login status:', error);
    }
  };

  const handleLogin = async () => {
    try {
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
    } catch (error) {
      console.error('Error during login:', error);
      Alert.alert(t('error'), t('Something went wrong. Please try again.'));
    }
  };

  const handleLanguageChange = (selectedLanguage) => {
    setLanguage(selectedLanguage);
    i18n.changeLanguage(selectedLanguage);
    setModalVisible(false);
  };

  const renderLanguageItem = ({ item }) => (
    <TouchableOpacity onPress={() => handleLanguageChange(item)}>
      <Image source={languages[item]} style={styles.modalFlag} />
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.body}>
      <View style={styles.container}>
        <TouchableOpacity style={styles.flagButton} onPress={() => setModalVisible(true)}>
          <Image source={languages[language]} style={styles.flag} />
        </TouchableOpacity>
        <Image source={require('../assets/SMART_ICON.png')} style={styles.image} />
        <TextInput
          style={styles.input}
          placeholder={t('username')}
          value={username}
          onChangeText={(text) => setUsername(text.trimEnd())}
        />
        <TextInput
          style={styles.input}
          placeholder={t('password')}
          value={password}
          secureTextEntry
          onChangeText={(text) => setPassword(text.trimEnd())}
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
            onPress={() => setStayLoggedIn(!stayLoggedIn)}
            isChecked={stayLoggedIn}
          />
        </View>
        <TouchableOpacity onPress={handleLogin} style={styles.BPButton}>
          <Text style={styles.BPButtonText}>{t('login')}</Text>
        </TouchableOpacity>
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => {
            setModalVisible(!modalVisible);
          }}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalView}>
              <FlatList
                data={Object.keys(languages)}
                renderItem={renderLanguageItem}
                keyExtractor={(item) => item}
                numColumns={3}
                contentContainerStyle={styles.modalContent}
              />
              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => setModalVisible(!modalVisible)}
              >
                <Text style={styles.textStyle}>{t('close')}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </View>
    </SafeAreaView>
  );
};

const screenWidth = Dimensions.get('window').width;
const maxContentWidth = 1000;
const contentWidth = screenWidth * 0.9 > maxContentWidth ? maxContentWidth : screenWidth * 0.9;

const styles = StyleSheet.create({
  body: {
    flex: 1,
    backgroundColor: colors.white,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  flagButton: {
    position: 'absolute',
    top: 40,
    right: 20,
    zIndex: 5000,
  },
  flag: {
    width: 30,
    height: 20,
    borderColor: colors.lightgray,
    borderWidth: 0.5
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
    borderColor: colors.lightgray,
    borderWidth: 1,
    borderRadius: 4,
    marginBottom: 12,
    fontSize: 18,
    paddingHorizontal: 8,
  },
  label: {
    margin: 8,
  },
  selectedFlag: {
    borderWidth: 1,
    borderColor: colors.lightgray,
  },
  BPButton: {
    backgroundColor: colors.lightblue,
    borderRadius: 8,
    paddingVertical: 14,
    paddingHorizontal: 20,
    marginTop: 20,
    width: '90%',
  },
  BPButtonText: {
    color: colors.white,
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
    width: '90%',
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalView: {
    margin: 20,
    width: '80%',
    height: '50%', // Riduce l'altezza del modal a metà schermo
    backgroundColor: colors.white,
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalContent: {
    justifyContent: 'center',
  },
  modalFlag: {
    width: 50,
    height: 30,
    margin: 10,
    borderWidth: 0.5,
    borderColor: colors.lightgray,
  },
  closeButton: {
    backgroundColor: colors.lightblue,
    borderRadius: 10,
    padding: 10,
    elevation: 2,
    marginTop: 20,
  },
  textStyle: {
    color: colors.white,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default LoginScreen;
