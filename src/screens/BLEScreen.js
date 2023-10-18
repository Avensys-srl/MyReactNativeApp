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
import {eepromData} from '../function/Data.js';

class BLEScreen extends Component {
  constructor(props) {
    super(props);

    this.state = {
      address: 0,
      isFirstCycle: true,
      airflow: 0,
    };

    this.bluetooth = new BLEReader();
    this.bluetooth.componentDidMount();
  }

  componentDidMount() {
    this.updateInterval = setInterval(() => {
      this.setState({
        address: eepromData.AddrUnit,
      });

      if (
        this.state.isFirstCycle == true &&
        eepromData.Set_StepMotorsFSC_CAF4 > 0
      ) {
        this.setState({
          airflow: eepromData.Set_StepMotorsFSC_CAF4 / 10,
          isFirstCycle: false,
        });
      }

      console.debug(
        'verifico',
        this.state.airflow,
        this.state.isFirstCycle,
        this.state.address,
      );
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
    console.debug('Nuovo valore barra:', newValue);
    eepromData.Set_StepMotorsFSC_CAF4 = newValue * 1000;
    this.setState({airflow: eepromData.Set_StepMotorsFSC_CAF4 / 10});

    // Puoi fare qualcos'altro qui con il nuovo valore
  };

  render() {
    console.debug('render', this.state.airflow);

    if (this.state.address <= 0 && this.state.isFirstCycle == true) {
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
