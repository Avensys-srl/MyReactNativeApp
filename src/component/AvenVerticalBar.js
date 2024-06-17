import React, { useState, useRef } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import colors from '../styles/colors'; 
import Sizing from '../styles/sizing';

const cus_height = Math.floor(Sizing.vw * 50);
const cus_width = Sizing.screenWidth > 430 ? 100 : Math.floor((Sizing.vw * 85) / 5);
const barWidth = Math.floor(cus_width / 3);
const barHeight = Math.floor(cus_height / 2);

const AvenVerticalBar = ({ VS, TS, Visible = true, Probes, minValue = 0, maxValue = 100, onValueChange }) => {
  const [progress, setProgress] = useState(Math.round(VS));
  const step = 1;
  const intervalRef = useRef(null);
  const timeoutRef = useRef(null);

  const increaseProgress = () => {
    const newProgress = Math.min(Math.round(progress + step), maxValue);
    setProgress(newProgress);
    onValueChange(TS, newProgress);
  };

  const decreaseProgress = () => {
    const newProgress = Math.max(Math.round(progress - step), minValue);
    setProgress(newProgress);
    onValueChange(TS, newProgress);
  };

  const handlePressIn = (action) => {
    action(); // Execute the action immediately
    timeoutRef.current = setTimeout(() => {
      intervalRef.current = setInterval(action, 100);
    }, 500); // Delay before starting the continuous action
  };

  const handlePressOut = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
  };

  if (!Visible) return null;

  return (
    <View style={{ alignItems: 'center' }}>
      <View style={styles.container}>
        <Text style={[styles.componentTitle, styles.txtlbl]}>{TS}</Text>
        <TouchableOpacity
          onPressIn={() => handlePressIn(increaseProgress)}
          onPressOut={handlePressOut}
          style={styles.button}
        >
          <Image source={Probes ? require('../assets/arrowUpBlack.png') : require('../assets/fan.png')} style={styles.largeImg} />
        </TouchableOpacity>
        <View style={styles.barout}>
          <View style={styles.barin}>
            <View style={[styles.progress, { height: `${progress}%` }]} />
          </View>
        </View>
        <TouchableOpacity
          onPressIn={() => handlePressIn(decreaseProgress)}
          onPressOut={handlePressOut}
          style={styles.button}
        >
          <Image source={Probes ? require('../assets/arrowDown.png') : require('../assets/fan.png')} style={styles.smallImg} />
        </TouchableOpacity>
        <Text style={[styles.componentTitle, styles.percentageText]}>{progress}%</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: cus_width,
    backgroundColor: colors.white,
    borderRadius: 10,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: colors.lightblue,
    alignItems: 'center',
    paddingTop: 8,
    paddingBottom: 8,
  },
  barout: {
    width: barWidth,
    height: barHeight,
    borderWidth: 2,
    borderColor: colors.lightblue,
    borderRadius: 100,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 2,
  },
  barin: {
    height: '100%',
    width: barWidth - 8,
    borderRadius: 100,
    overflow: 'hidden',
  },
  progress: {
    position: 'absolute',
    width: barWidth - 8,
    bottom: 0,
    backgroundColor: colors.lightblue,
    borderRadius: 100,
  },
  image: {
    width: 30,
    height: 30,
    marginTop: 8,
  },
  componentTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.black,
  },
  txtlbl: {
    marginBottom: 8,
  },
  button: {
    marginTop: 8,
    marginBottom: 8,
  },
  largeImg: {
    width: 50,
    height: 50,
    resizeMode: 'contain',
  },
  smallImg: {
    width: 30,
    height: 30,
    resizeMode: 'contain',
  },
  percentageText: {
    fontSize: 16,
    color: colors.black,
  },
  rightTitle: {
    position: 'absolute',
    top: 10,
    right: 10,
  },
});

export default AvenVerticalBar;
