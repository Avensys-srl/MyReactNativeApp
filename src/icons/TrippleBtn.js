import {Pressable, Text, View} from 'react-native';
import React, {useState, useEffect} from 'react';
import styles from '../styles/styles';

const TrippleBtn = ({TBL, TBC, TBR}) => {
  const [firstContainer, setFirstContainer] = useState('white');
  const [secondContainer, setSecondContainer] = useState('white');
  const [thirdContainer, setThirdContainer] = useState('white');

  useEffect(() => {
    if (TBL === 1) {
      setFirstContainer('lightgreen');
      setSecondContainer('white');
      setThirdContainer('white');
    } else if (TBC === 1) {
      setFirstContainer('white');
      setSecondContainer('lightgreen');
      setThirdContainer('white');
    } else if (TBR === 1) {
      setFirstContainer('white');
      setSecondContainer('white');
      setThirdContainer('lightgreen');
    }
  }, [TBL, TBC, TBR]);

  return (
    <View
      style={{
        justifyContent: 'center',
        alignItems: 'top',
        flex: 1,
        flexDirection: 'row',
      }}>
      <Pressable
        onPress={() => (
          setFirstContainer('lightgreen'),
          setSecondContainer('white'),
          setThirdContainer('white')
        )}>
        <View
          style={{
            backgroundColor: `${firstContainer}`,
            padding: 30,
            marginRight: 8,
            borderWidth: 1,
            borderColor: '#000000',
            borderRadius: 12,
          }}>
          <Text style={styles.BtnText}>{TBL}</Text>
        </View>
      </Pressable>
      <Pressable
        onPress={() => (
          setFirstContainer('white'),
          setSecondContainer('lightgreen'),
          setThirdContainer('white')
        )}>
        <View
          style={{
            backgroundColor: `${secondContainer}`,
            padding: 30,
            marginRight: 8,
            borderWidth: 1,
            borderColor: '#000000',
            borderRadius: 12,
            fontSize: 16,
            fontWeight: '400',
          }}>
          <Text style={styles.BtnText}>{TBC}</Text>
        </View>
      </Pressable>
      <Pressable
        onPress={() => (
          setFirstContainer('white'),
          setSecondContainer('white'),
          setThirdContainer('lightgreen')
        )}>
        <View
          style={{
            backgroundColor: `${thirdContainer}`,
            padding: 30,
            marginRight: 8,
            borderWidth: 1,
            borderColor: '#000000',
            borderRadius: 12,
            fontSize: 16,
            fontWeight: '400',
          }}>
          <Text style={styles.BtnText}>{TBR}</Text>
        </View>
      </Pressable>
    </View>
  );
};

export default TrippleBtn;
