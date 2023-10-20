import {StyleSheet, Text, View, Image} from 'react-native';
import React from 'react';

const CustomHeaderBackButton = () => {
  return (
    <View style={styles.subRow}>
      <Image
        source={require('../assets/star-icon.png')}
        style={styles.imgHead}
      />
      <Image
        source={require('../assets/arrow-up.png')}
        style={styles.imgHead}
      />
    </View>
  );
};

export default CustomHeaderBackButton;

const styles = StyleSheet.create({
  subRow: {
    flexDirection: 'row',
  },
  imgHead: {
    width: 25,
    height: 25,
    marginRight: 8,
  },
});
