class SDAYPROG {
  constructor() {
    this.numRange = 0;
    this.timeON = [0, 0, 0, 0];
    this.timeOFF = [0, 0, 0, 0];
    this.ConfigSpeed = 0;
    this.ConfigImbal = 0;
    this.ConfigTemp = 0;
  }
}

class EEPROM_DATA_TAG {
  constructor() {
    this.AddrUnit = 0;
    this.Type_func = 0;
    this.HW_Vers = 0;
    this.SW_Vers = 0;
    this.SerialString = 0;
    this.swVer_ModBus = 0;
    this.Sign_Test = 0;
    this.CodeErrTest = 0;
    this.hour_runnig = 0;
    this.time_lastCloggedFilers = 0;
    this.AccessoyHW1 = 0;
    this.AccessoyHW2 = 0;
    this.AccessoyHW3 = 0;
    this.AccessoyHW4 = 0;
    this.Enab_Fuction1 = 0;
    this.Enab_Fuction2 = 0;
    this.msk_Enab_Fuction1 = 0;
    this.msk_Enab_Fuction2 = 0;
    this.Dsc_Sdcard_Update_Delay = 0;
    this.Pir_Update_Delay = 0;
    this.Time_Fire_Test_Counter = 0;
    this.size1_free = 0;
    this.cntUpdate_info = 0;
    this.numMotors = 0;
    this.numPulseMotors = 0;
    this.typeMotors = 0;
    this.chWireless = 0;
    this.depotMotors = 0;
    this.numNTC = 0;
    this.Posiz_NTC = 0;
    this.RotazioneBypass = 0;
    this.size2_free = 0;
    this.Set_Power_ON = 0;
    this.Config_Bypass = 0;
    this.Set_Input1 = 0;
    this.Set_Input2 = 0;
    this.Set_Output1 = 0;
    this.Set_Output2 = 0;
    this.sel_idxStepMotors = 0;
    this.Set_StepMotorsFSC_CAF1 = 0;
    this.Set_StepMotorsFSC_CAF2 = 0;
    this.Set_StepMotorsFSC_CAF3 = 0;
    this.Set_StepMotorsFSC_CAF4 = 0;
    this.Set_StepMotors_CAP1 = 0;
    this.Set_StepMotors_CAP2 = 0;
    this.Set_StepMotors_CAP3 = 0;
    this.Set_StepMotors_CAP4 = 0;
    this.Set_Imbalance1 = 0;
    this.Set_Imbalance2 = 0;
    this.Set_TimeBoost = 0;
    this.SetPoint_CO2 = 0;
    this.SetPoint_RH = 0;
    this.SetPoint_VOC = 0;
    this.gg_manut_Filter = 0;
    this.servicePassword = 0;
    this.KHK_Config = 0;
    this.KHK_SetPoint = 0;
    this.endUserPassword = 0;
    this.calibra_CAP = 0;
    this.manual_Reset = 0;
    this.DPP_CalibrationValue = 0;
    this.Set_MBF_fresh = 0;
    this.Set_MBF_return = 0;
    this.SetPoint_Airflow_CO2 = 0;
    this.Time_Fire_Test = 0;
    this.Fire_Config = 0;
    this.cntUpdate_SettingPar = 0;
    this.Calibr1 = 0;
    this.Calibr2 = 0;
    this.Calibr3 = 0;
    this.Calibr4 = 0;
    this.Calibr5 = 0;
    this.Calibr6 = 0;
    this.Bypass_minTempExt = 0;
    this.SetPointTemp1 = 0;
    this.SetPointTemp2 = 0;
    this.idxSetPointT = 0;
    this.hister_AWP_Temp_Hot1 = 0;
    this.hister_AWP_Temp_Hot2 = 0;
    this.hister_AWP_Temp_Cold1 = 0;
    this.hister_AWP_Temp_Cold2 = 0;
    this.hister_Temp_Hot1 = 0;
    this.hister_Temp_Hot2 = 0;
    this.hister_Temp_Cold1 = 0;
    this.hister_Temp_Cold2 = 0;
    this.RefTSetting = 0;
    this.DeltaTemp_Supply = 0;
    this.Set_EHD_mod = 0;
    this.Set_BPD_mod = 0;
    this.cntUpdate_SetTemp = 0;
    this.sDayProg = new SDAYPROG();
    this.cntUpdate_dayProg = 0;
    this.none = 0;
    this.version_eeprom = 0;
    this.previousState = this.serialize();
    this.ValueChange = 0;
    this.Function1 = 0;
    this.Function2 = 0;
  }

