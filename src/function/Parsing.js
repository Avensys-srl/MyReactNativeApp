import {eepromData, debugData, pollingData} from './Data.js';

const HW1 = ['PIR', 'BPD', 'AWP', 'CWD', 'EHD', 'HWD', 'PHWD', 'PEHD'];
const HW2 = ['DPS', 'PCAF', 'PCAP', 'INPUT', 'OUT', 'DDPV2', 'RFM', 'MBUS'];
const HW3 = ['P2CO2', 'P1CO2', 'EBPD', 'P2RH', 'P1RH', 'SSR', 'P1VOC', 'EBP2'];
const HW4 = ['---', '---', '---', '---', 'EXT4', 'EXT3', 'EXT2', 'EXT1'];

const EN_FUNC1 = [
  'CAF',
  'CAP',
  'CSF',
  'ImbalanON',
  'STPL',
  'WeeklyON',
  'BoostON',
  'DeFrostON',
];

const EN_FUNC2 = [
  '---',
  '---',
  '---',
  '---',
  '---',
  'CLIMA',
  'CtrlFilter',
  'PASSWORD',
];

function getBitsFromArray(bitString, stringsArray) {
  if (bitString.length !== 8 || stringsArray.length !== 8) {
    throw new Error(
      "La stringa di bit e l'array di stringhe devono avere esattamente 8 elementi.",
    );
  }

  const resultArray = [];
  for (let i = 0; i < 8; i++) {
    if (bitString[i] === '1') {
      resultArray.push(stringsArray[i]);
    }
  }

  return resultArray;
}

function convertUint8ToSignedInt(uint8Value) {
  if (uint8Value > 127) {
    // Sottrai 256 per convertire da Uint8 a Int8
    return uint8Value - 256;
  } else {
    // Il valore è già positivo
    return uint8Value;
  }
}

