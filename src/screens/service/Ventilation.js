import React, { useState, useEffect } from 'react';
import { StyleSheet, View, ScrollView, Text, Dimensions, TouchableOpacity } from 'react-native';
import AvenVerticalBar from '../../component/AvenVerticalBar';
import colors from '../../styles/colors';
import { useTranslation } from 'react-i18next';
import { eepromData } from '../../function/Data';

const Ventilation = () => {
  const { t } = useTranslation();
  const [verticalBarValues, setVerticalBarValues] = useState({
    1: Math.round(eepromData.Set_StepMotorsFSC_CAF1 / 10),
    2: Math.round(eepromData.Set_StepMotorsFSC_CAF2 / 10),
    3: Math.round(eepromData.Set_StepMotorsFSC_CAF3 / 10),
  });

  useEffect(() => {
    setVerticalBarValues({
      1: Math.round(eepromData.Set_StepMotorsFSC_CAF1 / 10),
      2: Math.round(eepromData.Set_StepMotorsFSC_CAF2 / 10),
      3: Math.round(eepromData.Set_StepMotorsFSC_CAF3 / 10),
    });
  }, []);

  const handleValueChange = (TS, value) => {
    setVerticalBarValues(prevValues => {
      let newValues = { ...prevValues, [TS]: value };

      // Ensure constraints
      if (TS === '1') {
        newValues[1] = Math.max(value, 25);
        newValues[2] = Math.max(newValues[2], newValues[1]);
        newValues[3] = Math.max(newValues[3], newValues[2]);
      } else if (TS === '2') {
        newValues[1] = Math.min(newValues[1], value);
        newValues[2] = value;
        newValues[3] = Math.max(newValues[3], value);
      } else if (TS === '3') {
        newValues[1] = Math.min(newValues[1], value);
        newValues[2] = Math.min(newValues[2], value);
        newValues[3] = Math.min(value, 100);
      }

      return newValues;
    });
  };

  const handleSave = () => {
    // Update eepromData
    eepromData.Set_StepMotorsFSC_CAF1 = verticalBarValues[1] * 10;
    eepromData.Set_StepMotorsFSC_CAF2 = verticalBarValues[2] * 10;
    eepromData.Set_StepMotorsFSC_CAF3 = verticalBarValues[3] * 10;
    eepromData.ValueChange = 1;
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.header}>
          <Text style={styles.title}>{t('Ventilation')}</Text>
          <View style={styles.line} />
        </View>
        <View style={styles.barsContainer}>
          <AvenVerticalBar TS="1" VS={verticalBarValues[1]} Visible={true} Probes={0} onValueChange={handleValueChange} minValue={25} />
          <AvenVerticalBar TS="2" VS={verticalBarValues[2]} Visible={true} Probes={0} onValueChange={handleValueChange} minValue={verticalBarValues[1]} />
          <AvenVerticalBar TS="3" VS={verticalBarValues[3]} Visible={true} Probes={0} onValueChange={handleValueChange} minValue={verticalBarValues[2]} maxValue={100} />
        </View>
        <TouchableOpacity style={styles.button} onPress={handleSave}>
          <Text style={styles.buttonText}>{t('save')}</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

const screenWidth = Dimensions.get('window').width;
const maxContentWidth = 1000;
const contentWidth = screenWidth * 0.9 > maxContentWidth ? maxContentWidth : screenWidth * 0.9;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
    alignItems: 'center',
  },
  scrollContainer: {
    flexGrow: 1,
    alignItems: 'center',
    padding: 16,
  },
  barsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: contentWidth,
    marginBottom: 20,
  },
  header: {
    width: '100%',
    alignItems: 'flex-start',
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    marginLeft: 16,
  },
  line: {
    height: 1,
    width: '100%',
    backgroundColor: colors.gray,
    marginTop: 4,
  },
  button: {
    backgroundColor: colors.lightblue,
    paddingVertical: 12,
    borderRadius: 4,
    alignItems: 'center',
    width: '100%',
  },
  buttonText: {
    color: colors.white,
    fontSize: 18,
  },
});

export default Ventilation;
