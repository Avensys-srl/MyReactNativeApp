import React, {useState} from 'react';
import {
  View,
  TouchableOpacity,
  StyleSheet,
  Text,
  Dimensions,
} from 'react-native';

const {width} = Dimensions.get('window');
const {height} = Dimensions.get('window');
const ToggleSwitch = ({TOO, CL, CR, BG}) => {
  const [isWifi, setIsWifi] = useState(true);

  const handleToggle = () => {
    setIsWifi(!isWifi);
  };

  return (
    <View
      style={{
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        height: '100%',
      }}>
      <TouchableOpacity style={styles.container} onPress={handleToggle}>
        <View
          style={[
            styles.circle,
            isWifi ? styles.leftCircle : styles.rightCircle,
            BG == 0
              ? {backgroundColor: '#4CAF50'}
              : BG == 1
              ? {backgroundColor: 'white'}
              : {backgroundColor: 'red'},
          ]}
        />
      </TouchableOpacity>
      <View
        style={{
          justifyContent: 'space-between',
          flexDirection: 'row',
          width: 250,
        }}>
        <Text>{CL}</Text>
        <Text>{CR}</Text>
      </View>
      <Text style={{textAlign: 'center', marginBottom: 10}}>{TOO}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: width * 0.7,
    height: height * 0.032,
    borderRadius: 12.5,
    backgroundColor: 'white',
    borderColor: 'black',
    borderWidth: 1,
    flexDirection: 'row',
    overflow: 'hidden',
    marginTop: 30,
  },
  circle: {
    width: (width * 0.7) / 11,
    height: height * 0.032,
    borderRadius: 12.5,
    backgroundColor: '#4CAF50',
    borderWidth: 1,
    borderColor: 'black',
    position: 'absolute',
    top: -1,
  },
  leftCircle: {
    left: -1,
  },
  rightCircle: {
    right: -1,
  },
});

export default ToggleSwitch;
