import Home from './Home';
import Profile from './Profile';
import {createMaterialBottomTabNavigator} from 'react-navigation-material-bottom-tabs';
import {createAppContainer} from 'react-navigation';
import Search from './Search';
import Upload from './Upload';
import {Icon} from 'react-native-elements';
import {View} from 'react-native';
import React from 'react';

const NavbarContainer = createMaterialBottomTabNavigator(
    {
        Home: {
            screen: Home,
            navigationOptions: {
                tabBarLabel: 'Home',
                tabBarIcon: ({tintColor}) => (
                <View>
                    <Icon style={[{color: tintColor}]} size={25} name={'home'}/>
                </View>),
                }
        },
        Upload: {screen: Upload,
            navigationOptions: {
                tabBarLabel: 'Upload',
                tabBarIcon: ({tintColor}) => (
                <View>
                    <Icon style={[{color: tintColor}]} size={25} name={'add'}/>
                </View>),
            }
            },
        Profile: { screen: Profile,
            navigationOptions: {
                tabBarLabel: 'Profile',
                tabBarIcon: ({tintColor}) => (
                <View>
                    <Icon style={[{color: tintColor}]} size={25} name={'person'}/>
                </View>),

                activeColor: '#615af6',
                inactiveColor: '#46f6d7',
                barStyle: { backgroundColor: '#67baf6' },
            }
            },
        Search: { screen: Search,
            navigationOptions: {
                tabBarLabel: 'Search',
                tabBarIcon: ({tintColor}) => (
                <View>
                    <Icon style={[{color: tintColor}]} size={25} name={'search'}/>
                </View>),
                activeColor: '#f60c0d',
                inactiveColor: '#f65a22',
                barStyle: { backgroundColor: '#f69b31' },
            }
            },
    },
    {
        initialRouteName: 'Home',
        activeColor: '#f0edf6',
        inactiveColor: '#3e2465',
        barStyle: { backgroundColor: '#694fad' },
    }
);

const Navbar = createAppContainer(NavbarContainer);

export default Navbar;