export function parseUint8ArrayToEEPROM(uint8Array) {
  if (uint8Array.length < 240) {
    throw new Error('Data array is not valid');
  }

  if (
    eepromData.cntUpdate_info == uint8Array[58] &&
    eepromData.cntUpdate_SettingPar == uint8Array[126] &&
    eepromData.cntUpdate_SetTemp == uint8Array[152] &&
    eepromData.cntUpdate_dayProg == uint8Array[237]
  ) {
    console.debug('Eeprom Aggiornata');
  } else {
    // Effettua il parsing dei dati dall'array.
    eepromData.AddrUnit = uint8Array[0];
    eepromData.Type_func = uint8Array[1] > 0 ? 'EXTRA' : 'BASIC';
    eepromData.HW_Vers = String.fromCharCode(
      uint8Array[2],
      uint8Array[3],
      uint8Array[4],
      uint8Array[5],
    );
    eepromData.SW_Vers = String.fromCharCode(
      uint8Array[6],
      uint8Array[7],
      uint8Array[8],
      uint8Array[9],
      uint8Array[10],
    );
    eepromData.SerialString = String.fromCharCode(
      uint8Array[11],
      uint8Array[12],
      uint8Array[13],
      uint8Array[14],
      uint8Array[15],
      uint8Array[16],
      uint8Array[17],
      uint8Array[18],
      uint8Array[19],
      uint8Array[20],
      uint8Array[21],
      uint8Array[22],
      uint8Array[23],
      uint8Array[24],
      uint8Array[25],
      uint8Array[26],
      uint8Array[27],
      uint8Array[28],
    );
    eepromData.swVer_ModBus = uint8Array[29] + '.' + uint8Array[30];
    eepromData.Sign_Test =
      String.fromCharCode(uint8Array[31]) + String.fromCharCode(uint8Array[32]);
    eepromData.CodeErrTest = uint8Array[33];
    eepromData.hour_runnig =
      (uint8Array[37] << 24) |
      (uint8Array[36] << 16) |
      (uint8Array[35] << 8) |
      uint8Array[34];
    eepromData.time_lastCloggedFilers =
      (uint8Array[41] << 24) |
      (uint8Array[40] << 16) |
      (uint8Array[39] << 8) |
      uint8Array[38];
    eepromData.AccessoyHW1 = getBitsFromArray(
      uint8Array[42].toString(2).padStart(8, '0'),
      HW1,
    );
    eepromData.AccessoyHW2 = getBitsFromArray(
      uint8Array[43].toString(2).padStart(8, '0'),
      HW2,
    );
    eepromData.AccessoyHW3 = getBitsFromArray(
      uint8Array[44].toString(2).padStart(8, '0'),
      HW3,
    );
    eepromData.AccessoyHW4 = getBitsFromArray(
      uint8Array[45].toString(2).padStart(8, '0'),
      HW4,
    );
    eepromData.Enab_Fuction1 = uint8Array[46];
    eepromData.Enab_Fuction2 = uint8Array[47];
    eepromData.msk_Enab_Fuction1 = uint8Array[48];
    eepromData.msk_Enab_Fuction2 = uint8Array[49];
    eepromData.Dsc_Sdcard_Update_Delay = uint8Array[50];
    eepromData.Pir_Update_Delay = uint8Array[51];
    eepromData.size1_free = 6;
    eepromData.cntUpdate_info = uint8Array[58];
    eepromData.numMotors = uint8Array[59];
    eepromData.numPulseMotors = uint8Array[60];
    eepromData.typeMotors = String.fromCharCode(uint8Array[61]);
    eepromData.chWireless = uint8Array[62];
    eepromData.depotMotors = uint8Array[63];
    eepromData.numNTC = uint8Array[64];
    eepromData.Posiz_NTC = uint8Array[65];
    eepromData.RotazioneBypass =
      uint8Array[66] > 0 ? 'Counter-Clockwise' : 'Clockwise';
    eepromData.size2_free = 9;
    eepromData.Set_Power_ON = uint8Array[76];
    eepromData.Config_Bypass = uint8Array[77];
    eepromData.Set_Input1 = uint8Array[78];
    eepromData.Set_Input2 = uint8Array[79];
    eepromData.Set_Output1 = uint8Array[80];
    eepromData.Set_Output2 = uint8Array[81];
    eepromData.sel_idxStepMotors = uint8Array[82];
    eepromData.Set_StepMotorsFSC_CAF1 = (uint8Array[84] << 8) | uint8Array[83];
    eepromData.Set_StepMotorsFSC_CAF2 = (uint8Array[86] << 8) | uint8Array[85];
    eepromData.Set_StepMotorsFSC_CAF3 = (uint8Array[88] << 8) | uint8Array[87];
    eepromData.Set_StepMotorsFSC_CAF4 = (uint8Array[90] << 8) | uint8Array[89];
    eepromData.Set_StepMotors_CAP1 = (uint8Array[92] << 8) | uint8Array[91];
    eepromData.Set_StepMotors_CAP2 = (uint8Array[94] << 8) | uint8Array[93];
    eepromData.Set_StepMotors_CAP3 = (uint8Array[96] << 8) | uint8Array[95];
    eepromData.Set_StepMotors_CAP4 = (uint8Array[98] << 8) | uint8Array[97];
    eepromData.Set_Imbalance1 = convertUint8ToSignedInt(uint8Array[99]);
    eepromData.Set_Imbalance2 = convertUint8ToSignedInt(uint8Array[100]);
    eepromData.Set_TimeBoost = uint8Array[101];
    eepromData.SetPoint_CO2 = (uint8Array[103] << 8) | uint8Array[102];
    eepromData.SetPoint_RH = uint8Array[104];
    eepromData.SetPoint_VOC = (uint8Array[106] << 8) | uint8Array[105];
    eepromData.gg_manut_Filter = (uint8Array[108] << 8) | uint8Array[107];
    eepromData.servicePassword = String.fromCharCode(
      uint8Array[109],
      uint8Array[110],
      uint8Array[111],
      uint8Array[112],
      uint8Array[113],
    );
    eepromData.endUserPassword = String.fromCharCode(
      uint8Array[114],
      uint8Array[115],
      uint8Array[116],
      uint8Array[117],
      uint8Array[118],
    );
    eepromData.calibra_CAP = (uint8Array[120] << 8) | uint8Array[119];
    eepromData.manual_Reset = uint8Array[121];
    eepromData.DPP_CalibrationValue = uint8Array[122];
    eepromData.Set_MBF_fresh = uint8Array[123];
    eepromData.Set_MBF_return = uint8Array[124];
    eepromData.SetPoint_Airflow_CO2 = uint8Array[125];
    eepromData.cntUpdate_SettingPar = uint8Array[126];
    eepromData.Calibr = 6;
    eepromData.Bypass_minTempExt = (uint8Array[134] << 8) | uint8Array[133];
    eepromData.SetPointTemp1 = (uint8Array[136] << 8) | uint8Array[135];
    eepromData.SetPointTemp2 = (uint8Array[138] << 8) | uint8Array[137];
    eepromData.idxSetPointT = uint8Array[139];
    eepromData.hister_AWP_Temp_Hot1 = convertUint8ToSignedInt(uint8Array[140]);
    eepromData.hister_AWP_Temp_Hot2 = convertUint8ToSignedInt(uint8Array[141]);
    eepromData.hister_AWP_Temp_Cold1 = convertUint8ToSignedInt(uint8Array[142]);
    eepromData.hister_AWP_Temp_Cold2 = convertUint8ToSignedInt(uint8Array[143]);
    eepromData.hister_Temp_Hot1 = convertUint8ToSignedInt(uint8Array[144]);
    eepromData.hister_Temp_Hot2 = convertUint8ToSignedInt(uint8Array[145]);
    eepromData.hister_Temp_Cold1 = convertUint8ToSignedInt(uint8Array[146]);
    eepromData.hister_Temp_Cold2 = convertUint8ToSignedInt(uint8Array[147]);
    eepromData.RefTSetting = uint8Array[148];
    eepromData.DeltaTemp_Supply = uint8Array[149];
    eepromData.Set_EHD_mod = uint8Array[150];
    eepromData.Set_BPD_mod = uint8Array[151];
    eepromData.cntUpdate_SetTemp = uint8Array[152];
    eepromData.sDayProg = 84;
    eepromData.cntUpdate_dayProg = uint8Array[237];
    eepromData.none = uint8Array[238];
    eepromData.version_eeprom = String.fromCharCode(uint8Array[239]);
  }
}

