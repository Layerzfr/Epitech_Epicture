import React, {Component} from "react";
import {ActivityIndicator, Image, Picker, ScrollView, Text, View} from 'react-native';
import Login from "./login";
import {SearchBar} from "react-native-elements";

class Comments extends Component {

    state = {search: null, token: null, maxImage: 2, sort: 'viral', date: 'all', loading: false,};

    constructor(props) {
        super(props);
        this.setState(previousState => (
            {token: this.props.screenProps.token, images: null}
        ));
        this.timeout = 0;
    }

    loading()
    {
        if(this.state.loading === true) {
            return (
                <View>
                    <ActivityIndicator size="large" color="#0000ff" />
                </View>
            );
        }
    }

    render() {
        return(
            <View>
                {/*<Text style={{fontSize: 16, fontWeight:"500", color:'#345C70'}}>TA MERE</Text>*/}
            </View>
        )
    }
}

export default Comments;
