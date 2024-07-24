import React, { useState, useEffect, useContext } from 'react';
import { StyleSheet, View, ScrollView, Text, Dimensions, TouchableOpacity, Modal, Image, Alert } from 'react-native';
import colors from '../../styles/colors';
import { useTranslation } from 'react-i18next';
import { eepromData } from '../../function/Data';
import { WifiContext } from '../../context/WiFiContext';

const LayoutUnit = () => {
  const { t } = useTranslation();
  const { updateEEPROMData } = useContext(WifiContext);
  const [selectedUnit, setSelectedUnit] = useState('left'); // 'left' or 'right'
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    if (eepromData.Posiz_NTC === 228) {
      setSelectedUnit('left');
    } else if (eepromData.Posiz_NTC === 78) {
      setSelectedUnit('right');
    } else {
      Alert.alert(t('error'), t('Invalid Posiz_NTC value'));
    }
  }, []);

  const handleUnitChange = (unit) => {
    if (unit === 'left') {
      eepromData.Posiz_NTC = 228;
    } else if (unit === 'right') {
      eepromData.Posiz_NTC = 78;
    } else {
      Alert.alert(t('error'), t('Invalid unit value'));
      return;
    }

    setSelectedUnit(unit);
    eepromData.ValueChange = 1;
    setModalVisible(false);

    // Update EEPROM data via API
    const updates = { Posiz_NTC: eepromData.Posiz_NTC };
    updateEEPROMData(updates);
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.header}>
          <Text style={styles.title}>{t('LayoutUnit')}</Text>
          <View style={styles.line} />
        </View>
        <View style={styles.contentContainer}>
          <Text style={styles.unitText}>{t('green_arrow')}</Text>
          <TouchableOpacity onPress={() => setModalVisible(true)}>
            <Image
              source={selectedUnit === 'left' ? require('../../assets/412_DRAW_QUARK_FL_D.png') : require('../../assets/411_DRAW_QUARK_FL_C.png')}
              style={styles.unitImage}
            />
            <Text style={styles.unitText}>{selectedUnit === 'left' ? t('left_configuration') : t('right_configuration')}</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalView}>
            <TouchableOpacity onPress={() => handleUnitChange('left')} style={styles.modalItem}>
              <Image source={require('../../assets/412_DRAW_QUARK_FL_D.png')} style={styles.modalImage} />
              <Text style={styles.modalText}>{t('left_configuration')}</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => handleUnitChange('right')} style={styles.modalItem}>
              <Image source={require('../../assets/411_DRAW_QUARK_FL_C.png')} style={styles.modalImage} />
              <Text style={styles.modalText}>{t('right_configuration')}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.closeButtonText}>{t('close')}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
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
  contentContainer: {
    width: contentWidth,
    alignItems: 'center',
  },
  unitImage: {
    width: 200,
    height: 400,
    resizeMode: 'contain',
  },
  unitText: {
    marginTop: 10,
    fontSize: 18,
    color: colors.black,
    textAlign: 'center',
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalView: {
    margin: 20,
    backgroundColor: colors.white,
    borderRadius: 20,
    padding: 50,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalItem: {
    alignItems: 'center',
    marginBottom: 20,
  },
  modalImage: {
    width: 100,
    height: 200,
    resizeMode: 'contain',
  },
  modalText: {
    marginTop: 10,
    fontSize: 16,
    color: colors.black,
  },
  closeButton: {
    backgroundColor: colors.lightblue,
    borderRadius: 10,
    padding: 10,
    elevation: 2,
    marginTop: 20,
  },
  closeButtonText: {
    color: colors.white,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default LayoutUnit;