export function parseUint8ArrayToDebug(uint8Array) {
  if (uint8Array.length < 48) {
    throw new Error('Data array is not valid');
  }

  debugData.LinkCap = uint8Array[0];
  debugData.MeasPressure = (uint8Array[2] << 8) | uint8Array[1];
  debugData.LinkCTRLFan = uint8Array[3];
  debugData.StatusMotorR = uint8Array[4];
  debugData.StatusMotorF = uint8Array[5];
  debugData.VoutMotorR = (uint8Array[7] << 8) | uint8Array[6];
  debugData.VoutMotorF = (uint8Array[9] << 8) | uint8Array[8];
  debugData.SpeedMotorR1 = (uint8Array[11] << 8) | uint8Array[10];
  debugData.SpeedMotorR2 = (uint8Array[13] << 8) | uint8Array[12];
  debugData.SpeedMotorR3 = (uint8Array[15] << 8) | uint8Array[14];
  debugData.SpeedMotorF1 = (uint8Array[17] << 8) | uint8Array[16];
  debugData.SpeedMotorF2 = (uint8Array[19] << 8) | uint8Array[18];
  debugData.SpeedMotorF3 = (uint8Array[21] << 8) | uint8Array[20];
  debugData.LinkPreheater = uint8Array[22];
  debugData.LinkHeater = uint8Array[23];
  debugData.LinkCooler = uint8Array[24];
  debugData.StatusPreheater = uint8Array[25];
  debugData.StatusHeater = uint8Array[26];
  debugData.StatusCooler = uint8Array[27];
  debugData.MeasTempWaterHeater = (uint8Array[29] << 8) | uint8Array[28];
  debugData.MeasTempAirHeater = (uint8Array[31] << 8) | uint8Array[30];
  debugData.MeasTempWaterCooler = (uint8Array[33] << 8) | uint8Array[32];
  debugData.MeasAirflow = (uint8Array[35] << 8) | uint8Array[34];
  debugData.AbsorBypassMin = uint8Array[36];
  debugData.AbsorBypassMax = (uint8Array[38] << 8) | uint8Array[37];
  debugData.LinkSens = uint8Array[39];
  debugData.LinkMbus = uint8Array[40];
  debugData.MeasTempWaterPerheater = (uint8Array[42] << 8) | uint8Array[41];
  debugData.MeasTempAirPerheater = (uint8Array[44] << 8) | uint8Array[43];
  debugData.MeasTempAirCooler = (uint8Array[46] << 8) | uint8Array[45];
  debugData.StatusDSC = uint8Array[47];
}

export function parseUint8ArrayToPolling(uint8Array) {
  if (uint8Array.length < 40) {
    throw new Error('Data array is not valid');
  }

  pollingData.MeasTemp1F = (uint8Array[1] << 8) | uint8Array[0];
  pollingData.MeasTemp2R = (uint8Array[3] << 8) | uint8Array[2];
  pollingData.MeasTemp3S = (uint8Array[5] << 8) | uint8Array[4];
  pollingData.MeasTemp4E = (uint8Array[7] << 8) | uint8Array[6];
  pollingData.MeasInput1 = uint8Array[8];
  pollingData.MeasInput2 = uint8Array[9];
  pollingData.InfoProbeIAQ = uint8Array[10];
  pollingData.RHLevel = uint8Array[11];
  pollingData.CO2Level = (uint8Array[13] << 8) | uint8Array[12];
  pollingData.VOCLevel = (uint8Array[15] << 8) | uint8Array[14];
  pollingData.StatusUnit = (uint8Array[17] << 8) | uint8Array[16];
  pollingData.StatusWeekly = uint8Array[18];
  pollingData.Alarm00 = uint8Array[19];
  pollingData.Alarm01 = uint8Array[20];
  pollingData.Alarm02 = uint8Array[21];
  pollingData.Alarm03 = uint8Array[22];
  pollingData.Alarm04 = uint8Array[23];
  pollingData.Alarm05 = uint8Array[24];
  pollingData.Alarm06 = uint8Array[25];
  pollingData.Alarm07 = uint8Array[26];
  pollingData.Alarm08 = uint8Array[27];
  pollingData.Alarm09 = uint8Array[28];
  pollingData.Alarm10 = uint8Array[29];
  pollingData.Alarm11 = uint8Array[30];
  pollingData.Alarm12 = uint8Array[31];
  pollingData.none = uint8Array[32];
  pollingData.IncreaseSpeedIAQ = uint8Array[33];
  pollingData.cntUpdate_eeprom_info = uint8Array[34];
  pollingData.cntUpdate_eeprom_settingpar = uint8Array[35];
  pollingData.cntUpdate_eeprom_settemp = uint8Array[36];
  pollingData.cntUpdate_eeprom_weekly = uint8Array[37];
  pollingData.MeasAWP = (uint8Array[39] << 8) | uint8Array[38];
}
