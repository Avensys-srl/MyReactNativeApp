// src/screens/SplashScreen.js
import React, { useEffect } from 'react';
import { View, Image, StyleSheet, SafeAreaView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import colors from '../styles/colors';

const SplashScreen = () => {
  const navigation = useNavigation();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigation.replace('LoginScreen');
    }, 3000);

    return () => clearTimeout(timer); // Cleanup the timer if the component unmounts
  }, [navigation]);

  return (
    <SafeAreaView style={styles.body}>
      <View style={styles.container}>
        <View style={styles.row}>
          <Image source={require('../assets/SMART_ICON.png')} style={styles.image} />
        </View>
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
    flexDirection: 'column',
    justifyContent: 'space-evenly', // Distributes space evenly among the rows
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  row: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: '80%',  // Image width set to 80% of the container's width
    maxWidth: 1000, // Image width should not exceed 1000 pixels
    height: undefined, // Maintain aspect ratio
    aspectRatio: 1, // Assuming the image is square. Adjust as needed.
    resizeMode: 'contain',
  },
});

export default SplashScreen;
