import React, {useState} from 'react';
import {View, TouchableOpacity, StyleSheet, Text} from 'react-native';

const OnOff = ({status}) => {
  const [isToggled, setIsToggled] = useState(false);

  const handleToggle = () => {
    setIsToggled(!isToggled);
  };

  return (
    <View style={styles.mainContainer}>
      <View>
        <View>
          <TouchableOpacity onPress={handleToggle} style={styles.container}>
            <View style={[styles.circle, isToggled && styles.circleActive]} />
          </TouchableOpacity>
        </View>
        <View style={styles.onOffStyle}>
          <Text>Off</Text>
          <Text>On</Text>
        </View>
      </View>
      <View>
        <Text style={styles.text}>{status}</Text>
      </View>
    </View>
  );
};

const circleSize = 20;
const containerWidth = circleSize * 4;

const styles = StyleSheet.create({
  mainContainer: {
    flexDirection: 'row',
    paddingHorizontal: 12,
    paddingVertical: 30,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 'auto',
    marginRight: 'auto',
    marginTop: 8,
  },
  container: {
    height: circleSize,
    width: containerWidth,
    backgroundColor: 'white',
    borderRadius: circleSize / 2,
    justifyContent: 'center',
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: 'black',
  },
  circle: {
    height: circleSize,
    width: circleSize,
    borderRadius: circleSize / 2,
    backgroundColor: 'lightgray',
    borderWidth: 2,
    borderColor: 'black',
    position: 'absolute',
    left: 0,
  },
  circleActive: {
    left: containerWidth - circleSize,
    backgroundColor: '#4CAF50',
  },
  text: {
    fontSize: 18,
    marginLeft: 8,
    marginTop: -20,
  },
  onOffStyle: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 4,
  },
});

export default OnOff;
