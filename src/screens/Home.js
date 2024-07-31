import React, { Component, useContext } from 'react';
import {
  SafeAreaView,
  Text,
  View,
  Image,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { eepromData, pollingData } from '../function/Data.js';
import styles from '../styles/styles.js';
import { withTranslation } from 'react-i18next';
import colors from '../styles/colors.js';
import { InfoText } from '../icons/Controls.js';
import { ProfileContext } from '../context/ProfileContext';
import { WifiContext } from '../context/WiFiContext';

class Home extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isWarningActive: false,
      isFireActive: false,
      isPreheaterActive: false,
      isHeaterActive: false,
      isFilterClogged: false,
      selectedButton: null,
      index: null,
      boost: null,
      alarm: null,
      showAlarmList: false,
      blink: false,  // Stato per il lampeggiamento del tasto 3
      screenWidth: Dimensions.get('window').width, // Ottieni la larghezza dello schermo
    };

    this.pressStartTime = null;
    this.pressTimer = null;
    this.blinkInterval = null;
  }

  static contextType = ProfileContext;

  componentDidMount() {
    this.updateInterval = setInterval(() => {
      const alarm = pollingData.getAlarmString();
      const boostEnabled = eepromData.isBoostEnabled();

      this.setState({
        isWarningActive: alarm !== "",
        alarm: alarm,
        selectedButton: boostEnabled ? 3 : (eepromData.sel_idxStepMotors + 1),
        boost: boostEnabled,
      });

      if (boostEnabled && !this.blinkInterval) {
        this.startBlinking();
      } else if (!boostEnabled && this.blinkInterval) {
        this.stopBlinking();
      }
    }, 1000);

    // Aggiungi un listener per aggiornare la larghezza dello schermo quando cambia
    Dimensions.addEventListener('change', this.handleScreenResize);
  }

  componentWillUnmount() {
    clearInterval(this.updateInterval);
    this.stopBlinking();

    // Rimuovi il listener quando il componente viene smontato
    Dimensions.removeEventListener('change', this.handleScreenResize);
  }

  handleScreenResize = ({ window }) => {
    this.setState({ screenWidth: window.width });
  };

  startBlinking = () => {
    this.blinkInterval = setInterval(() => {
      this.setState(prevState => ({ blink: !prevState.blink }));
    }, 500);
  };

  stopBlinking = () => {
    clearInterval(this.blinkInterval);
    this.blinkInterval = null;
    this.setState({ blink: false });
  };

  handleNumberButtonPress = (num) => {
    if (num === 1 || num === 2) {
      if (this.state.boost) return;  // Disabilita i tasti 1 e 2 se boost è abilitato
    }

    this.setState({ selectedButton: num });
    const { wifiContext } = this.props;
    const { updateEEPROMData } = wifiContext;

    if (this.pressStartTime) {
      const pressDuration = new Date().getTime() - this.pressStartTime;
      if (pressDuration > 3000) {
        console.log('Press duration:', pressDuration);
        eepromData.toggleBoost();
        console.debug('Boost: ', eepromData.isBoostEnabled());
        eepromData.ValueChange = 1;
        const updates = { Enab_Fuction1: eepromData.Enab_Fuction1 };
        updateEEPROMData(updates);
      }else {
        const value = num - 1;
        eepromData.sel_idxStepMotors = Number(value);
        eepromData.ValueChange = 1;
        console.debug('SPEED INDEX', value);
        const updates = { sel_idxStepMotors: value };
        updateEEPROMData(updates);
      }
      this.pressStartTime = null;
    } else {
      const value = num - 1;
      eepromData.sel_idxStepMotors = Number(value);
      eepromData.ValueChange = 1;
      console.debug('SPEED INDEX', value);
      const updates = { sel_idxStepMotors: value };
      updateEEPROMData(updates);
    }
  }

  handleOtherButtonPress = (num) => {
    if (num === 6 && this.state.isWarningActive && !this.state.showAlarmList) {
      this.setState({ showAlarmList: true });
    } else {
      this.setState({ showAlarmList: false });
    }
    console.debug('OTHER BUTTON PRESS', num);
  }

  handlePressIn = (num) => {
    if (num === 3) {
      this.pressStartTime = new Date().getTime();
      this.pressTimer = setTimeout(() => {
        console.log('Button 3 held for 3 seconds');
      }, 3000);
    }
  }

  handlePressOut = (num) => {
    if (num === 3) {
      clearTimeout(this.pressTimer);
      this.pressTimer = null;
    }
  }

  renderButtonContent(num) {
    const { selectedButton, blink } = this.state;
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
    } else if (num === 3 && this.state.boost && blink) {
      return null;  // Rende il tasto 3 "invisibile" quando lampeggia
    } else {
      return <Text style={[homeStyles.buttonText, { color: isSelected ? colors.white : colors.lightgray }]}>{num}</Text>;
    }
  }

  render() {
    const { t } = this.props;
    const { selectedButton, showAlarmList, screenWidth } = this.state;
    const { isService } = this.context;

    // Calcola la larghezza del contenitore blackBox
    const blackBoxWidth = screenWidth > 400 ? 0.95 * 400 : '380';

    return (
      <SafeAreaView style={styles.body}>
        <View style={homeStyles.logoContainer}>
          <Image source={require('../assets/logo.png')} style={homeStyles.logo} />
        </View>
        <View style={homeStyles.centerContainer}>
          <View style={[homeStyles.blackBox, { width: blackBoxWidth }]}>
            {[3, 4, 2, 5, 1, 6].map((num) => (
              <TouchableOpacity
                key={num}
                style={[
                  homeStyles.button,
                  num >= 4 ? { borderColor: colors.white } : { borderColor: selectedButton === num ? colors.white : colors.lightgray },
                  num >= 4 ? homeStyles.rightAlignedButton : {},
                ]}
                onPressIn={() => this.handlePressIn(num)}
                onPressOut={() => this.handlePressOut(num)}
                onPress={() => num >= 4 ? this.handleOtherButtonPress(num) : this.handleNumberButtonPress(num)}
                disabled={((num === 1 || num === 2) && this.state.boost) || (num === 6 && !isService)}
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
    position: 'relative',
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
    position: 'relative',
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
    height: '100%',
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

const HomeWithContext = (props) => {
  const wifiContext = useContext(WifiContext);
  return <Home {...props} wifiContext={wifiContext} />;
};

export default withTranslation()(HomeWithContext);
