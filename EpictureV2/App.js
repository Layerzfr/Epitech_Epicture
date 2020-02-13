/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React from 'react';
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Text,
  StatusBar,
  Linking,
  AsyncStorage,
} from 'react-native';

import Navbar from './app/Navbar';

import {
  Header,
  LearnMoreLinks,
  Colors,
  DebugInstructions,
  ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';
import Login from './app/login';
import {createMaterialBottomTabNavigator} from 'react-navigation-material-bottom-tabs';
import Home from './app/Home';
import global from './app/global';

const Test = createMaterialBottomTabNavigator(
    {
      Home: {screen: Home},
    },
        {
          initialRouteName: 'Home',
          activeColor: '#f0edf6',
          inactiveColor: '#3e2465',
          barStyle: { backgroundColor: '#694fad' },
        }
);

class App extends React.Component{

  constructor(props) {
    super(props);
  }

  state = {logged: false, userInfo: null, search: '', photos: null, images: null, searchImages: null, token: null};

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
          console.log(match[1], match[2])
        }
        this.saveItem('userToken', {
          'userId': userId,
          'username': username,
          'token': token,
        }).then(r => {
          this.setState(previousState => (
              {logged: true, userInfo: this.getUserInfo(), token: token}
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
    return userName;
  }

  async getUserInfo() {
    let username = await this.getUserName();
    let token = await this.getToken();
    let userInfo;

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
        {logged: false, userInfo: null}
    ));
    global.screen = "Home";
  }

  searchImages = async (search) => {
    this.setState(previousState => (
        {search: search}
    ));
    let token = await this.getToken();
    fetch('https://api.imgur.com/3/gallery/search/top/all/0?q=' + search, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token
      },
    }).then((response) => response.json())
        .then((responseJson) => {
          console.log(responseJson);
          this.setState(previousState => (
              {searchImages: responseJson["data"]}
          ));
        })
        .catch((error) => {
          console.error(error);
        });
  };

  async showFav() {
    let token = await this.getToken();
    let username = await this.getUserName();
    let page = 0;
    let favoritesSort = 'newest';

    fetch('https://api.imgur.com/3/account/' + username + '/favorites/' + page + '/' + favoritesSort, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token
      },
    }).then((response) => response.json())
        .then((responseJson) => {
          console.log(responseJson);
          this.setState(previousState => (
              {images: responseJson["data"]}
          ));
        })
        .catch((error) => {
          console.error(error);
        });
  };

  displayImages() {
    if (this.state.images != null) {
      return <ScrollView>
        {this.state.images.map((image) => {
          return (
              <Image
                  style={{width: 50, height: 50}}
                  source={{uri: 'https://i.imgur.com/' + image['cover'] + '.jpg'}}
              />
          );
        })}
      </ScrollView>
    }
  }

  displaySearchImages() {
    if (this.state.searchImages != null) {
      return <ScrollView>
        {this.state.searchImages.map((image) => {
          return (
              <Image
                  style={{width: 50, height: 50}}
                  source={{uri: 'https://i.imgur.com/' + image['cover'] + '.jpg'}}
              />
          );
        })}
      </ScrollView>
    }
  }

  render() {

    if (this.state.logged) {
      // let userInfo = this.getUserInfo();
      let userinfo = this.state.userInfo["data"];
      let images;
      if (this.state.images != null) {
        for (let data of this.state.images) {
          // console.log(data);
          // this.getImage(data['id'], token);
          images = <Image
              style={{width: 50, height: 50}}
              source={{uri: 'https://i.imgur.com/' + data['id'] + '.jpg'}}
          />;
        }
      }
      if (userinfo !== undefined) {
        console.log(userinfo);
        return (
            // <View>
            //     <SearchBar
            //         placeholder="Type Here..."
            //         onChangeText={this.searchImages}
            //         value={this.state.search}
            //     />
            //     <Image
            //         style={{width: 50, height: 50}}
            //         source={{uri: userinfo["cover"]}}
            //     />
            //     <Image
            //         style={{width: 50, height: 50}}
            //         source={{uri: userinfo["avatar"]}}
            //     />
            //     <View>
            //         {this.displayImages()}
            //         {this.displaySearchImages()}
            //     </View>
            //     <Text style={styles.welcome}>Welcome {userinfo["url"]}!</Text>
            //     <Button title="Show my fav" onPress={() => {
            //         this.showFav();
            //     }}/>
            //     <Button title="Se déconnecter" onPress={() => {
            //         this.disconnect()
            //     }}/>
            // </View>
            // <test.Navigator>
            //   <test.Screen name="Home" component={Home} />
            // </test.Navigator>
            // <Home image={images} home={userinfo} token={this.state.token}></Home>
            // <Search token={this.state.token}>
            //
            // </Search>
            <Navbar screenProps={{ home: userinfo, token: this.state.token, disconnect: () => {
                this.disconnect();
              } }}></Navbar>
        );
      } else {

        return (
            <Login></Login>
        );
      }
    } else {
      return (
          <Login></Login>
      );
    }
  }

}

const styles = StyleSheet.create({
  scrollView: {
    backgroundColor: Colors.lighter,
  },
  engine: {
    position: 'absolute',
    right: 0,
  },
  body: {
    backgroundColor: Colors.white,
  },
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: Colors.black,
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
    color: Colors.dark,
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
});

export default App;
