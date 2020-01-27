import React, { Component } from "react";
import { AppRegistry, StyleSheet, Text, View, Button, Linking, AsyncStorage, Image } from "react-native";
import { SearchBar } from 'react-native-elements';

import { authorize } from 'react-native-app-auth';


class App extends Component {

    state = { logged: false, userInfo: null, search: '', photos: null };

    componentDidMount() {


        Linking.getInitialURL().then((url) => {
            let username;
            let userId;
            let token;

            if (url) {
                console.log('Initial url is: ' + url);
                let regex = /([^=#]+)=([^&#]*)/g,
                    params = {},
                    match
                while ((match = regex.exec(url))) {
                    params[match[1]] = match[2]
                    switch (match[1]) {
                        case "&account_username":
                            username = match[2];
                            break;
                        case "&account_id":
                            userId = match[2];
                            break;
                        case "access_token":
                            token = match[2];
                            break;

                    }


                    // if(match[1] == "access_token") {
                    //     this.saveItem('userToken', match[2]).then(r => {
                    //         console.log("done");
                    //     });
                    // }
                        console.log(match[1], match[2])
                }
                this.saveItem('userToken', {
                    'userId' : userId,
                    'username': username,
                    'token': token,
                }).then(r => {
                    this.setState(previousState => (
                        { logged: true, userInfo: this.getUserInfo() }
                    ));
                    console.log("done");
                });
                console.log(username);
            }
        }).catch(err => console.error('An error occurred', err));
    }

    async saveItem(item, selectedValue) {
        try {
            await AsyncStorage.setItem('token', selectedValue.token);
            await AsyncStorage.setItem('userid', selectedValue.userId);
            await AsyncStorage.setItem('username', selectedValue.username);
        } catch (error) {
            console.error('AsyncStorage error: ' + error.message);
        }
    }

    async getToken() {
        let userToken;
        await AsyncStorage.getItem('token').then((token) => {
            userToken = token;
        });
        return userToken;
    }

    async getUserId() {
        let userId;
        await AsyncStorage.getItem('userid').then((token) => {
            userId = token;
        });
        return userId;
    }

    async getUserName() {
        let userName;
        await AsyncStorage.getItem('username').then((token) => {
            userName = token;
        });
        // console.log(userToken);
        return userName;
    }

    async getUserInfo()
    {
        let username = await this.getUserName();
        let token =  await this.getToken();

        let userInfo;

        // console.log(username);
        // console.log(token);

        fetch('https://api.imgur.com/3/account/' + username, {
            method: 'GET',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token
            },
        }).then((response) => response.json())
            .then((responseJson) => {
                userInfo = responseJson;
                // console.log(userInfo);
                if (this.state.userInfo !== null) {
                    this.setState(previousState => (
                        {userInfo: userInfo}
                    ));
                }
                return userInfo;
            })
            .catch((error) => {
                console.error(error);
            });
    }

    async disconnect() {
        await AsyncStorage.clear();
        this.setState(previousState => (
            { logged: false, userInfo: null }
        ));
    }

    updateSearch(search) {
        // let token = this.getToken();
        // console.log(token);

    };

    render() {

        if (this.state.logged) {
            // let userInfo = this.getUserInfo();
            let userinfo = this.state.userInfo["data"];
            if(userinfo !== undefined) {
                console.log(userinfo);
                return (
                    <View>
                        <SearchBar
                            placeholder="Type Here..."
                            onChangeText={this.updateSearch}
                            value={this.state.search}
                        />
                        <Image
                            style={{width: 50, height: 50}}
                            source={{uri: userinfo["cover"]}}
                        />
                        <Image
                            style={{width: 50, height: 50}}
                            source={{uri: userinfo["avatar"]}}
                        />
                        <Text style={styles.welcome}>Welcome {userinfo["url"]} to React Native!</Text>
                        <Button title="Se déconnecter" onPress={() => {
                            this.disconnect()
                        }}/>
                    </View>
                );
            } else {

                return (
                    <View style={styles.container}>
                        <Text style={styles.welcome}>Welcome to React Native!</Text>
                        <SearchBar
                            placeholder="Type Here..."
                            onChangeText={this.updateSearch}
                            value={this.state.search}
                        />
                        <Button title="Get my token" onPress={() => {
                            this.getToken()
                        }}/>
                        <Button title="Se déconnecter" onPress={() => {
                            this.disconnect()
                        }}/>
                    </View>
                );
            }
        } else {
            return (
                <View style={styles.container}>
                    <Text style={styles.welcome}>Welcome to React Native!</Text>
                    <SearchBar
                        placeholder="Type Here..."
                        onChangeText={this.updateSearch}
                        value={this.state.search}
                    />
                    <Button title="Login" onPress={() => {
                        Linking.openURL('https://api.imgur.com/oauth2/authorize?client_id=52cbd80405a2505&response_type=token')
                    }}/>
                </View>
            );
        }
    }
}

const styles = StyleSheet.create({
    // container: {
    //     flex: 1,
    //     justifyContent: "center",
    //     alignItems: "center",
    //     backgroundColor: "#F5FCFF",
    // },
    welcome: {
        fontSize: 20,
        textAlign: "center",
        margin: 10,
    },
});

AppRegistry.registerComponent("Epicture", () => App);