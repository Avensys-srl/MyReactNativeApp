import React from 'react';
import {View} from 'react-native';
import QRCode from 'react-native-qrcode-svg';

const QRButton = ({QRvalue}) => {
  return (
    <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
      <QRCode value={QRvalue} />
    </View>
  );
};

export default QRButton;
