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

export function convertUint8ArrayToByteArray(uint8Array) {
  const byteArray = Array.from(uint8Array);
  return byteArray;
}

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

function convertSignedIntToUint8(signedInt) {
  // Se il valore è negativo, aggiungi 256 per convertirlo in un Uint8
  if (signedInt < 0) {
    return 256 + signedInt;
  } else {
    return signedInt;
  }
}

function getReversedUint8Value(HW1, HWget) {
  let uint8Value = 0;

  for (let i = HW1.length - 1; i >= 0; i--) {
    if (HWget.includes(HW1[i])) {
      uint8Value |= 1 << (7 - i);
    }
  }

  return uint8Value;
}

export function parseUint8ArrayToEEPROM(uint8Array) {
  if (uint8Array.length < 240) {
    throw new Error('Data array is not valid');
  }

  if (
    uint8Array[58] + uint8Array[126] + uint8Array[152] + uint8Array[237] > 0 &&
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
    eepromData.Calibr1 = uint8Array[127];
    eepromData.Calibr2 = uint8Array[128];
    eepromData.Calibr3 = uint8Array[129];
    eepromData.Calibr4 = uint8Array[130];
    eepromData.Calibr5 = uint8Array[131];
    eepromData.Calibr6 = uint8Array[132];
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

export function convertEEPROMToUint8Array(eepromData) {
  const uint8Array = new Uint8Array(240);

  // Inserisci i dati nell'array
  uint8Array[0] = eepromData.AddrUnit;
  uint8Array[1] = eepromData.Type_func === 'EXTRA' ? 1 : 0;

  uint8Array[2] = eepromData.HW_Vers.charCodeAt(0);
  uint8Array[3] = eepromData.HW_Vers.charCodeAt(1);
  uint8Array[4] = eepromData.HW_Vers.charCodeAt(2);
  uint8Array[5] = eepromData.HW_Vers.charCodeAt(3);

  uint8Array[6] = eepromData.SW_Vers.charCodeAt(0);
  uint8Array[7] = eepromData.SW_Vers.charCodeAt(1);
  uint8Array[8] = eepromData.SW_Vers.charCodeAt(2);
  uint8Array[9] = eepromData.SW_Vers.charCodeAt(3);
  uint8Array[10] = eepromData.SW_Vers.charCodeAt(4);

  uint8Array[11] = eepromData.SerialString.charCodeAt(0);
  uint8Array[12] = eepromData.SerialString.charCodeAt(1);
  uint8Array[13] = eepromData.SerialString.charCodeAt(2);
  uint8Array[14] = eepromData.SerialString.charCodeAt(3);
  uint8Array[15] = eepromData.SerialString.charCodeAt(4);
  uint8Array[16] = eepromData.SerialString.charCodeAt(5);
  uint8Array[17] = eepromData.SerialString.charCodeAt(6);
  uint8Array[18] = eepromData.SerialString.charCodeAt(7);
  uint8Array[19] = eepromData.SerialString.charCodeAt(8);
  uint8Array[20] = eepromData.SerialString.charCodeAt(9);
  uint8Array[21] = eepromData.SerialString.charCodeAt(10);
  uint8Array[22] = eepromData.SerialString.charCodeAt(11);
  uint8Array[23] = eepromData.SerialString.charCodeAt(12);
  uint8Array[24] = eepromData.SerialString.charCodeAt(13);
  uint8Array[25] = eepromData.SerialString.charCodeAt(14);
  uint8Array[26] = eepromData.SerialString.charCodeAt(15);
  uint8Array[27] = eepromData.SerialString.charCodeAt(16);
  uint8Array[28] = eepromData.SerialString.charCodeAt(17);

  const swVerModBusArray = eepromData.swVer_ModBus.split('.');
  uint8Array[29] = parseInt(swVerModBusArray[0], 10);
  uint8Array[30] = parseInt(swVerModBusArray[1], 10);

  uint8Array[31] = eepromData.Sign_Test.charCodeAt(0);
  uint8Array[32] = eepromData.Sign_Test.charCodeAt(1);
  uint8Array[33] = eepromData.CodeErrTest;

  uint8Array[34] = eepromData.hour_runnig & 0xff;
  uint8Array[35] = (eepromData.hour_runnig >> 8) & 0xff;
  uint8Array[36] = (eepromData.hour_runnig >> 16) & 0xff;
  uint8Array[37] = (eepromData.hour_runnig >> 24) & 0xff;

  uint8Array[38] = eepromData.time_lastCloggedFilers & 0xff;
  uint8Array[39] = (eepromData.time_lastCloggedFilers >> 8) & 0xff;
  uint8Array[40] = (eepromData.time_lastCloggedFilers >> 16) & 0xff;
  uint8Array[41] = (eepromData.time_lastCloggedFilers >> 24) & 0xff;

  uint8Array[42] = getReversedUint8Value(HW1, eepromData.AccessoyHW1);
  uint8Array[43] = getReversedUint8Value(HW2, eepromData.AccessoyHW2);
  uint8Array[44] = getReversedUint8Value(HW3, eepromData.AccessoyHW3);
  uint8Array[45] = getReversedUint8Value(HW4, eepromData.AccessoyHW4);

  uint8Array[46] = eepromData.Enab_Fuction1;
  uint8Array[47] = eepromData.Enab_Fuction2;
  uint8Array[48] = eepromData.msk_Enab_Fuction1;
  uint8Array[49] = eepromData.msk_Enab_Fuction2;
  uint8Array[50] = eepromData.Dsc_Sdcard_Update_Delay;
  uint8Array[51] = eepromData.Pir_Update_Delay;

  uint8Array[52] = 255;
  uint8Array[53] = 255;
  uint8Array[54] = 255;
  uint8Array[55] = 255;
  uint8Array[56] = 255;
  uint8Array[57] = 255;

  uint8Array[58] = eepromData.cntUpdate_info;
  uint8Array[59] = eepromData.numMotors;
  uint8Array[60] = eepromData.numPulseMotors;
  uint8Array[61] = eepromData.typeMotors.charCodeAt(0);
  uint8Array[62] = eepromData.chWireless;
  uint8Array[63] = eepromData.depotMotors;
  uint8Array[64] = eepromData.numNTC;
  uint8Array[65] = eepromData.Posiz_NTC;
  uint8Array[66] = eepromData.RotazioneBypass === 'Counter-Clockwise' ? 255 : 0;

  uint8Array[67] = 255;
  uint8Array[68] = 255;
  uint8Array[69] = 255;
  uint8Array[70] = 255;
  uint8Array[71] = 255;
  uint8Array[72] = 255;
  uint8Array[73] = 255;
  uint8Array[74] = 255;
  uint8Array[75] = 255;

  uint8Array[76] = eepromData.Set_Power_ON;
  uint8Array[77] = eepromData.Config_Bypass;
  uint8Array[78] = eepromData.Set_Input1;
  uint8Array[79] = eepromData.Set_Input2;
  uint8Array[80] = eepromData.Set_Output1;
  uint8Array[81] = eepromData.Set_Output2;
  uint8Array[82] = eepromData.sel_idxStepMotors;

  uint8Array[83] = eepromData.Set_StepMotorsFSC_CAF1 & 0xff;
  uint8Array[84] = eepromData.Set_StepMotorsFSC_CAF1 >> 8;
  uint8Array[85] = eepromData.Set_StepMotorsFSC_CAF2 & 0xff;
  uint8Array[86] = eepromData.Set_StepMotorsFSC_CAF2 >> 8;
  uint8Array[87] = eepromData.Set_StepMotorsFSC_CAF3 & 0xff;
  uint8Array[88] = eepromData.Set_StepMotorsFSC_CAF3 >> 8;
  uint8Array[89] = eepromData.Set_StepMotorsFSC_CAF4 & 0xff;
  uint8Array[90] = eepromData.Set_StepMotorsFSC_CAF4 >> 8;

  uint8Array[91] = eepromData.Set_StepMotors_CAP1 & 0xff;
  uint8Array[92] = eepromData.Set_StepMotors_CAP1 >> 8;
  uint8Array[93] = eepromData.Set_StepMotors_CAP2 & 0xff;
  uint8Array[94] = eepromData.Set_StepMotors_CAP2 >> 8;
  uint8Array[95] = eepromData.Set_StepMotors_CAP3 & 0xff;
  uint8Array[96] = eepromData.Set_StepMotors_CAP3 >> 8;
  uint8Array[97] = eepromData.Set_StepMotors_CAP4 & 0xff;
  uint8Array[98] = eepromData.Set_StepMotors_CAP4 >> 8;
  uint8Array[99] = convertUint8ToSignedInt(eepromData.Set_Imbalance1);
  uint8Array[100] = convertUint8ToSignedInt(eepromData.Set_Imbalance2);

  uint8Array[101] = eepromData.Set_TimeBoost;
  // Inverso di eepromData.SetPoint_CO2
  uint8Array[102] = eepromData.SetPoint_CO2 & 0xff;
  uint8Array[103] = eepromData.SetPoint_CO2 >> 8;

  // Inverso di eepromData.SetPoint_RH
  uint8Array[104] = eepromData.SetPoint_RH;

  // Inverso di eepromData.SetPoint_VOC
  uint8Array[105] = eepromData.SetPoint_VOC & 0xff;
  uint8Array[106] = eepromData.SetPoint_VOC >> 8;

  // Inverso di eepromData.gg_manut_Filter
  uint8Array[107] = eepromData.gg_manut_Filter & 0xff;
  uint8Array[108] = eepromData.gg_manut_Filter >> 8;

  // Inverso di eepromData.servicePassword
  for (let i = 0; i < 5; i++) {
    uint8Array[109 + i] = eepromData.servicePassword.charCodeAt(i);
  }

  // Inverso di eepromData.endUserPassword
  for (let i = 0; i < 5; i++) {
    uint8Array[114 + i] = eepromData.endUserPassword.charCodeAt(i);
  }

  uint8Array[119] = eepromData.calibra_CAP & 0xff;
  uint8Array[120] = eepromData.calibra_CAP >> 8;
  uint8Array[121] = eepromData.manual_Reset;
  uint8Array[122] = eepromData.DPP_CalibrationValue;
  uint8Array[123] = eepromData.Set_MBF_fresh;
  uint8Array[124] = eepromData.Set_MBF_return;
  uint8Array[125] = eepromData.SetPoint_Airflow_CO2;
  uint8Array[126] = eepromData.cntUpdate_SettingPar;

  uint8Array[127] = eepromData.Calibr1;
  uint8Array[128] = eepromData.Calibr2;
  uint8Array[129] = eepromData.Calibr3;
  uint8Array[130] = eepromData.Calibr4;
  uint8Array[131] = eepromData.Calibr5;
  uint8Array[132] = eepromData.Calibr6;

  uint8Array[133] = eepromData.Bypass_minTempExt & 0xff;
  uint8Array[134] = eepromData.Bypass_minTempExt >> 8;
  uint8Array[135] = eepromData.SetPointTemp1 & 0xff;
  uint8Array[136] = eepromData.SetPointTemp1 >> 8;
  uint8Array[137] = eepromData.SetPointTemp2 & 0xff;
  uint8Array[138] = eepromData.SetPointTemp2 >> 8;
  uint8Array[139] = eepromData.idxSetPointT;
  uint8Array[140] = convertSignedIntToUint8(eepromData.hister_AWP_Temp_Hot1);
  uint8Array[141] = convertSignedIntToUint8(eepromData.hister_AWP_Temp_Hot2);
  uint8Array[142] = convertSignedIntToUint8(eepromData.hister_AWP_Temp_Cold1);
  uint8Array[143] = convertSignedIntToUint8(eepromData.hister_AWP_Temp_Cold2);
  uint8Array[144] = convertSignedIntToUint8(eepromData.hister_Temp_Hot1);
  uint8Array[145] = convertSignedIntToUint8(eepromData.hister_Temp_Hot2);
  uint8Array[146] = convertSignedIntToUint8(eepromData.hister_Temp_Cold1);
  uint8Array[147] = convertSignedIntToUint8(eepromData.hister_Temp_Cold2);
  uint8Array[148] = eepromData.RefTSetting;
  uint8Array[149] = eepromData.DeltaTemp_Supply;
  uint8Array[150] = eepromData.Set_EHD_mod;
  uint8Array[151] = eepromData.Set_BPD_mod;
  uint8Array[152] = eepromData.cntUpdate_SetTemp;

  for (let i = 0; i < 84; i++) {
    uint8Array[153 + i] = 0;
  }

  uint8Array[237] = eepromData.cntUpdate_dayProg;
  uint8Array[238] = eepromData.none;
  uint8Array[239] = eepromData.version_eeprom.charCodeAt(0);

  return uint8Array;
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
