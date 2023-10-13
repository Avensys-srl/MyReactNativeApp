import React, {Component} from 'react';
import {View, Text} from 'react-native';

class DynamicScreen extends Component {
  constructor(props) {
    super(props);

    this.state = {
      dynamicValue: 0, // Valore iniziale
    };
  }

  componentDidMount() {
    // Avvia un intervallo per aggiornare il valore ogni 2 secondi
    this.updateInterval = setInterval(() => {
      // Simula un aggiornamento del valore (puoi sostituire con la tua logica)
      const newValue = this.state.dynamicValue + 1;
      this.setState({dynamicValue: newValue});
    }, 2000); // Ogni 2000 millisecondi (2 secondi)
  }

  componentWillUnmount() {
    // Pulisci l'intervallo quando il componente viene smontato
    clearInterval(this.updateInterval);
  }

  render() {
    return (
      <View>
        <Text>Valore dinamico: {this.state.dynamicValue}</Text>
      </View>
    );
  }
}

export default DynamicScreen;
