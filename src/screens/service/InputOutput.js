import React, { useState, useEffect, useContext } from 'react';
import { SafeAreaView, View, Text, StyleSheet, Switch, TouchableOpacity, ScrollView, Modal, Alert } from 'react-native';
import { useTranslation } from 'react-i18next';
import colors from '../../styles/colors';
import { eepromData } from '../../function/Data';
import { WifiContext } from '../../context/WiFiContext';
import CustomSlider from '../../icons/CustomSlider'; // Assuming you have a CustomSlider component

const settingsOptions = {
  inputs: ['Disable', '10V -> Unit RUN', '0V -> Unit STOP', '0-10V Air flow regulation', '10V -> Bypass Open', '0V -> Bypass Open'],
  outputs: ['Disable', 'Bypass Opened', 'Generic Alarm', 'Unit run'],
};

const InputOutputScreen = () => {
  const { t } = useTranslation();
  const { updateEEPROMData } = useContext(WifiContext);
  const [inputs, setInputs] = useState([
    { id: '1', enabled: false, setting: 'Disable' },
    { id: '2', enabled: false, setting: 'Disable' },
  ]);
  const [outputs, setOutputs] = useState([
    { id: '1', enabled: false, setting: 'Disable', type: 'NO' },
    { id: '2', enabled: false, setting: 'Disable', type: 'NO' },
  ]);
  const [modalVisible, setModalVisible] = useState(false);
  const [currentSelection, setCurrentSelection] = useState(null);
  const [currentType, setCurrentType] = useState('input');
  const [khkConfig, setKhkConfig] = useState({
    enabled: false,
    type: 'NC',
    setPoint: 0,
  });

  useEffect(() => {
    const initialInputs = inputs.map((input, index) => {
      const settingValue = eepromData[`Set_Input${index + 1}`];
      const setting = settingsOptions.inputs[settingValue];
      return {
        ...input,
        enabled: settingValue !== 0,
        setting,
      };
    });

    const initialOutputs = outputs.map((output, index) => {
      const settingValue = eepromData[`Set_Output${index + 1}`];
      const type = settingValue >= 128 ? 'NO' : 'NC';
      const setting = settingsOptions.outputs[settingValue % 128];
      return {
        ...output,
        enabled: settingValue !== 0 && settingValue !== 128,
        setting,
        type,
      };
    });

    const khkInitialConfig = {
      enabled: eepromData.KHK_Config === 3 || eepromData.KHK_Config === 5,
      type: eepromData.KHK_Config === 4 || eepromData.KHK_Config === 5 ? 'NO' : 'NC',
      setPoint: eepromData.KHK_SetPoint,
    };

    setInputs(initialInputs);
    setOutputs(initialOutputs);
    setKhkConfig(khkInitialConfig);
  }, []);

  const toggleInput = (id) => {
    const updatedInputs = inputs.map(input => {
      if (input.id === id) {
        if (id === '1' && !input.enabled && khkConfig.enabled) {
          Alert.alert(
            t('warning'),
            t('disable_khk_to_enable')
          );
          return input;
        }
        return { ...input, enabled: !input.enabled };
      }
      return input;
    });
    setInputs(updatedInputs);
  };

  const toggleOutput = (id) => {
    const updatedOutputs = outputs.map(output => {
      if (output.id === id) {
        return { ...output, enabled: !output.enabled };
      }
      return output;
    });
    setOutputs(updatedOutputs);
  };

  const handleInputSettingChange = (id, value) => {
    const updatedInputs = inputs.map(input => {
      if (input.id === id) {
        return { ...input, setting: value };
      }
      return input;
    });
    setInputs(updatedInputs);
  };

  const handleOutputSettingChange = (id, value) => {
    const updatedOutputs = outputs.map(output => {
      if (output.id === id) {
        return { ...output, setting: value };
      }
      return output;
    });
    setOutputs(updatedOutputs);
  };

  const toggleOutputType = (id) => {
    const updatedOutputs = outputs.map(output => {
      if (output.id === id) {
        return { ...output, type: output.type === 'NO' ? 'NC' : 'NO' };
      }
      return output;
    });
    setOutputs(updatedOutputs);
  };

  const openModal = (id, type) => {
    setCurrentSelection(id);
    setCurrentType(type);
    setModalVisible(true);
  };

  const saveSettings = () => {
    const inputSettings = settingsOptions.inputs.map(option => option.toLowerCase());
    const outputSettings = settingsOptions.outputs.map(option => option.toLowerCase());

    inputs.forEach((input, index) => {
      eepromData[`Set_Input${index + 1}`] = input.enabled ? inputSettings.indexOf(input.setting.toLowerCase()) : 0;
    });

    outputs.forEach((output, index) => {
      const baseIndex = output.type === 'NC' ? 0 : 128;
      eepromData[`Set_Output${index + 1}`] = output.enabled ? baseIndex + outputSettings.indexOf(output.setting.toLowerCase()) : (output.type === 'NC' ? 0 : 128);
    });

    eepromData.KHK_SetPoint = khkConfig.setPoint;
    eepromData.KHK_Config = khkConfig.enabled
      ? (khkConfig.type === 'NO' ? 5 : 3)
      : (khkConfig.type === 'NO' ? 4 : 2);

    eepromData.ValueChange = 1;

    const updates = {
      Set_Input1: eepromData.Set_Input1,
      Set_Input2: eepromData.Set_Input2,
      Set_Output1: eepromData.Set_Output1,
      Set_Output2: eepromData.Set_Output2,
      KHK_SetPoint: eepromData.KHK_SetPoint,
      KHK_Config: eepromData.KHK_Config,
    };
    updateEEPROMData(updates);

    console.log(eepromData); // For debugging purposes
  };

  const handleKhkToggle = () => {
    if (!khkConfig.enabled && inputs.find(input => input.id === '1').enabled) {
      Alert.alert(
        t('warning'),
        t('disable_input1_to_enable_khk')
      );
      return;
    }
    setKhkConfig(prevConfig => ({ ...prevConfig, enabled: !prevConfig.enabled }));
  };

  const toggleKhkType = () => {
    setKhkConfig(prevConfig => ({ ...prevConfig, type: prevConfig.type === 'NO' ? 'NC' : 'NO' }));
  };

  const renderInputItem = (item) => (
    <View key={item.id} style={styles.itemContainer}>
      <View style={styles.itemHeader}>
        <Text style={styles.itemTitle}>{t(`Input ${item.id}`)}</Text>
        <Switch
          value={item.enabled}
          onValueChange={() => toggleInput(item.id)}
        />
      </View>
      {item.enabled && (
        <TouchableOpacity style={styles.settingButton} onPress={() => openModal(item.id, 'input')}>
          <Text style={styles.settingText}>{item.setting}</Text>
        </TouchableOpacity>
      )}
    </View>
  );

  const renderOutputItem = (item) => (
    <View key={item.id} style={styles.itemContainer}>
      <View style={styles.itemHeader}>
        <Text style={styles.itemTitle}>{t(`Output ${item.id}`)}</Text>
        <Switch
          value={item.enabled}
          onValueChange={() => toggleOutput(item.id)}
        />
      </View>
      {item.enabled && (
        <>
          <TouchableOpacity style={styles.typeButton} onPress={() => toggleOutputType(item.id)}>
            <Text style={styles.typeButtonText}>{t(item.type)}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.settingButton} onPress={() => openModal(item.id, 'output')}>
            <Text style={styles.settingText}>{item.setting}</Text>
          </TouchableOpacity>
        </>
      )}
    </View>
  );

  const renderKHKItem = () => (
    <View key="khk" style={styles.itemContainer}>
      <View style={styles.itemHeader}>
        <Text style={styles.itemTitle}>{t('KHK')}</Text>
        <Switch
          value={khkConfig.enabled}
          onValueChange={handleKhkToggle}
        />
      </View>
      {khkConfig.enabled && (
        <>
          <TouchableOpacity style={styles.typeButton} onPress={toggleKhkType}>
            <Text style={styles.typeButtonText}>{t(khkConfig.type)}</Text>
          </TouchableOpacity>
          <CustomSlider
            title={t('setpoint')}
            minValue={eepromData.Set_StepMotorsFSC_CAF3 / 10}
            maxValue={100}
            initialValue={Math.max(khkConfig.setPoint, eepromData.Set_StepMotorsFSC_CAF3 / 10 )}
            defaultValue={100}
            showToggle={false}
            onValueChange={(value) => setKhkConfig(prevConfig => ({ ...prevConfig, setPoint: value }))}
          />
        </>
      )}
    </View>
  );


  const handleSelectionChange = (value) => {
    if (currentType === 'input') {
      handleInputSettingChange(currentSelection, value);
    } else {
      handleOutputSettingChange(currentSelection, value);
    }
    setModalVisible(false);
  };

  return (
    <SafeAreaView style={styles.body}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.header}>
          <Text style={styles.title}>{t('InputOutput')}</Text>
          <View style={styles.line} />
        </View>
        {inputs.map(item => renderInputItem(item))}
        {outputs.map(item => renderOutputItem(item))}
        {renderKHKItem()}
        <TouchableOpacity style={styles.saveButton} onPress={saveSettings}>
          <Text style={styles.saveButtonText}>{t('save')}</Text>
        </TouchableOpacity>
      </ScrollView>
      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>{t('Select Option')}</Text>
            {(currentType === 'input' ? settingsOptions.inputs : settingsOptions.outputs).map(option => (
              <TouchableOpacity
                key={option}
                style={styles.modalOptionButton}
                onPress={() => handleSelectionChange(option)}
              >
                <Text style={styles.modalOptionText}>{option}</Text>
              </TouchableOpacity>
            ))}
            <TouchableOpacity style={styles.closeButton} onPress={() => setModalVisible(false)}>
              <Text style={styles.closeButtonText}>{t('close')}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  body: {
    flex: 1,
    backgroundColor: colors.white,
  },
  scrollContainer: {
    padding: 16,
  },
  header: {
    alignItems: 'flex-start',
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    color: colors.gray,
  },
  line: {
    height: 1,
    width: '100%',
    backgroundColor: colors.gray,
    marginTop: 4,
  },
  itemContainer: {
    width: '100%',
    backgroundColor: colors.white,
    borderColor: colors.lightgray,
    borderWidth: 1,
    padding: 16,
    borderRadius: 5,
    marginBottom: 16,
  },
  itemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    alignItems: 'center',
    marginBottom: 10,
  },
  itemTitle: {
    fontSize: 18,
    color: colors.black,
  },
  settingText: {
    fontSize: 16,
    color: colors.white,
  },
  settingButton: {
    backgroundColor: colors.lightblue,
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 10,
  },
  typeButton: {
    marginTop: 10,
    backgroundColor: colors.lightblue,
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  typeButtonText: {
    color: colors.white,
    fontSize: 16,
  },
  saveButton: {
    backgroundColor: colors.lightblue,
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 30,
  },
  saveButtonText: {
    color: colors.white,
    letterSpacing: 0.25,
    fontSize: 20,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContainer: {
    width: '80%',
    backgroundColor: colors.white,
    borderRadius: 8,
    padding: 20,
    alignItems: 'center',
    elevation: 5,
  },
  modalTitle: {
    fontSize: 20,
    marginBottom: 20,
    fontWeight: 'bold',
  },
  modalOptionButton: {
    backgroundColor: colors.lightblue,
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
    marginVertical: 5,
    width: '100%',
  },
  modalOptionText: {
    color: colors.white,
    fontSize: 16,
  },
  closeButton: {
    backgroundColor: colors.lightblue,
    padding: 10,
    borderRadius: 8,
    marginTop: 20,
  },
  closeButtonText: {
    color: colors.white,
    fontSize: 16,
  },
});

export default InputOutputScreen;
