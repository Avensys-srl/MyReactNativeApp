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
    height: height * 0.03,
    width: width * 0.3,
    backgroundColor: 'white',
    borderRadius: (width * 0.8) / 2,
    justifyContent: 'center',
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'black',
  },
  circle: {
    height: height * 0.03,
    width: width * 0.06,
    borderRadius: 12,
    backgroundColor: 'lightgray',
    borderWidth: 1,
    borderColor: 'black',
    position: 'absolute',
    left: -1,
  },
  circleActive: {
    left: width * 0.048 * 5,
    backgroundColor: '#4CAF50',
  },
  text: {
    fontSize: 16,
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
