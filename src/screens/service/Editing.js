import React, {Component} from 'react';
import { View, ScrollView, Text } from 'react-native';
import styles from '../../styles/styles.js';
import { eepromData } from '../../function/Data.js';
import CustomSlider from '../../icons/CustomSlider.js';
import CustomBalanceSlider from '../../icons/CustomBalanceSlider.js';
import { withTranslation } from 'react-i18next';

class Editing extends Component {
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
      Filter_timer: 0,
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
                              eepromData.SetPoint_Airflow_CO2 !== undefined &&
                              eepromData.gg_manut_Filter !== undefined;

      if (isDataAvailable) {
        this.setState({
          Set_Imbalance1: eepromData.Set_Imbalance1,
          numPulseMotors: eepromData.numPulseMotors,
          depotMotors: eepromData.depotMotors,
          SetPoint_CO2: eepromData.SetPoint_CO2,
          SetPoint_RH: eepromData.SetPoint_RH,
          SetPoint_VOC: eepromData.SetPoint_VOC,
          SetPoint_Airflow_CO2: eepromData.SetPoint_Airflow_CO2,
          Filter_timer: eepromData.gg_manut_Filter,
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
    const { t } = this.props;
    const { isDataLoaded } = this.state;

    const slidersConfig = [
        { key: 'Filter_timer', title: t('filter_timer'), minValue: 30, maxValue: 180, defaultValue: 180, showToggle: false },
        { key: 'SetPoint_RH', title: t('set_point_rh'), minValue: 20, maxValue: 99, defaultValue: 70, showToggle: false },
        { key: 'SetPoint_CO2', title: t('set_point_co2'), minValue: 700, maxValue: 1500, defaultValue: 750, showToggle: false },
        { key: 'SetPoint_Airflow_CO2', title: t('set_point_airflow_co2'), minValue: 25, maxValue: 100, defaultValue: 100, showToggle: false },
        { key: 'SetPoint_VOC', title: t('set_point_voc'), minValue: 2, maxValue: 100, defaultValue: 20, showToggle: false },
    ];

    return (
      <View style={styles.container}>
        <ScrollView>
          {!isDataLoaded ? (
            <View style={styles.header}>
              <Text style={styles.title}>{t('data_loading')}</Text>
              <View style={styles.line} />
            </View>
          ) : (
            <View>
              <View style={styles.header}>
                <Text style={styles.title}>{t('Editing')}</Text>
                <View style={styles.line} />
              </View>
              {slidersConfig.map(slider => (
                <CustomSlider
                  key={slider.key}
                  title={slider.title}
                  minValue={slider.minValue}
                  maxValue={slider.maxValue}
                  initialValue={this.state[slider.key]}
                  defaultValue={slider.defaultValue}
                  showToggle={slider.showToggle}
                  onValueChange={(value) => this.handleValueChange(slider.key, value)}
                />
              ))}
                <CustomBalanceSlider
                title={t('set_imbalance')}
                minValue={-70}
                maxValue={70}
                initialValue={this.state.Set_Imbalance1}
                showToggle={true}
                onValueChange={(value) => this.handleValueChange('Set_Imbalance1', value)}
              />
            </View>
          )}
        </ScrollView>
      </View>
    );
  }
}

export default withTranslation()(Editing);