  serialize() {
    const { previousState, ...currentState } = this;
    return JSON.stringify(currentState);
  }

  hasValueChanged() {
    return this.ValueChange === 1;
  }

  updatePreviousState() {
    this.previousState = this.serialize();
  }

  hasAllValuesEqualToZero() {
    for (const key in this) {
      if (typeof this[key] !== 'function' && this[key] !== 0) {
        return false;
      }
    }
    return true;
  }

  isBoostEnabled() {
    return (this.Enab_Fuction1 & 2) !== 0;
  }

  toggleBoost() {
    this.Enab_Fuction1 ^= 2;
  }

  isImbalanceEnabled() {
    return (this.Enab_Fuction1 & 16) !== 0;
  }

  toggleImbalance() {
    this.Enab_Fuction1 ^= 16;
  }

  setValueByKey(key, value) {
    if (typeof this[key] !== 'undefined') {
      this[key] = value;
      this.ValueChange = 1;
    } else {
      console.error(`La chiave "${key}" non esiste nella classe EEPROM_DATA_TAG.`);
    }
  }

  getValueByKey(key) {
    if (typeof this[key] !== 'undefined') {
      return this[key];
    } else {
      console.error(`La chiave "${key}" non esiste nella classe EEPROM_DATA_TAG.`);
      return undefined;
    }
  }

  updateFromJSON(json) {
    for (const key in json) {
      if (json.hasOwnProperty(key) && this.hasOwnProperty(key)) {
        this[key] = json[key];
      }
    }
  }
}

class DEBUG_DATA_TAG {
  constructor() {
    this.LinkCap = 0;
    this.MeasPressure = 0;
    this.LinkCTRLFan = 0;
    this.StatusMotorR = 0;
    this.StatusMotorF = 0;
    this.VoutMotorR = 0;
    this.VoutMotorF = 0;
    this.SpeedMotorR1 = 0;
    this.SpeedMotorR2 = 0;
    this.SpeedMotorR3 = 0;
    this.SpeedMotorF1 = 0;
    this.SpeedMotorF2 = 0;
    this.SpeedMotorF3 = 0;
    this.LinkPreheater = 0;
    this.LinkHeater = 0;
    this.LinkCooler = 0;
    this.StatusPreheater = 0;
    this.StatusHeater = 0;
    this.StatusCooler = 0;
    this.MeasTempWaterHeater = 0;
    this.MeasTempAirHeater = 0;
    this.MeasTempWaterCooler = 0;
    this.MeasAirflow = 0;
    this.AbsorBypassMin = 0;
    this.AbsorBypassMax = 0;
    this.LinkSens = 0;
    this.LinkMbus = 0;
    this.MeasTempWaterPerheater = 0;
    this.MeasTempAirPerheater = 0;
    this.MeasTempAirCooler = 0;
    this.StatusDSC = 0;
  }

  updateFromJSON(json) {
    for (const key in json) {
      if (json.hasOwnProperty(key) && this.hasOwnProperty(key)) {
        this[key] = json[key];
      }
    }
  }
}

