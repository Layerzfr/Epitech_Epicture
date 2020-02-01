import React from 'react';
import {View} from "react-native";
import {Text} from 'react-native-paper';

class Profile extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return(
            <View style={{
                zIndex: 1,
                display: 'flex',
                width: '50%',
                height: 45,
                borderRadius: 25,
                backgroundColor: '#FFFFFF',
                justifyContent: 'center',
                alignSelf: 'center',
                marginTop: 350,
            }}>
                <Text>Profile page</Text>

            </View>
        )
    }
}

export default Profile;
