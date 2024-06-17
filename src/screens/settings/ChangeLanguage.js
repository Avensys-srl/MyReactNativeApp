// src/screens/settings/ChangeLanguage.js
import React, { useState } from 'react';
import { SafeAreaView, View, Text, TouchableOpacity, StyleSheet, Dimensions, Image } from 'react-native';
import { useTranslation } from 'react-i18next';
import colors from '../../styles/colors';
import DropDownPicker from 'react-native-dropdown-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';

const languages = {
  en: require('../../assets/flags/en.png'),
  de: require('../../assets/flags/de.png'),
  fr: require('../../assets/flags/fr.png'),
  it: require('../../assets/flags/it.png'),
  nl: require('../../assets/flags/nl.png'),
  da: require('../../assets/flags/da.png'),
  sv: require('../../assets/flags/sv.png'),
  pl: require('../../assets/flags/pl.png'),
  lt: require('../../assets/flags/lt.png'),
};

const ChangeLanguage = () => {
  const { t, i18n } = useTranslation();
  const [language, setLanguage] = useState(i18n.language);
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(language);
  const [items, setItems] = useState(Object.keys(languages).map(lang => ({
    label: t(`language_${lang}`),
    value: lang,
    icon: () => <Image source={languages[lang]} style={styles.flag} />,
  })));

  const handleLanguageChange = (selectedLanguage) => {
    setLanguage(selectedLanguage);
    i18n.changeLanguage(selectedLanguage);
    AsyncStorage.setItem('userLanguage', selectedLanguage);
  };

  return (
    <SafeAreaView style={styles.body}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>{t('ChangeLanguage')}</Text>
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
            onChangeValue={handleLanguageChange}
            style={styles.dropdown}
            containerStyle={styles.dropdownContainer}
            labelStyle={styles.dropdownLabel}
            dropDownContainerStyle={styles.dropdownList}
            zIndex={5000}
          />
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
  flag: {
    width: 30,
    height: 20,
    marginRight: 10,
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
});

export default ChangeLanguage;
