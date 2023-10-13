import React from 'react';
import {View, Text, StyleSheet} from 'react-native';

function InfoText({descr, value}) {
  const formattedValue = Array.isArray(value) ? value.join(', ') : value;

  return (
    <View style={styles.row}>
      <View style={styles.left}>
        <Text>{descr}:</Text>
      </View>
      <View style={styles.right}>
        <Text>{formattedValue}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  left: {
    flex: 1,
    alignItems: 'flex-start',
  },
  right: {
    flex: 1,
    alignItems: 'flex-end',
  },
});

export default InfoText;
