// Importa le librerie necessarie
import React, {Component} from 'react';
import {View, Text, SafeAreaView, ScrollView, Pressable} from 'react-native';
import styles from '../styles/styles.js';
import {eepromData} from '../function/Data.js';
import CustomSlider from '../icons/CustomSlider.js';

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

  handleValueChange = (key, value) => {
    this.setState({ [key]: value });
    eepromData.setValueByKey(key, Number(value));
  };

  render() {
    const { isDataLoaded } = this.state;

    return (
      <SafeAreaView style={styles.body}>
        <ScrollView>
          {!isDataLoaded ? (
            <View>
              <Text style={styles.sectionDescription}>
                {'Data Loading please wait...'}
              </Text>
            </View>
          ) : (
            <View>
              <CustomSlider
                title="Set Imbalance 1"
                minValue={0}
                maxValue={100}
                initialValue={this.state.Set_Imbalance1}
                showToggle={false}
                onValueChange={(value) => this.handleValueChange('Set_Imbalance1', value)}
              />
              <CustomSlider
                title="Number of Pulse Motors"
                minValue={0}
                maxValue={100}
                initialValue={this.state.numPulseMotors}
                showToggle={false}
                onValueChange={(value) => this.handleValueChange('numPulseMotors', value)}
              />
              <CustomSlider
                title="Depot Motors"
                minValue={0}
                maxValue={100}
                initialValue={this.state.depotMotors}
                showToggle={false}
                onValueChange={(value) => this.handleValueChange('depotMotors', value)}
              />
              <CustomSlider
                title="Set Point CO2"
                minValue={0}
                maxValue={100}
                initialValue={this.state.SetPoint_CO2}
                showToggle={false}
                onValueChange={(value) => this.handleValueChange('SetPoint_CO2', value)}
              />
              <CustomSlider
                title="Set Point RH"
                minValue={0}
                maxValue={100}
                initialValue={this.state.SetPoint_RH}
                showToggle={false}
                onValueChange={(value) => this.handleValueChange('SetPoint_RH', value)}
              />
              <CustomSlider
                title="Set Point VOC"
                minValue={0}
                maxValue={100}
                initialValue={this.state.SetPoint_VOC}
                showToggle={false}
                onValueChange={(value) => this.handleValueChange('SetPoint_VOC', value)}
              />
              <CustomSlider
                title="Set Point Airflow CO2"
                minValue={0}
                maxValue={100}
                initialValue={this.state.SetPoint_Airflow_CO2}
                showToggle={false}
                onValueChange={(value) => this.handleValueChange('SetPoint_Airflow_CO2', value)}
              />
            </View>
          )}
        </ScrollView>
      </SafeAreaView>
    );
  }
}

export default AdvEditing;
