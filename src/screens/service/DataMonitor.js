import React, { Component } from 'react';
import {
  SafeAreaView,
  ScrollView,
  Text,
  View,
} from 'react-native';
import styles from '../../styles/styles.js';
import { eepromData, pollingData, debugData, WifiData } from '../../function/Data.js';
import { InfoText } from '../../icons/Controls.js';
import { withTranslation } from 'react-i18next';

class DataMonitor extends Component {
  constructor(props) {
    super(props);
    this.state = {
      TR: pollingData.MeasTemp2R,
      TS: pollingData.MeasTemp3S,
      TF: pollingData.MeasTemp1F,
      TE: pollingData.MeasTemp4E,
      speedR: debugData.SpeedMotorR1,
      speedF: debugData.SpeedMotorF1,
      airflow: eepromData.Set_StepMotorsFSC_CAF4 / 10,
      Bypass: eepromData.Config_Bypass,
      CO2: pollingData.CO2Level,
      RH: pollingData.RHLevel,
      VOC: pollingData.VOCLevel,
      wifi: WifiData.WifiSSID,
      password: WifiData.WifiPSWD,
      boost: eepromData.isBoostEnabled(),
      alarm: pollingData.getAlarmString(),
      pulse: eepromData.numPulseMotors,
      khk_config: eepromData.KHK_Config,
      khk_setpoint: eepromData.KHK_SetPoint,
      input1: pollingData.MeasInput1,
      input2: pollingData.MeasInput2,
      status: pollingData.getStatusUnit(),
    };
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
        airflow: eepromData.Set_StepMotorsFSC_CAF4 / 10,
        Bypass: eepromData.Config_Bypass,
        CO2: pollingData.CO2Level,
        RH: pollingData.RHLevel,
        VOC: pollingData.VOCLevel,
        wifi: WifiData.WifiSSID,
        password: WifiData.WifiPSWD,
        boost: eepromData.isBoostEnabled(),
        alarm: pollingData.getAlarmString(),
        pulse: eepromData.numPulseMotors,
        khk_config: eepromData.KHK_Config,
        khk_setpoint: eepromData.KHK_SetPoint,
        input1: pollingData.MeasInput1,
        input2: pollingData.MeasInput2,
        status: pollingData.getStatusUnit(),
      });
    }, 1000);
  }

  componentWillUnmount() {
    clearInterval(this.updateInterval);
  }

  render() {
    const { t } = this.props;
    const {
      TR, TS, TF, TE, speedR, speedF, airflow,
      Bypass, CO2, RH, VOC, wifi, password, boost, alarm, pulse, khk_config, khk_setpoint, status, 
      input1, input2, 
    } = this.state;

    return (
      <SafeAreaView style={styles.body}>
        <ScrollView>
        <View style={styles.header}>
          <Text style={styles.title}>{t('Data_Monitor')}</Text>
          <View style={styles.line} />
        </View>
          <InfoText descr={t('alarm_list')} value={alarm} textcolor="red" />
          <InfoText descr={t('return_temp')} value={TR / 10 + ' °C'} />
          <InfoText descr={t('fresh_temp')} value={TF / 10 + ' °C'} />
          <InfoText descr={t('supply_temp')} value={TS / 10 + ' °C'} />
          <InfoText descr={t('exhaust_temp')} value={TE / 10 + ' °C'} />
          <InfoText descr={t('speed_fan_fresh_supply')} value={[speedF + ' RPM', debugData.VoutMotorF / 100 + ' V']} />
          <InfoText descr={t('speed_fan_return_exhaust')} value={[speedR + ' RPM', debugData.VoutMotorR / 100 + ' V']} />
          <InfoText descr={t('rh_level')} value={RH + ' %'} />
          <InfoText descr={t('co2_level')} value={CO2 + ' PPM'} />
          <InfoText descr={t('voc_level')} value={VOC + ' PPM'} />
          <InfoText descr={t('bypass')} value={Bypass === 0 ? t('automatic') : Bypass === 1 ? t('external') : Bypass === 2 ? t('closed') : Bypass === 3 ? t('opened') : Bypass === 4 ? t('Night cooling') : 'Unknown'} />
          <InfoText descr={t('Level Input 1')} value={input1} />
          <InfoText descr={t('Level Input 2')} value={input2} />
          <InfoText descr={t('KHK_config')} value={khk_config} />
          <InfoText descr={t('KHK_setpoint')} value={khk_setpoint} />
          <InfoText descr={t('Status_Unit')} value={status} />
          <InfoText descr={t('wifi_ssid')} value={wifi} />
        </ScrollView>
      </SafeAreaView>
    );
  }
}

export default withTranslation()(DataMonitor);
