import Home from './Home';
import Profile from './Profile';
import {createMaterialBottomTabNavigator} from 'react-navigation-material-bottom-tabs';
import {createAppContainer} from 'react-navigation';
import Search from './Search';

const NavbarContainer = createMaterialBottomTabNavigator(
    {
        Home: {screen: Home},
        Profile: { screen: Profile},
        Search: { screen: Search},
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
