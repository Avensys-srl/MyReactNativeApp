import React, { useState } from 'react';
import { View, Text, Switch, StyleSheet, TouchableOpacity } from 'react-native';
import Slider from '@react-native-community/slider';
import PropTypes from 'prop-types';
import colors from '../styles/colors'; // Assicurati di avere il file colors.js o modifica i colori come preferisci

const CustomSlider = ({ title, minValue, maxValue, initialValue, defaultValue, showToggle, onToggleChange, onValueChange }) => {
  const [value, setValue] = useState(initialValue);
  const [isEnabled, setIsEnabled] = useState(true);

  const toggleSwitch = () => {
    const newValue = !isEnabled;
    setIsEnabled(newValue);
    if (onToggleChange) {
      onToggleChange(newValue);
    }
  };

  const handleValueChange = (newValue) => {
    setValue(newValue);
  };

  const handleSlidingComplete = (finalValue) => {
    const roundedValue = Math.round(finalValue);
    setValue(roundedValue);
    if (onValueChange) {
      onValueChange(roundedValue);
    }
  };

  const incrementValue = () => {
    if (value < maxValue) {
      const newValue = value + 1;
      setValue(newValue);
      if (onValueChange) {
        onValueChange(newValue);
      }
    }
  };

  const decrementValue = () => {
    if (value > minValue) {
      const newValue = value - 1;
      setValue(newValue);
      if (onValueChange) {
        onValueChange(newValue);
      }
    }
  };

  const resetValue = () => {
    setValue(defaultValue);
    if (onValueChange) {
      onValueChange(defaultValue);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{title}</Text>
        {showToggle && (
          <Switch
            trackColor={{ false: colors.lightgray, true: colors.green }}
            thumbColor={isEnabled ? colors.green : colors.gray}
            ios_backgroundColor={colors.lightgray}
            onValueChange={toggleSwitch}
            value={isEnabled}
          />
        )}
      </View>
      <View style={styles.sliderContainer}>
        <Slider
          style={styles.slider}
          minimumValue={minValue}
          maximumValue={maxValue}
          step={1} // Aggiunge lo step minimo di 1
          minimumTrackTintColor={colors.lightblue}
          maximumTrackTintColor={colors.lightgray}
          thumbTintColor={colors.thumbColor} // Colore del thumb
          thumbStyle={styles.thumb} // Aggiungi il bordo
          value={value}
          onValueChange={handleValueChange}
          onSlidingComplete={handleSlidingComplete}
          disabled={!isEnabled}
        />
        <Text style={styles.valueText}>{Math.round(value)}</Text>
      </View>
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.buttonLess} onPress={decrementValue}>
          <Text style={styles.buttonText}>-</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.buttonReset} onPress={resetValue}>
          <Text style={styles.resetButtonText}>Reset</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.buttonMore} onPress={incrementValue}>
          <Text style={styles.buttonText}>+</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

CustomSlider.propTypes = {
  title: PropTypes.string.isRequired,
  minValue: PropTypes.number.isRequired,
  maxValue: PropTypes.number.isRequired,
  initialValue: PropTypes.number.isRequired,
  defaultValue: PropTypes.number.isRequired,
  showToggle: PropTypes.bool,
  onToggleChange: PropTypes.func,
  onValueChange: PropTypes.func,
};

CustomSlider.defaultProps = {
  showToggle: true,
  onToggleChange: null,
  onValueChange: null,
};

const styles = StyleSheet.create({
  container: {
    margin: 16,
    padding: 16,
    backgroundColor: colors.white,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 18,
    color: colors.black,
  },
  sliderContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  slider: {
    flex: 1,
  },
  thumb: {
    borderWidth: 1,
    borderColor: colors.lightgray,
  },
  valueText: {
    fontSize: 18,
    marginLeft: 8,
    color: colors.black,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  buttonLess: {
    backgroundColor: colors.red,
    padding: 10,
    borderRadius: 5,
    width: 40,
    alignItems: 'center',
  },
  buttonMore: {
    backgroundColor: colors.lightblue,
    padding: 10,
    borderRadius: 5,
    width: 40,
    alignItems: 'center',
  },
  buttonText: {
    color: colors.white,
    fontSize: 18, // Dimensione del font maggiore
  },
  buttonReset: {
    backgroundColor: colors.lightgray,
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginHorizontal: 10,
  },
  resetButtonText: {
    color: colors.white,
    fontSize: 18,
  },
});

export default CustomSlider;
