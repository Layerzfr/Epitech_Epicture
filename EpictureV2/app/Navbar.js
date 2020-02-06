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

    let currentPage;

const NavbarContainer = createMaterialBottomTabNavigator(
    {
        Home: {
            screen: Home,
            navigationOptions: {
                tabBarOnPress: ({navigation, defaultHandler}) => {
                    currentPage = Home;
                    defaultHandler();
                },
                tabBarLabel: ' ',
                tabBarIcon: () => {
                    if (currentPage == Home) {
                        return (<View style={styles.base}>
                            <Icon color={'#589FD5'} size={40} name={'home'}/>
                        </View>)
                    } else {
                        return (<View style={styles.hidden}>
                            <Icon color={'#1573AD'} size={30} name={'home-current'}/>
                        </View>)
                    }
                },
            }
        },
        Search: {
            screen: Search,
            navigationOptions: {
                tabBarOnPress: ({navigation, defaultHandler}) => {
                    currentPage = Search;
                    defaultHandler();
                },
                tabBarLabel: ' ',
                tabBarIcon: () => {
                    if (currentPage == Search) {
                        return (<View style={styles.base}>
                            <Icon color={'#589FD5'} size={40} name={'search-noline'}/>
                        </View>)
                    } else {
                        return (<View style={styles.hidden}>
                            <Icon color={'#1573AD'} size={30} name={'search-line'}/>
                        </View>)
                    }
                },
            }
        },
        Upload: {
            screen: Upload,
            navigationOptions: {
                tabBarOnPress: ({navigation, defaultHandler}) => {
                    currentPage = Upload;
                    defaultHandler();
                },
                tabBarLabel: ' ',
                tabBarIcon: () => {
                    if (currentPage == Upload) {
                        return (<View style={styles.base}>
                            <Image style={{width: '100%', height: '100%'}} source={require('../Assert/Icon/Croix/circleNoOutline.svg')}/>
                        </View>)
                    } else {
                        return (<View style={styles.hidden}>
                            <Image style={{width: '100%', height: '100%'}} source={require('../Assert/Icon/Croix/circleOutline.svg')}/>
                        </View>)
                    }
                },
            }
        },
        Favorite: {
            screen: Favorite,
            navigationOptions: {
                tabBarOnPress: ({navigation, defaultHandler}) => {
                    currentPage = Favorite;
                    defaultHandler();
                },
                tabBarLabel: ' ',
                tabBarIcon: () => {
                    if (currentPage == Favorite) {
                        return (<View style={styles.base}>
                            <Icon color={'#589FD5'} size={40} name={'favorite'}/>
                        </View>)
                    } else {
                        return (<View style={styles.hidden}>
                            <Icon color={'#1573AD'} size={30} name={'favorite-border'}/>
                        </View>)
                    }
                },
            }
        },
        Profile: {
            screen: Profile,
            navigationOptions: {
                tabBarOnPress: ({navigation, defaultHandler}) => {
                    currentPage = Profile;
                    defaultHandler();
                },
                tabBarLabel: ' ',
                tabBarIcon: () => {
                    if (currentPage == Profile) {
                        return (<View style={styles.base}>
                            <Icon color={'#589FD5'} size={40} name={'person'}/>
                        </View>)
                    } else {
                        return (<View style={styles.hidden}>
                            <Icon color={'#1573AD'} size={30} name={'person-outline'}/>
                        </View>)
                    }
                },
            }
        },
    },
    {
        initialRouteName: 'Home',
        activeColor: 'white',
        inactiveColor: 'grey',
        barStyle: {backgroundColor: '#0F353F', height:50},
    }
);

const styles = StyleSheet.create({
    image: {
        zIndex: 1,
        display: 'flex',
        backgroundColor: 'red'

    },
    base: {
        alignItems:'center',
        width:50,
        height:100,
        bottom:10
    },
    hidden: {
        alignItems:'center',
        width:50,
        height:100,
        bottom:5
    },
});

const Navbar = createAppContainer(NavbarContainer);

export default Navbar;
