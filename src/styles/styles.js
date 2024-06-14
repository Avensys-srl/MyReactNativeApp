// styles.js

import { StyleSheet } from 'react-native';
import { Colors } from 'react-native/Libraries/NewAppScreen';
import colors from './colors';

const boxShadow = {
  shadowColor: '#000',
  shadowOffset: {
    width: 0,
    height: 2,
  },
  shadowOpacity: 0.25,
  shadowRadius: 3.84,
  elevation: 5,
};

const styles = StyleSheet.create({
  // ...altri stili
  engine: {
    position: 'absolute',
    right: 10,
    bottom: 0,
    color: Colors.black,
  },
  scanButton: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    backgroundColor: colors.lightblue,
    margin: 10,
    borderRadius: 8,
    ...boxShadow,
  },
  BPButton: {
    alignItems: 'center',
    justifyContent: 'left',
    paddingVertical: 16,
    backgroundColor: '#0a398a',
    margin: 10,
    borderRadius: 8,
    flex: 1,
    ...boxShadow,
  },
  scanButtonText: {
    fontSize: 20,
    letterSpacing: 0.25,
    color: Colors.white,
  },
  BPButtonText: {
    fontSize: 16,
    letterSpacing: 0.25,
    color: Colors.white,
  },
  TitleText: {
    fontSize: 18,
    textAlign: 'center', // Center the text horizontally
    marginHorizontal: 20, // Margin of 20 on the left and right
    marginTop: 20, // Margin of 20 on the top
  },
  sectionTitle: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 32,
    paddingHorizontal: 24,
  },
  buttonContainer: {
    flexDirection: 'row', // Imposta il layout in una riga
    justifyContent: 'center',
  },
  body: {
    backgroundColor: Colors.white,
    flex: 1,
  },
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 16,
    //fontWeight: '600',
    color: colors.gray,
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 16,
    fontWeight: '400',
    color: Colors.dark,
    textAlign: 'center',
    marginBottom: 8,
  },
  highlight: {
    fontWeight: '700',
  },
  footer: {
    color: Colors.dark,
    fontSize: 12,
    fontWeight: '600',
    padding: 4,
    paddingRight: 12,
    textAlign: 'right',
  },
  peripheralName: {
    fontSize: 16,
    textAlign: 'center',
    padding: 10,
  },
  rssi: {
    fontSize: 12,
    textAlign: 'center',
    padding: 2,
  },
  peripheralId: {
    fontSize: 12,
    textAlign: 'center',
    padding: 2,
    paddingBottom: 20,
  },
  row: {
    marginLeft: 10,
    marginRight: 10,
    borderRadius: 20,
    ...boxShadow,
  },
  noPeripherals: {
    margin: 10,
    textAlign: 'center',
    color: colors.white,
  },
  BtnText: {
    fontSize: 16,
    fontWeight: '400',
    color: Colors.dark,
    textAlign: 'center',
  },
  deviceItem: {
    padding: 15,
    backgroundColor: '#fff',
    marginVertical: 8,
    marginHorizontal: 16,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  deviceName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  deviceId: {
    fontSize: 14,
    color: '#888',
  },
  deviceRssi: {
    fontSize: 12,
    color: '#555',
  },
  image: {
    width: '60%',
    height: undefined,
    aspectRatio: 1,
    resizeMode: 'contain',
    marginBottom: 24,
  },
  image_container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 5,
  },
  deviceItemContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  deviceTextContainer: {
    flex: 1,
  },
  deviceIcon: {
    width: 50,
    height: 50,
  },
  disconnectButton: {
    backgroundColor: colors.red,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    margin: 10,
    borderRadius: 8,
    ...boxShadow,
  },
  disconnectButtonText: {
    fontSize: 20,
    letterSpacing: 0.25,
    color: colors.white,
  },
});

export default styles;
