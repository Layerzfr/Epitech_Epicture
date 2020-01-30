import React, {
    Component,
} from 'react';
import {Button, Linking, Text, View} from "react-native";

class Login extends Component{
    state = {};

    constructor (props) {
        super(props)
    }

    render() {
        return (<View>
            <Button title="Se connecter" onPress={() => {
                Linking.openURL('https://api.imgur.com/oauth2/authorize?client_id=52cbd80405a2505&response_type=token')
            }}/>
            <Text>
                Aides
            </Text>
        </View>);
    }
}
export default Login