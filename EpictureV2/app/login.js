import React, { Component } from 'react';
import {Button, ImageBackground, Linking, Text, TouchableOpacity, View, StyleSheet, Image} from "react-native";

class Login extends Component{
    state = {};

    constructor (props) {
        super(props)
    }

    render() {
        return (
            <View>
                <ImageBackground source={require('../Assert/PNG/Fond.png')}
                                 style={{width: '100%', height: '100%'}}>
                    <View style={styles.logo}>
                        <Image resizeMode={"contain"} style={{alignSelf: 'center',width: '74%', height: '51%'}} source={require('../Assert/PNG/Logo.png')}/>
                    </View>
                    <TouchableOpacity
                        style={styles.button} onPress={() => {
                        Linking.openURL('https://api.imgur.com/oauth2/authorize?client_id=52cbd80405a2505&response_type=token').then(r =>{})
                    }}
                    >
                        <Text style={styles.text}>Get Started</Text>
                    </TouchableOpacity>
{/*
                    <View style={styles.buttonShadow}/>
*/}
                </ImageBackground>
            </View>
        );
    }
}


const styles = StyleSheet.create({
    text: {
        color: '#025E73',
        fontWeight: 'bold',
        fontSize: 20,
        textAlign: 'center',

    },
    logo: {
        display: 'flex',
        alignItems: 'center',
        top: '30%',
        width: '65%',
        height: '30%',
        justifyContent: 'center',
        alignSelf: 'center',
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
        top: '50%',
    },
    buttonShadow:{
        zIndex: 0,
        display: 'flex',
        width: '51%',
        height: 51,
        borderRadius: 25,
        backgroundColor: '#262626',
        alignSelf: 'center',
        opacity: 0.15,
        bottom: '10%'
    },
});

export default Login

