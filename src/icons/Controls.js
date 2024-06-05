import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';
import colors from '../styles/colors';

const InfoText = ({ descr, value, textcolor }) => {
  const formattedValue = Array.isArray(value) ? value.join(' - ') : value;

  // Ottieni il valore del colore dal nome del colore, se esiste
  const colorValue = colors[textcolor] || textcolor;

  // Crea uno stile dinamico che include `colorValue` se è definito
  const rightTextStyle = colorValue ? { ...styles.right, color: colorValue } : styles.right;

  return (
    <View style={styles.row}>
      <View style={styles.left}>
        <Text>{descr}:</Text>
      </View>
      <View style={styles.right}>
        <Text style={rightTextStyle}>{formattedValue}</Text>
      </View>
    </View>
  );
}

const EditableInfoRow = ({ label, initialValue, onSubmitEditing }) => {
  const [value, setValue] = useState(initialValue);

  const handleChange = (text) => {
    setValue(text);
  };

  const handleSubmitEditing = () => {
    // Esegui la funzione specificata quando l'utente preme "Invio"
    if (onSubmitEditing) {
      onSubmitEditing(value);
    }
  };

  return (
    <View style={styles.row}>
      <Text style={styles.label}>{label}:</Text>
      <TextInput
        style={styles.input}
        value={value}
        onChangeText={handleChange}
        onSubmitEditing={handleSubmitEditing}
      />
    </View>
  );
};
const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    verticalAlign: 'center',
  },
  left: {
    flex: 1,
    alignItems: 'flex-start',
  },
  right: {
    flex: 1,
    alignItems: 'flex-end',
  },
  label: {
    flex: 1,
    textAlign: 'left',
  },
  input: {
    flex: 1,
    textAlign: 'right',
  },
});

export { InfoText, EditableInfoRow };
