// Importa le librerie necessarie
import React, {Component} from 'react';
import {View, Text, SafeAreaView, ScrollView, Pressable} from 'react-native';
import styles from '../styles/styles.js';
import {eepromData} from '../function/Data.js';
import {InfoText, EditableInfoRow} from '../icons/Controls.js';

class AdvEditing extends Component {
  constructor(props) {
    super(props);
    this.state = {
      Set_Imbalance1: 0,
      numPulseMotors: 0,
      depotMotors: 0,
      SetPoint_CO2: 0,
      SetPoint_RH: 0,
      SetPoint_VOC: 0,
      SetPoint_Airflow_CO2: 0,
      isDataLoaded: false,
    };
  }

  componentDidMount() {
    this.updateInterval = setInterval(() => {
      const isDataAvailable = eepromData.Set_Imbalance1 !== undefined &&
                              eepromData.numPulseMotors !== undefined &&
                              eepromData.depotMotors !== undefined &&
                              eepromData.SetPoint_CO2 !== undefined &&
                              eepromData.SetPoint_RH !== undefined &&
                              eepromData.SetPoint_VOC !== undefined &&
                              eepromData.SetPoint_Airflow_CO2 !== undefined;

      if (isDataAvailable) {
        this.setState({
          Set_Imbalance1: eepromData.Set_Imbalance1,
          numPulseMotors: eepromData.numPulseMotors,
          depotMotors: eepromData.depotMotors,
          SetPoint_CO2: eepromData.SetPoint_CO2,
          SetPoint_RH: eepromData.SetPoint_RH,
          SetPoint_VOC: eepromData.SetPoint_VOC,
          SetPoint_Airflow_CO2: eepromData.SetPoint_Airflow_CO2,
          isDataLoaded: true,
        });
        clearInterval(this.updateInterval);
      }
    }, 1000);
  }

  componentWillUnmount() {
    clearInterval(this.updateInterval);
  }

  navigateToScreen = () => {
    this.props.navigation.navigate('BLEScreen');
  };

  render() {
    const { isDataLoaded } = this.state;

    return (
      <SafeAreaView style={styles.body}>
        <ScrollView>
          <Pressable style={styles.scanButton} onPress={this.navigateToScreen}>
            <Text style={styles.scanButtonText}>{'Back to home'}</Text>
          </Pressable>
          {!isDataLoaded ? (
            <View>
              <Text style={styles.sectionDescription}>
                {'Data Loading please wait...'}
              </Text>
            </View>
          ) : (
            <View>
              <EditableInfoRow
                label="numPulseMotors"
                initialValue={String(this.state.numPulseMotors)}
                onSubmitEditing={(newValue) => eepromData.setValueByKey('numPulseMotors', Number(newValue))}
              />
              <EditableInfoRow
                label="depotMotors"
                initialValue={String(this.state.depotMotors)}
                onSubmitEditing={(newValue) => eepromData.setValueByKey('depotMotors', Number(newValue))}
              />
              <EditableInfoRow
                label="SetPoint_RH"
                initialValue={String(this.state.SetPoint_RH)}
                onSubmitEditing={(newValue) => eepromData.setValueByKey('SetPoint_RH', Number(newValue))}
              />
              <EditableInfoRow
                label="SetPoint_CO2"
                initialValue={String(this.state.SetPoint_CO2)}
                onSubmitEditing={(newValue) => eepromData.setValueByKey('SetPoint_CO2', Number(newValue))}
              />
              <EditableInfoRow
                label="SetPoint_VOC"
                initialValue={String(this.state.SetPoint_VOC)}
                onSubmitEditing={(newValue) => eepromData.setValueByKey('SetPoint_VOC', Number(newValue))}
              />
              <EditableInfoRow
                label="Set_Imbalance1"
                initialValue={String(this.state.Set_Imbalance1)}
                onSubmitEditing={(newValue) => eepromData.setValueByKey('Set_Imbalance1', Number(newValue))}
              />
              <EditableInfoRow
                label="SetPoint_Airflow_CO2"
                initialValue={String(this.state.SetPoint_Airflow_CO2)}
                onSubmitEditing={(newValue) => eepromData.setValueByKey('SetPoint_Airflow_CO2', Number(newValue))}
              />
            </View>
          )}
        </ScrollView>
      </SafeAreaView>
    );
  }
}

export default AdvEditing;