class POLLING_DATA_TAG {
  constructor() {
    this.MeasTemp1F = 0;
    this.MeasTemp2R = 0;
    this.MeasTemp3S = 0;
    this.MeasTemp4E = 0;
    this.MeasInput1 = 0;
    this.MeasInput2 = 0;
    this.InfoProbeIAQ = 0;
    this.RHLevel = 0;
    this.CO2Level = 0;
    this.VOCLevel = 0;
    this.StatusUnit = 0;
    this.StatusWeekly = 0;
    this.Alarm00 = 0;
    this.Alarm01 = 0;
    this.Alarm02 = 0;
    this.Alarm03 = 0;
    this.Alarm04 = 0;
    this.Alarm05 = 0;
    this.Alarm06 = 0;
    this.Alarm07 = 0;
    this.Alarm08 = 0;
    this.Alarm09 = 0;
    this.Alarm10 = 0;
    this.Alarm11 = 0;
    this.Alarm12 = 0;
    this.none = 0;
    this.IncreaseSpeedIAQ = 0;
    this.cntUpdate_eeprom_info = 0;
    this.cntUpdate_eeprom_settingpar = 0;
    this.cntUpdate_eeprom_settemp = 0;
    this.cntUpdate_eeprom_weekly = 0;
    this.MeasAWP = 0;
    this.StatusUnit_check1 = 0;
    this.StatusUnit_check2 = 0;
  }

  updateFromJSON(json) {
    for (const key in json) {
      if (json.hasOwnProperty(key) && this.hasOwnProperty(key)) {
        this[key] = json[key];
      }
    }
  }

  analyzeAlarms() {
    const alarmCodes = [];

    for (let i = 0; i <= 12; i++) {
      const alarmValue = this[`Alarm${String(i).padStart(2, '0')}`];
      const bits = alarmValue.toString(2).padStart(8, '0').split('').reverse();

      bits.forEach((bit, index) => {
        if (bit === '1') {
          alarmCodes.push(`${String(i).padStart(2, '0')}-${index + 1}`);
        }
      });
    }

    return alarmCodes;
  }

  getAlarmString() {
    const alarmCodes = this.analyzeAlarms();
    return alarmCodes.join(' ');
  }

 
  getStatusUnit() {
    const STATUS1 = [
      { name: 'RUNNING', on: 'Unit ON', off: 'Standby' },
      { name: 'DEFROST', on: 'Defrost', off: '' },
      { name: 'POST_VENT', on: 'Post_Vent', off: '' },
      { name: 'IMBALANCE', on: 'Imbalance', off: '' },
      { name: 'BOOST', on: 'Boost', off: '' },
      { name: 'BOOST_KHK', on: 'Boost_Khk', off: '' },
      { name: 'BYPASS_MOV', on: 'Bypass moving', off: '' },
      { name: 'BYPASS_STATUS', on: 'bypass close', off: 'bypass open' },
      { name: 'INPUT_FAN_REG', on: 'Input_Fan_Reg', off: '' },
      { name: 'MAX_RH', on: 'Over RH', off: '' },
      { name: 'MAX_CO2', on: 'Over CO2', off: '' },
      { name: 'MAX_VOC', on: 'Over VOC', off: '' },
      { name: 'TEST', on: 'Testing', off: '' },
      { name: 'DPP_CHECK', on: 'DPP checking', off: '' },
      { name: 'UPDATE_AVAILABLE', on: 'Update_Available', off: 'No update available' },
      { name: '---', on: '---', off: '' }
    ];
  
    const statusValue = this.StatusUnit;
  
    // Convert the statusValue to a 16-bit binary string
    const binaryString = statusValue.toString(2).padStart(16, '0');
  
    const activeStatuses = [];
  
    // Iterate over the binary string from right to left
    for (let i = 0; i < binaryString.length; i++) {
      const status = STATUS1[i];
      if (binaryString[binaryString.length - 1 - i] === '1') {
        activeStatuses.push(status.on);
      } else if (status.off) {
        activeStatuses.push(status.off);
      }
    }
  
    console.log(activeStatuses);
    return activeStatuses;
  }

}

class WIFI_TAG {
  constructor() {
    this.WifiSSID = 0;
    this.WifiPSWD = 0;
    this.WifiValueChanged = false;
  }
}

export const eepromData = new EEPROM_DATA_TAG();
export const debugData = new DEBUG_DATA_TAG();
export const pollingData = new POLLING_DATA_TAG();
export const WifiData = new WIFI_TAG();
