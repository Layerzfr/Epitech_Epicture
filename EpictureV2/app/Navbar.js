import Home from './Home';
import Profile from './Profile';
import {createMaterialBottomTabNavigator} from 'react-navigation-material-bottom-tabs';
import {createAppContainer} from 'react-navigation';
import Search from './Search';
import Upload from './Upload';
import {colors, Icon} from 'react-native-elements';
import {Button, Image, StyleSheet, View} from 'react-native';
import React from 'react';
import Favorite from "./Favorite";
import global from './global';


const NavbarContainer = createMaterialBottomTabNavigator(
    {
        Home: {
            screen: Home,
            navigationOptions: {
                tabBarOnPress: ({navigation, defaultHandler}) => {
                    global.screen = 'Home';
                    defaultHandler();
                },
                tabBarLabel: ' ',
                tabBarIcon: () => {
                    if (global.screen == 'Home') {
                        return (<View style={styles.base}>
                            <Image style={styles.image} source={require('../Assert/Icon/Home/home-current.png')}/>
                        </View>)
                    } else {
                        return (<View style={styles.hidden}>
                            <Image style={styles.image2} source={require('../Assert/Icon/Home/home.png')}/>
                        </View>)
                    }
                },
            }
        },
        Search: {
            screen: Search,
            navigationOptions: {
                tabBarOnPress: ({navigation, defaultHandler}) => {
                    global.screen = 'Search';
                    defaultHandler();
                },
                tabBarLabel: ' ',
                tabBarIcon: () => {
                    if (global.screen == 'Search') {
                        return (<View style={styles.base}>
                            <Image style={{top:1,height: 30, width: 30, right:2}} source={require('../Assert/Icon/Search/search-line.png')}/>
                        </View>)
                    } else {
                        return (<View style={styles.hidden}>
                            <Image style={styles.image2} source={require('../Assert/Icon/Search/search-noline.png')}/>
                        </View>)
                    }
                },
            }
        },
        Upload: {
            screen: Upload,
            navigationOptions: {
                tabBarOnPress: ({navigation, defaultHandler}) => {
                    global.screen = 'Upload';
                    defaultHandler();
                },
                tabBarLabel: ' ',
                tabBarIcon: () => {
                    if (global.screen == 'Upload') {
                        return (<View style={styles.base}>
                            <Image style={styles.image} source={require('../Assert/Icon/Croix/circleNoOutline.png')}/>
                        </View>)
                    } else {
                        return (<View style={styles.hidden}>
                            <Image style={styles.image2} source={require('../Assert/Icon/Croix/circleOutline.png')}/>
                        </View>)
                    }
                },
            }
        },
        Favorite: {
            screen: Favorite,
            navigationOptions: {
                tabBarOnPress: ({navigation, defaultHandler}) => {
                    global.screen = 'Favorite';
                    defaultHandler();
                },
                tabBarLabel: ' ',
                tabBarIcon: () => {
                    if (global.screen == 'Favorite') {
                        return (<View style={styles.base}>
                            <Image style={{top:1,height: 30, width: 33, right:2}} source={require('../Assert/Icon/Heart/heart.png')}/>
                        </View>)
                    } else {
                        return (<View style={styles.hidden}>
                            <Image style={{height: 25, width: 28, right:2}} source={require('../Assert/Icon/Heart/heart-outline.png')}/>
                        </View>)
                    }
                },
            }
        },
        Profile: {
            screen: Profile,
            navigationOptions: {
                tabBarOnPress: ({navigation, defaultHandler}) => {
                    global.screen = 'Profile';
                    defaultHandler();
                },
                tabBarLabel: ' ',
                tabBarIcon: () => {
                    if (global.screen == 'Profile') {
                        return (<View style={{alignItems:'center', width:50, height:150, bottom: 12, right:5}}>
                            <Image style={{top:12, height: '23%', width: '47%'}} source={require('../Assert/Icon/Profile/profile.png')}/>
                        </View>)
                    } else {
                        return (
                                <View style={{alignItems:'center', width:50, height:150, bottom: 12, right:5}}>
                                    <Image style={{zIndex: 0,top:10, height: '18%', width: '36%'}} source={require('../Assert/Icon/Profile/profile-outline.png')}/>
                                </View>)
                    }
                },
            }
        },
    },
    {
        initialRouteName: global.screen,
        activeColor: 'white',
        inactiveColor: 'grey',
        barStyle: {backgroundColor: '#0F353F', height:53},
    }
);

const styles = StyleSheet.create({
    image: {
        height: 30,
        width: 30,
    },
    image2: {
        height: 25,
        width: 25,
    },
    base: {
        alignItems:'center',
        width:50,
        height:100,
    },
    hidden: {
        alignItems:'center',
        width:50,
        height:100,
    },
});

const Navbar = createAppContainer(NavbarContainer);

export default Navbar;
