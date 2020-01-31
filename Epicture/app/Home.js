import React, {
    Component
} from 'react';
import {Button, Image, ScrollView, View, Text} from "react-native";

class Home extends Component {

    state = {images: null, token: null, current: 'follow',};

    constructor (props) {
        super(props);
        this.setState(previousState => (
            {token: this.props.token, current: 'follow'}
        ));
    }

    showViral = () => {
        let token = this.state.token;
        let username = this.props.home['url'];
        let page = 0;
        let favoritesSort = 'newest';

        fetch('https://api.imgur.com/3/gallery/hot/viral/week/0?showViral=true&mature=false&album_previews=true', {
            method: 'GET',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + this.props.token
            },
        }).then((response) => response.json())
            .then((responseJson) => {
                this.setState(previousState => (
                    {images: responseJson["data"], current: 'viral'}
                ));
                this.displayImages();
            })
            .catch((error) => {
                console.error(error);
            });
    };

    showFav = () => {
        let token = this.state.token;
        let username = this.props.home['url'];
        let page = 0;
        let favoritesSort = 'newest';

        fetch('https://api.imgur.com/3/account/' + username + '/favorites/' + page + '/' + favoritesSort, {
            method: 'GET',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + this.props.token
            },
        }).then((response) => response.json())
            .then((responseJson) => {
                this.setState(previousState => (
                    {images: responseJson["data"], current: 'follow'}
                ));
                console.log('fav => ',responseJson);
                this.displayImages();
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
                        <View>

                            <Image
                                style={{width: 500, height: 500}}
                                source={{uri: 'https://i.imgur.com/' + image['cover'] + '.jpg'}}
                            />
                            <Text>
                                {image['comment_count']} commentaires
                            </Text>

                        </View>

                    );
                })}
            </ScrollView>
        }
    }

    render() {
        return (
            <View>
                <Button title="Follow" onPress={this.showFav}>

                </Button>
                <Button title="Popular" onPress={this.showViral}>

                </Button>
                {this.displayImages()}
            </View>
        );
    }
}

export default Home