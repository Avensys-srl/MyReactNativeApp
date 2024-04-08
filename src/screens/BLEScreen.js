import React, {Component} from 'react';
import {
  SafeAreaView,
  ScrollView,
  Pressable,
  Text,
  View,
  StyleSheet,
  Image,
} from 'react-native';

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
import {WebView} from 'react-native-webview';
import { tapHandlerName } from 'react-native-gesture-handler/lib/typescript/handlers/TapGestureHandler.js';

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
      Bypass: 'Close',
      CO2: 0,
      RH: 0,
      VOC: 0,
    };

    this.bluetooth = new BLEReader();
    this.bluetooth.componentDidMount();
  }

    componentDidMount() {
      this.updateInterval = setInterval(() => {
        this.setState(prevState => ({
          TR: pollingData.MeasTemp2R,
          TS: pollingData.MeasTemp3S,
          TF: pollingData.MeasTemp1F,
          TE: pollingData.MeasTemp4E,
          speedF: debugData.SpeedMotorF1,
          speedR: debugData.SpeedMotorR1,
          Vr: debugData.VoutMotorR,
          Vf: debugData.VoutMotorF,
          airflow: eepromData.Set_StepMotorsFSC_CAF4 / 10,
          Bypass: eepromData.Config_Bypass,
          CO2: pollingData.CO2Level,
          RH: pollingData.RHLevel,
          VOC: pollingData.VOCLevel,
          serial: prevState.isFirstCycle && eepromData.SerialString > 0 ? eepromData.SerialString : prevState.serial,
          isFirstCycle: !prevState.isFirstCycle && eepromData.SerialString > 0 ? false : prevState.isFirstCycle,
        }));
      }, 1000);
    }
    

  componentWillUnmount() {
    clearInterval(this.updateInterval);
  }

  navigateToInfo = () => {
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

  updateConfig = (value) => {
    eepromData.Config_Bypass = value;
    const nuovaEE = convertEEPROMToUint8Array(eepromData);
    console.debug(nuovaEE);

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
          <Pressable style={styles.scanButton} onPress={this.navigateToInfo}>
            <Text style={styles.scanButtonText}>{'All Data'}</Text>
          </Pressable>
          <CountdownProgressBar
            label={'Airflow'}
            max_val={100}
            min_val={0}
            init_val={this.state.airflow / 100}
            onValueChange={this.handleProgressBarChange}></CountdownProgressBar>
        </ScrollView>
        <View style={styles.buttonContainer}>
        <Text style={styles.TitleText}>{'Bypass Control'}</Text>
        </View>
        <View style={styles.buttonContainer}>
        <Pressable style={styles.BPButton} onPress={() => this.updateConfig(4)}>
          <Text style={styles.BPButtonText}>{'Open'}</Text>
        </Pressable>
        <Pressable style={styles.BPButton} onPress={() => this.updateConfig(3)}>
          <Text style={styles.BPButtonText}>{'Close'}</Text>
        </Pressable>
        <Pressable style={styles.BPButton} onPress={() => this.updateConfig(0)}>
          <Text style={styles.BPButtonText}>{'Automatic'}</Text>
        </Pressable>
        </View>
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
        <InfoText descr={'RH Level'} value={this.state.RH + ' %'} />
        <InfoText descr={'CO2 Level'} value={this.state.CO2 + ' PPM'} />
        <InfoText descr={'VOC Level'} value={this.state.VOC + ' PPM'} />
        <InfoText descr={'Bypass'} value={this.state.Bypass === 0 ? 'Automatic' : this.state.Bypass === 3 ? 'Close' : this.state.Bypass === 4 ? 'Open' : 'Unknown'} />
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
