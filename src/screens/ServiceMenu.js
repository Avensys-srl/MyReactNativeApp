// src/screens/ServiceMenu.js
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, ScrollView, Dimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import ServiceRoutes from './service';
import colors from '../styles/colors';

const ServiceMenu = () => {
  const navigation = useNavigation();
  const { t } = useTranslation();
  const routes = ServiceRoutes();

  return (
    <SafeAreaView style={styles.body}>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>{t('service')}</Text>
          <View style={styles.line} />
        </View>
        {routes.map((route) => (
          <TouchableOpacity
            key={route.name}
            style={styles.button}
            onPress={() => navigation.navigate(route.name)}
          >
            <Text style={styles.buttonText}>{t(route.labelKey)}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
};

const screenWidth = Dimensions.get('window').width;
const maxButtonWidth = 1000;
const buttonWidth = ((screenWidth - 32) * 1) > maxButtonWidth ? maxButtonWidth : ((screenWidth - 32) * 1);

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
  button: {
    backgroundColor: colors.lightblue,
    width: buttonWidth,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 4,
    marginVertical: 5,
    alignItems: 'flex-start',
  },
  buttonText: {
    color: colors.white,
    fontSize: 18,
  },
});

export default ServiceMenu;
