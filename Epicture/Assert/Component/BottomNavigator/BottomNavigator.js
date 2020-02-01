import React, {Component} from 'react';

import {
  View,
  StyleSheet,
  Image,
  Text,
  Button,
  TouchableOpacity,
} from 'react-native';
import Home from '../../../app/Home';
class BottomNavigator extends Component {
  render() {
    return (
      <View style={styles.container}>
        <TouchableOpacity style={styles.buttonNav}>
          <Image
            style={styles.homeImage}
            source={require('../../Icon/home.png')}
          />
        </TouchableOpacity>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'green',
    position: 'absolute',
    bottom: 0,
    width: '100%',
    height: '10%',
  },
  homeImage: {
      justifyContent: 'center',
      alignSelf: 'center',
      marginTop: '25%',
  },
  buttonNav: {
    backgroundColor: 'red',
    position: 'absolute',
    bottom: 0,
    width: '20%',
    height: '100%',
  },
});

export {BottomNavigator};
