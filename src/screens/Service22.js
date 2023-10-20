import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  Dimensions,
} from 'react-native';
import React, {useState} from 'react';
import ToggleSwitch from '../icons/ToggleSwitch';
import CountdownProgressBar from '../icons/CountdownProgressBar';
import OnOff from '../icons/OnOff';

const {width} = Dimensions.get('window');
const {height} = Dimensions.get('window');
const Service22 = () => {
  return (
    <View>
      <TouchableOpacity style={styles.bgheading}>
        <Text style={styles.headingTxt}>Preheat Settings</Text>
        <View style={styles.subRow}>
          <Image
            source={require('../assets/star-icon-white.png')}
            style={styles.imgHead}
          />
          <Image
            source={require('../assets/arrow-circle-up-icon-White.png')}
            style={styles.imgHead}
          />
        </View>
      </TouchableOpacity>
      <View style={styles.pairedView}>
        <OnOff status={'I/PEHD activation'} />
      </View>
      <View style={styles.pairedView}>
        <ToggleSwitch TOO={'paired'} CL={''} CR={''} BG={0} />
      </View>
      <View style={styles.pairedView}>
        <ToggleSwitch TOO={'temprature'} CL={''} CR={''} BG={1} />
      </View>
      <View style={styles.pairedView}>
        <ToggleSwitch TOO={''} CL={'exhaust'} CR={'fresh'} BG={1} />
      </View>
      <View style={styles.pairedView}>
        <CountdownProgressBar
          min_val={0}
          max_val={100}
          init_val={0.1}
          label={'communication rate [%]'}
        />
      </View>
    </View>
  );
};

export default Service22;

const styles = StyleSheet.create({
  bgheading: {
    padding: 10,
    backgroundColor: '#92d050',
    margin: 10,
    borderRadius: 5,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  headingTxt: {
    color: 'white',
    fontSize: 20,
  },
  imgHead: {
    width: 25,
    height: 25,
  },
  subRow: {
    flexDirection: 'row',
  },
  container: {
    width: 150,
    height: 20,
    borderRadius: 10,
    backgroundColor: 'white',
    borderColor: 'black',
    borderWidth: 1,
    flexDirection: 'row',
    overflow: 'hidden',
  },
  circle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#4CAF50',
    borderWidth: 1,
    borderColor: 'black',
    position: 'absolute',
    top: -1,
  },
  leftCircle: {
    left: -1,
  },
  rightCircle: {
    right: -1,
  },
  pairedView: {
    justifyContent: 'center',
    alignItems: 'center',
    width: width * 0.93,
    height: height * 0.13,
    borderWidth: 1,
    borderRadius: 5,
    margin: 15,
  },
});
