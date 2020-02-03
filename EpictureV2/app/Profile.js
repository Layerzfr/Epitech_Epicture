import React from 'react';
import {Button, Image, ScrollView, View} from 'react-native';
import {Text} from 'react-native-paper';

class Profile extends React.Component {

    state: {images: null, maxImage: 2};

    componentDidMount(){
        // this.load();
        this.props.navigation.addListener('willFocus', this.load);
    }
    load = () => {
        this.showOwnImages();
    };

    constructor(props) {
        super(props);
        this.state = {
            images: null,
            maxImage: 2,
        };
    }

    isCloseToBottom = ({ layoutMeasurement, contentOffset, contentSize }) => {
        return layoutMeasurement.height + contentOffset.y >= contentSize.height - 1;
    };

    showOwnImages = () => {
        let token = this.props.screenProps.token;
        let username = this.props.screenProps.home['url'];
        console.log('oui');

        fetch('https://api.imgur.com/3/account/me/images', {
            method: 'GET',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + this.props.screenProps.token,
            },
        }).then((response) => response.json())
            .then((responseJson) => {
                this.setState(previousState => (
                    {images: responseJson["data"]}
                ));
                // console.log(responseJson["data"]);
                this.displayImages(0);
            })
            .catch((error) => {
                console.error(error);
            });
    };

    displayImages(pages) {
        let count = 0;

        if (this.state.images != null) {

            return <ScrollView onScroll={({ nativeEvent }) => {
                if (this.isCloseToBottom(nativeEvent)) {
                    this.setState(previousState => (
                        {maxImage: this.state.maxImage + 2}
                    ));
                }
            }}>

                {this.state.images.map((image) => {
                    if(count <= this.state.maxImage) {
                        count++;
                        return (
                            <View>
                                <Image
                                    style={{width: 500, height: 500}}
                                    source={{uri: 'https://i.imgur.com/' + image['id'] + '.jpg'}}
                                />
                                <View>
                                    <Text>
                                        {image['ups']} upvote
                                    </Text>
                                    <Text>
                                        {image['downs']} downvote
                                    </Text>
                                    <Text>
                                        {image['favorite_count']} fav
                                    </Text>
                                    <Text>
                                        Logo partage
                                    </Text>
                                </View>
                                <View>
                                    <Text>
                                        {image['comment_count']} commentaires
                                    </Text>
                                    <Text>
                                        Ajouter un commentaire
                                    </Text>
                                </View>
                            </View>

                        );
                    }
                    count++;

                })}
            </ScrollView>
        }
    }

    render() {
        return(
            <View >
                <Text>Profile page</Text>

                <View>
                    <Text>My images</Text>
                </View>
                {this.displayImages()}

            </View>
        )
    }
}

export default Profile;
