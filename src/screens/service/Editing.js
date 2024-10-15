import React, { Component } from 'react';
import { View, ScrollView, Text, TouchableOpacity, Modal } from 'react-native';
import styles from '../../styles/styles.js';
import { eepromData } from '../../function/Data.js';
import CustomSlider from '../../icons/CustomSlider.js';
import CustomBalanceSlider from '../../icons/CustomBalanceSlider.js';
import { withTranslation } from 'react-i18next';
import { WifiContext } from '../../context/WiFiContext.js';

class Editing extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isImbalanced: eepromData.isImbalanceEnabled(),
      Set_Imbalance1: 0,
      numPulseMotors: 0,
      depotMotors: 0,
      SetPoint_CO2: 0,
      SetPoint_RH: 0,
      SetPoint_VOC: 0,
      SetPoint_Airflow_CO2: 0,
      gg_manut_Filter: 0,
      Bypass_minTempExt: 0,
      SetPointTemp1: 0,
      Config_Bypass: 0,
      isDataLoaded: false,
      modalVisible: false,
    };
  }

  static contextType = WifiContext;

  componentDidMount() {
    this.updateInterval = setInterval(() => {
      const isDataAvailable = eepromData.isImbalanceEnabled() !== undefined &&
                              eepromData.Set_Imbalance1 !== null &&
                              eepromData.numPulseMotors !== undefined &&
                              eepromData.depotMotors !== undefined &&
                              eepromData.SetPoint_CO2 !== undefined &&
                              eepromData.SetPoint_RH !== undefined &&
                              eepromData.SetPoint_VOC !== undefined &&
                              eepromData.SetPoint_Airflow_CO2 !== undefined &&
                              eepromData.gg_manut_Filter !== undefined &&
                              eepromData.Bypass_minTempExt !== undefined &&
                              eepromData.SetPointTemp1 !== undefined &&
                              eepromData.Config_Bypass !== undefined;

      if (isDataAvailable) {
        this.setState({
          isImbalanced: eepromData.isImbalanceEnabled(),
          Set_Imbalance1: eepromData.Set_Imbalance1,
          numPulseMotors: eepromData.numPulseMotors,
          depotMotors: eepromData.depotMotors,
          SetPoint_CO2: eepromData.SetPoint_CO2,
          SetPoint_RH: eepromData.SetPoint_RH,
          SetPoint_VOC: eepromData.SetPoint_VOC,
          SetPoint_Airflow_CO2: eepromData.SetPoint_Airflow_CO2,
          gg_manut_Filter: eepromData.gg_manut_Filter,
          Bypass_minTempExt: eepromData.Bypass_minTempExt / 10,
          SetPointTemp1: eepromData.SetPointTemp1 / 10,
          Config_Bypass: eepromData.Config_Bypass,
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
    const isTemperatureKey = ['Bypass_minTempExt', 'SetPointTemp1'].includes(key);
    const adjustedValue = isTemperatureKey ? value * 10 : value;

    this.setState({ [key]: value });
    eepromData.setValueByKey(key, Number(adjustedValue));
    console.log(key, " : ", Number(adjustedValue));
    const { updateEEPROMData } = this.context;
    const updates = {
      Set_Imbalance1: eepromData.Set_Imbalance1,
      numPulseMotors: eepromData.numPulseMotors,
      depotMotors: eepromData.depotMotors,
      SetPoint_CO2: eepromData.SetPoint_CO2,
      SetPoint_RH: eepromData.SetPoint_RH,
      SetPoint_VOC: eepromData.SetPoint_VOC,
      SetPoint_Airflow_CO2: eepromData.SetPoint_Airflow_CO2,
      gg_manut_Filter: eepromData.gg_manut_Filter,
      Bypass_minTempExt: eepromData.Bypass_minTempExt,
      SetPointTemp1: eepromData.SetPointTemp1,
      Config_Bypass: eepromData.Config_Bypass,
    };
    updateEEPROMData(updates);
  };

  handleToggleChange = () => {
    eepromData.toggleImbalance();
    eepromData.ValueChange = 1;
    const { updateEEPROMData } = this.context;
    const updates = {
      Enab_Fuction1: eepromData.Enab_Fuction1,
    };
    updateEEPROMData(updates);
    this.setState({ isImbalanced: eepromData.isImbalanceEnabled() });
  };

  openModal = () => {
    this.setState({ modalVisible: true });
  };

  closeModal = () => {
    this.setState({ modalVisible: false });
  };

  handleBypassConfigChange = (value) => {
    this.setState({ Config_Bypass: value, modalVisible: false });
    this.handleValueChange('Config_Bypass', value);
  };

  render() {
    const { t } = this.props;
    const { isDataLoaded, modalVisible, Config_Bypass } = this.state;

    const slidersConfig = [
        { key: 'gg_manut_Filter', title: t('filter_timer'), minValue: 30, maxValue: 180, defaultValue: 180, showToggle: false },
        { key: 'SetPointTemp1', title: t('SetPointTemp'), minValue: 12, maxValue: 35, defaultValue: 22, showToggle: false },
        { key: 'Bypass_minTempExt', title: t('Bypass_minTempExt'), minValue: 12, maxValue: 35, defaultValue: 16, showToggle: false },
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
              <Text style={styles.title}>{t('loading_data')}</Text>
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
                initialToggle={this.state.isImbalanced}
                onToggleChange={this.handleToggleChange}
                onValueChange={(value) => this.handleValueChange('Set_Imbalance1', value)}
              />
              <View style={styles.itemContainer}>
                <Text style={styles.itemTitle}>{t('Config_Bypass')}</Text>
                <TouchableOpacity style={styles.settingButton} onPress={this.openModal}>
                  <Text style={styles.settingText}>
                    {Config_Bypass === 0 ? t('automatic') :
                     Config_Bypass === 1 ? t('external') :
                     Config_Bypass === 2 ? t('closed') :
                     Config_Bypass === 3 ? t('opened') : t('night_cooling')}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        </ScrollView>
        <Modal
          visible={modalVisible}
          transparent={true}
          animationType="slide"
          onRequestClose={this.closeModal}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContainer}>
              <Text style={styles.modalTitle}>{t('select_option')}</Text>
              {['automatic', 'external', 'closed', 'opened', 'night_cooling'].map((option, index) => (
                option !== 'external' && ( // Condizione per saltare 'external'
                  <TouchableOpacity
                    key={option}
                    style={styles.modalOptionButton}
                    onPress={() => this.handleBypassConfigChange(index)}
                  >
                    <Text style={styles.modalOptionText}>{t(option)}</Text>
                  </TouchableOpacity>
                )
              ))}
              <TouchableOpacity style={styles.closeButton} onPress={this.closeModal}>
                <Text style={styles.closeButtonText}>{t('close')}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </View>
    );
  }
}

export default withTranslation()(Editing);
