// src/screens/Home.js

import React, { Component, useContext } from 'react';
import {
  SafeAreaView,
  Text,
  View,
  Image,
  StyleSheet,
  TouchableOpacity
} from 'react-native';
import { eepromData, pollingData } from '../function/Data.js';
import { convertEEPROMToUint8Array } from '../function/Parsing.js';
import styles from '../styles/styles.js';
import { withTranslation } from 'react-i18next';
import colors from '../styles/colors.js';
import { InfoText } from '../icons/Controls.js';
import { ProfileContext } from '../context/ProfileContext';

class Home extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isWarningActive: false,
      isFireActive: false,
      isPreheaterActive: false,
      isHeaterActive: false,
      isFilterClogged: false,
      selectedButton: null, // Stato per tracciare il bottone selezionato
      index: null,
      boost: null,
      alarm: null,
      showAlarmList: false, // Stato per gestire la visualizzazione della lista degli allarmi
    };
  }

  static contextType = ProfileContext; // Aggiungi questo per accedere al contesto

  componentDidMount() {
    this.updateInterval = setInterval(() => {
      const alarm = pollingData.getAlarmString();
      this.setState({
        isWarningActive: alarm !== 0,
        alarm: alarm,
        selectedButton: eepromData.sel_idxStepMotors + 1,
        boost: eepromData.isBoostEnabled(),
      });
    }, 1000);
  }

  componentWillUnmount() {
    clearInterval(this.updateInterval);
  }

  handleNumberButtonPress = (num) => {
    this.setState({ selectedButton: num });
    const value = num - 1;
    eepromData.sel_idxStepMotors = Number(value);
    console.debug('SPEED INDEX', value);
    const newEEPROM = convertEEPROMToUint8Array(eepromData);
    eepromData.ValueChange = 1;
    console.debug(newEEPROM);
  }

  handleOtherButtonPress = (num) => {
    if (num === 6 && this.state.isWarningActive && !this.state.showAlarmList) {
      this.setState({ showAlarmList: true });
    } else {
      this.setState({ showAlarmList: false });
    }
    console.debug('OTHER BUTTON PRESS', num);
  }

  renderButtonContent(num) {
    const { selectedButton } = this.state;
    const isSelected = selectedButton === num;

    if ([4, 5, 6].includes(num)) {
      switch (num) {
        case 4:
          return (
            <Image
              source={require('../assets/filter.png')}
              style={[
                homeStyles.buttonImage,
                { tintColor: this.state.isFilterClogged ? colors.red : colors.white }
              ]}
            />
          );
        case 5:
          return (
            <View style={homeStyles.doubleImageContainer}>
              <Image
                source={require('../assets/heater.png')}
                style={[
                  homeStyles.topLeftImage,
                  { tintColor: this.state.isHeaterActive ? colors.red : colors.white }
                ]}
              />
              <Image
                source={require('../assets/heater.png')}
                style={[
                  homeStyles.bottomRightImage,
                  { tintColor: this.state.isPreheaterActive ? colors.red : colors.white }
                ]}
              />
              <View style={homeStyles.diagonalLine} />
            </View>
          );
        case 6:
          return (
            <View style={homeStyles.doubleImageContainer}>
              <Image
                source={require('../assets/warning.png')}
                style={[
                  homeStyles.topLeftImage,
                  { tintColor: this.state.isWarningActive ? colors.red : colors.white }
                ]}
              />
              <Image
                source={require('../assets/fire_icon.png')}
                style={[
                  homeStyles.bottomRightImage,
                  { tintColor: this.state.isFireActive ? colors.red : colors.white }
                ]}
              />
              <View style={homeStyles.diagonalLine} />
            </View>
          );
        default:
          return null;
      }
    } else {
      return <Text style={[homeStyles.buttonText, { color: isSelected ? colors.white : colors.lightgray }]}>{num}</Text>;
    }
  }

  render() {
    const { t } = this.props;
    const { selectedButton, showAlarmList } = this.state;
    const { isService } = this.context; // Ottieni il valore di isService dal contesto

    return (
      <SafeAreaView style={styles.body}>
        <View style={homeStyles.logoContainer}>
          <Image source={require('../assets/logo.png')} style={homeStyles.logo} />
        </View>
        <View style={homeStyles.centerContainer}>
          <View style={homeStyles.blackBox}>
            {[3, 4, 2, 5, 1, 6].map((num) => (
              <TouchableOpacity
                key={num}
                style={[
                  homeStyles.button,
                  num >= 4 ? { borderColor: colors.white } : { borderColor: selectedButton === num ? colors.white : colors.lightgray },
                  num >= 4 ? homeStyles.rightAlignedButton : {},
                ]}
                onPress={() => num >= 4 ? this.handleOtherButtonPress(num) : this.handleNumberButtonPress(num)}
                disabled={num === 6 && !isService} // Disabilita il pulsante 6 se isService è false
              >
                {this.renderButtonContent(num)}
              </TouchableOpacity>
            ))}
          </View>
        </View>
        {showAlarmList && (
          <View style={homeStyles.alarmListContainer}>
            <InfoText descr={t('alarm_list')} value={this.state.alarm} textcolor="red" />
          </View>
        )}
      </SafeAreaView>
    );
  }
}

const homeStyles = StyleSheet.create({
  logoContainer: {
    marginTop: 40,
    alignItems: 'center',
  },
  logo: {
    width: "95%",
    height: 100,
    resizeMode: 'contain',
  },
  centerContainer: {
    marginTop: 40,
    marginBottom: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  blackBox: {
    width: '95%',
    aspectRatio: 1,
    backgroundColor: colors.black,
    borderRadius: 10,
    justifyContent: 'space-around',
    alignItems: 'center',
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 10,
  },
  button: {
    width: '30%',
    aspectRatio: 1,
    backgroundColor: colors.black,
    borderWidth: 2,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    margin: 5,
    marginRight: 10,
    position: 'relative', // Aggiunto per il posizionamento degli elementi interni
  },
  buttonText: {
    fontSize: 50,
  },
  buttonImage: {
    width: '70%',
    height: '70%',
    resizeMode: 'contain',
  },
  doubleImageContainer: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative', // Aggiunto per il posizionamento degli elementi interni
  },
  topLeftImage: {
    width: '42%',
    height: '42%',
    position: 'absolute',
    top: 5,
    left: 5,
  },
  bottomRightImage: {
    width: '42%',
    height: '42%',
    position: 'absolute',
    bottom: 5,
    right: 5,
  },
  diagonalLine: {
    position: 'absolute',
    width: 2,
    height: '100%', // copre tutta la diagonale
    backgroundColor: colors.white,
    transform: [{ rotate: '45deg' }],
  },
  rightAlignedButton: {
    alignSelf: 'flex-end',
  },
  alarmListContainer: {
    marginTop: 10,
    alignItems: 'center',
  },
  alarmListText: {
    color: colors.red,
    fontSize: 20,
    fontWeight: 'bold',
  },
});

export default withTranslation()(Home);
