class SDAYPROG {
  constructor() {
    this.numRange = 0; // 1 byte: numbers of ranges (from 0 = disable to 4)
    this.timeON = [0, 0, 0, 0]; // 4 byte: timeON, Values from 0 to 48 (step di 30')
    this.timeOFF = [0, 0, 0, 0]; // 4 byte: timeOFF, Values from 0 to 48 (step di 30')
    this.ConfigSpeed = 0; // 1 byte: bit[7,6]:Step Speed range 4 | bit[5,4]:Step Speed range 3 | bit[3,2]:Step Speed range 2 | bit[1,0]:Step Speed range 1.
    this.ConfigImbal = 0; // 1 byte: bit[7,6]:Set Imbal. range 4 | bit[5,4]:Set Imbal. range 3 | bit[3,2]:Set Imbal. range 2 | bit[1,0]:Set Imbal. range 1.
    this.ConfigTemp = 0; // 1 byte: bit[7,6]:Rif. Temp. range 4 | bit[5,4]:Rif. Temp. range 3 | bit[3,2]:Rif. Temp. range 2 | bit[1,0]:Rif. Temp.range 1.
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
    this.sDayProg = 0;
    this.cntUpdate_dayProg = 0;
    this.none = 0;
    this.version_eeprom = 0;

    this.previousState = this.serialize();
    this.ValueChange = 0;
  }

  serialize() {
    // Serializza l'oggetto corrente in una stringa JSON
    const {previousState, ...currentState} = this;
    return JSON.stringify(currentState);
  }

  hasValueChanged() {
    // // Serializza l'oggetto corrente, escludendo la proprietà 'previousState'
    // const {previousState, ...currentState} = this;
    // const currentSerialized = JSON.stringify(currentState);

    // // Confronta lo stato corrente con lo stato precedente
        // return currentSerialized !== this.previousState;
    if(this.ValueChange === 1)
      {
        return true;
      }
      else 
        return false;

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
  }
}

export const eepromData = new EEPROM_DATA_TAG();
export const debugData = new DEBUG_DATA_TAG();
export const pollingData = new POLLING_DATA_TAG();
