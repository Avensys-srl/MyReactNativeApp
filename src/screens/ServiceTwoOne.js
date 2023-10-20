import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  Dimensions,
  ScrollView,
} from 'react-native';
import React from 'react';
import ToggleSwitch from '../icons/ToggleSwitch';
import CountdownProgressBar from '../icons/CountdownProgressBar';
import OnOff from '../icons/OnOff';
import HI from '../assets/house-icon-original.png';
import PI from '../assets/sliders-icon-original.png';
import II from '../assets/info-icon-original.png';
import SI from '../assets/wrench-icon-original.png';
import CustomNavigation from './CustomNavigation';

const {width} = Dimensions.get('window');
const {height} = Dimensions.get('window');

const ServiceTwoOne = () => {
  return (
    <View style={styles.container}>
      {/* <ScrollView style={{ height: '75%' }}> */}
      {/* <TouchableOpacity style={styles.bgheading}>
          <Text style={styles.headingTxt}>Preheat Settings</Text>
          <View style={styles.subRow}>
            <Image source={require('./src/assets/star-icon.png')} style={styles.imgHead} />
            <Image source={require('./src/assets/arrow-up.png')} style={styles.imgHead} />
          </View>
        </TouchableOpacity> */}
      <View style={styles.pairedView}>
        <OnOff status={'I/PEHD activation'} />
      </View>
      <View style={styles.pairedView}>
        <ToggleSwitch TOO={'paired'} CL={'Unpaired'} CR={'Paired'} BG={0} />
      </View>
      <View style={styles.rateView}>
        <CountdownProgressBar
          min_val={0}
          max_val={100}
          init_val={0.1}
          label={'communication rate [%]'}
        />
      </View>
      <View style={styles.pairedView}>
        <ToggleSwitch TOO={'temprature'} CL={''} CR={''} BG={1} />
      </View>
      <View style={styles.pairedView}>
        <ToggleSwitch TOO={''} CL={'exhaust'} CR={'fresh'} BG={1} />
      </View>

      {/* </ScrollView> */}
      <View style={{flex: 1, alignItems: 'center', justifyContent: 'flex-end'}}>
        <CustomNavigation HI={HI} PI={PI} II={II} SI={SI} OC={1} />
        <Text style={{color: 'red'}}>Service</Text>
      </View>
    </View>
  );
};

export default ServiceTwoOne;

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
    borderWidth: 2,
    borderRadius: 5,
    margin: 15,
    marginBottom: 5,
    marginTop: 5,
  },
  rateView: {
    justifyContent: 'center',
    alignItems: 'center',
    width: width * 0.93,
    height: height * 0.13,
    borderRadius: 5,
    margin: 15,
    marginTop: 0,
  },
  container: {
    flex: 1,
    width: '100%',
    height: '100%',
    borderWidth: 1,
    borderColor: 'red',
    justifyContent: 'flex-end',
    backgroundColor: 'white',
  },
});
