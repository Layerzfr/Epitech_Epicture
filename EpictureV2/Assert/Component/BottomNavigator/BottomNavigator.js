import React, { Component } from 'react';

import { View, StyleSheet, Image, Text, Button } from 'react-native'
class BottomNavigator extends Component {

    render() {
        return (
            <View style={styles.container}>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: 'red',
        position: 'absolute',
        bottom: 0,
        width: '100%',
        height: '10%',
    },
})

export {BottomNavigator}
