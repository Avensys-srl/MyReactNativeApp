import React, {Component} from 'react';
import {SafeAreaView, ScrollView, Pressable, Text, View} from 'react-native';

import styles from '../styles/styles.js';

import BLEReader from './BLEReader.js';
/*import SingleButton from '../icons/SingleButton.js';
import CustomBottomNavigation from '../icons/CustomBottomNavigation.js';
import TrippleBtn from '../icons/TrippleBtn.js';
import ToggleSwitch from '../icons/ToggleSwitch.js';
import NewRangeSlider from '../icons/NewRangeSlider.js';
import CircleProgressBar from '../icons/CircleProgressBar.js';
import ChangeStatusBtn from '../icons/ChangeStatusBtn.js';
import VerticalProgressBar from '../icons/VerticalProgressBar.js';*/
import CountdownProgressBar from '../icons/CountdownProgressBar.js';
import {eepromData, pollingData, debugData} from '../function/Data.js';
import InfoText from '../icons/Controls.js';
import {convertEEPROMToUint8Array} from '../function/Parsing.js';
import CustomNavigation from './CustomNavigation.js';
import HI from '../assets/house-icon-original.png';
import PI from '../assets/sliders-icon-original.png';
import II from '../assets/info-icon-original.png';
import SI from '../assets/wrench-icon-original.png';

class BLEScreen extends Component {
  constructor(props) {
    super(props);

    this.state = {
      TR: 0,
      TS: 0,
      TF: 0,
      TE: 0,
      speedR: 0,
      speedF: 0,
      isFirstCycle: true,
      airflow: 0,
      serial: 0,
    };

    this.bluetooth = new BLEReader();
    this.bluetooth.componentDidMount();
  }

  componentDidMount() {
    this.updateInterval = setInterval(() => {
      this.setState({
        TR: pollingData.MeasTemp2R,
        TS: pollingData.MeasTemp3S,
        TF: pollingData.MeasTemp1F,
        TE: pollingData.MeasTemp4E,
        speedF: debugData.SpeedMotorF1,
        speedR: debugData.SpeedMotorR1,
        Vr: debugData.VoutMotorR,
        Vf: debugData.VoutMotorF,
        airflow: eepromData.Set_StepMotorsFSC_CAF4 / 10,
      });

      if (this.state.isFirstCycle == true && eepromData.SerialString > 0) {
        this.setState({
          serial: eepromData.SerialString,
          isFirstCycle: false,
        });
      }

      // console.debug('verifico', this.state.airflow, this.state.isFirstCycle);
    }, 1000);
  }

  componentWillUnmount() {
    clearInterval(this.updateInterval);
  }

  navigateToScreen = () => {
    this.props.navigation.navigate('InfoScreen');
  };

  handleProgressBarChange = newValue => {
    // Esegui le azioni desiderate quando il valore cambia, ad esempio, aggiorna lo stato di BLEScreen
    // bconsole.debug('Nuovo valore barra:', newValue);
    eepromData.Set_StepMotorsFSC_CAF4 = newValue * 1000;
    eepromData.cntUpdate_SettingPar++;
    this.setState({airflow: eepromData.Set_StepMotorsFSC_CAF4 / 10});
    const nuovaEE = convertEEPROMToUint8Array(eepromData);
    console.debug(nuovaEE);

    // Puoi fare qualcos'altro qui con il nuovo valore
  };

  render() {
    // console.debug('render', eepromData.SerialString);

    if (this.state.serial <= 0 && this.state.isFirstCycle == true) {
      return (
        <View>
          <Text>{'Loading data...'}</Text>
        </View>
      );
    }

    return (
      <SafeAreaView style={styles.body}>
        <ScrollView>
          <Pressable style={styles.scanButton} onPress={this.navigateToScreen}>
            <Text style={styles.scanButtonText}>{'Check Data'}</Text>
          </Pressable>
          <CountdownProgressBar
            label={'Airflow'}
            max_val={100}
            min_val={0}
            init_val={this.state.airflow / 100}
            onValueChange={this.handleProgressBarChange}></CountdownProgressBar>
        </ScrollView>
        <InfoText
          descr={'Return Temperature'}
          value={this.state.TR / 10 + ' °C'}
        />
        <InfoText
          descr={'Fresh Temperature'}
          value={this.state.TF / 10 + ' °C'}
        />
        <InfoText
          descr={'Supply Temperature'}
          value={this.state.TS / 10 + ' °C'}
        />
        <InfoText
          descr={'Exhaust Temperature'}
          value={this.state.TE / 10 + ' °C'}
        />
        <InfoText
          descr={'Speed Fan Fresh/Supply'}
          value={Array(this.state.speedF + ' RPM', this.state.Vf / 100 + ' V')}
        />
        <InfoText
          descr={'Speed Fan Return/Exhaust'}
          value={Array(this.state.speedR + ' RPM', this.state.Vr / 100 + ' V')}
        />
        <View
          style={{
            flex: 1,
            alignItems: 'center',
            justifyContent: 'flex-end',
          }}></View>
      </SafeAreaView>
    );
  }
}
export default BLEScreen;

/*
  <CircleProgressBar
        TSB={'Inbalance'}
        TSR={70}
        TSL={-70}
        RIV={2}
        BG={0}></CircleProgressBar>
      <Text style={styles.sectionDescription}>
        {'Please choose your speed'}
      </Text>
      <TrippleBtn TBC={'2'} TBR={'3'} TBL={'1'}></TrippleBtn>
      <ToggleSwitch TOO={'Speed Mode'} CL={'Stepless'} CR={'3 Speed'} BG={0} />
      <NewRangeSlider TPR={'choose'} VL1={30} VL2={100}></NewRangeSlider>
      <ChangeStatusBtn CST={'click on me'} BG={0}></ChangeStatusBtn>
      <VerticalProgressBar FSI={''} VS={30} TS={'Speed'} BG={1} />
*/
