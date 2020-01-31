import React, { Component } from 'react';
import {Button, ImageBackground, Linking, Text, TouchableOpacity, View, StyleSheet} from "react-native";
import {BottomNavigator} from "../Assert/Component/BottomNavigator/BottomNavigator";

class Login extends Component{
    state = {};

    constructor (props) {
        super(props)
    }

    render() {
        return (
            <View>
                <ImageBackground source={require('../Assert/PNG/Fond_Logo.png')}
                                 style={{width: '100%', height: '100%'}}>
                    <TouchableOpacity
                        style={styles.button} onPress={() => {
                        Linking.openURL('https://api.imgur.com/oauth2/authorize?client_id=52cbd80405a2505&response_type=token').then(r =>{} )
                    }}
                    >
                        <Text style={styles.text}>Get Started</Text>
                    </TouchableOpacity>
                    <View style={styles.buttonShadow}/>
                    <BottomNavigator/>
                </ImageBackground>
            </View>
        );
    }
}


const styles = StyleSheet.create({
    text: {
        color: '#025E73',
        fontSize: 20,
        textAlign: 'center',

    },
    button:{
        zIndex: 1,
        display: 'flex',
        width: '50%',
        height: 45,
        borderRadius: 25,
        backgroundColor: '#FFFFFF',
        justifyContent: 'center',
        alignSelf: 'center',
        marginTop: 350,
    },
    buttonShadow:{
        zIndex: 0,
        display: 'flex',
        width: '51%',
        height: 51,
        borderRadius: 25,
        backgroundColor: '#262626',
        alignSelf: 'center',
        bottom: 47,
        opacity: 0.15,
    },
});

export default Login

