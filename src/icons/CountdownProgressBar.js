import React, {useState} from 'react';
import {View, Text, PanResponder, StyleSheet, Dimensions} from 'react-native';
import * as Progress from 'react-native-progress';

const {width} = Dimensions.get('window');
const CountdownProgressBar = ({
  label,
  min_val,
  max_val,
  init_val,
  onValueChange,
}) => {
  const [progress, setProgress] = useState(init_val);

  const mv = min_val;
  const Xv = max_val;
  const rv = label;

  const handlePanResponderMove = (evt, gestureState) => {
    const progressBarWidth = 300;
    const touchX = Math.min(progressBarWidth, Math.max(0, gestureState.moveX));
    const newProgress = touchX / progressBarWidth;

    setProgress(newProgress.toPrecision(2));

    if (onValueChange) {
      onValueChange(newProgress.toPrecision(2));
    }
  };

  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onPanResponderMove: handlePanResponderMove,
  });

  const filledWidth = 320 * (progress || 0);

  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        margin: 10,
      }}>
      <Text style={{marginBottom: 12}}>{rv}</Text>
      <View {...panResponder.panHandlers}>
        <Progress.Bar
          progress={progress}
          width={width * 0.93}
          height={25}
          borderRadius={18}
          color="#4CAF50"
          borderColor="black"
          borderWidth={1}
          unfilledColor="#ffffff"
        />
        <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
          <Text>{mv}</Text>
          <Text>{Xv}</Text>
          <Text style={{position: 'absolute', left: filledWidth, bottom: -10}}>
            {`${Math.round(progress * (max_val - min_val) + min_val)}`}
          </Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({});

export default CountdownProgressBar;
