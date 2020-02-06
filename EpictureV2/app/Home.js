import React, {
    Component
} from 'react';
import {Button, Image, ScrollView, View, Text, StyleSheet, ActivityIndicator} from 'react-native';
import ImagePicker from 'react-native-image-picker';
class Home extends Component {

    state = {images: null, token: null, current: 'follow', currentEnd: 2, maxImage: 2, filePath: {}, loading: false,};

    constructor (props) {
        super(props);
        console.log('props:', props);
        this.setState(previousState => (
            {token: this.props.screenProps.token, current: 'follow'}
        ));
    }

    componentDidMount(){
        this.props.navigation.addListener('willFocus', this.load);
    }
    load = () => {
        this.showViral();
    };


    showViral = () => {
        let token = this.state.token;
        let username = this.props.screenProps.home['url'];
        let page = 0;
        let favoritesSort = 'newest';

        this.setState(previousState => (
            {loading: true,}
        ));

        fetch('https://api.imgur.com/3/gallery/hot/viral/week/0?showViral=true&mature=false&album_previews=true', {
            method: 'GET',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + this.props.screenProps.token
            },
        }).then((response) => response.json())
            .then((responseJson) => {
                this.setState(previousState => (
                    {images: responseJson["data"], current: 'viral', loading: false,}
                ));
                this.displayImages(0);
            })
            .catch((error) => {
                console.error(error);
            });
    };

    showFav = () => {
        let token = this.state.token;
        let username = this.props.screenProps.home['url'];
        let page = 0;
        let favoritesSort = 'newest';

        fetch('https://api.imgur.com/3/account/' + username + '/favorites/' + page + '/' + favoritesSort, {
            method: 'GET',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + this.props.screenProps.token
            },
        }).then((response) => response.json())
            .then((responseJson) => {
                this.setState(previousState => (
                    {images: responseJson["data"], current: 'follow', currentEnd: 2, loading: false,}
                ));
                console.log('SUCCESS: ', responseJson);
                this.displayImages(0);
            })
            .catch((error) => {
                console.error(error);
            });
    };

    isCloseToBottom = ({ layoutMeasurement, contentOffset, contentSize }) => {
        return layoutMeasurement.height + contentOffset.y >= contentSize.height - 1;
    };


    displayImages(pages) {
        let count = 0;
        if(this.state.loading === true) {
            return (
                <View>
                    <ActivityIndicator size="large" color="#0000ff" />
                </View>
            );
        } else if (this.state.images != null) {
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
                                    source={{uri: 'https://i.imgur.com/' + image['cover'] + '.jpg'}}
                                />
                                <View>
                                    <Button title='Fav/Unfav' onPress={() => this.unfav(image['id'])}/>
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
                                <View>

                                </View>
                            </View>

                        );
                    }
                    count++;

                })}
            </ScrollView>
        }
    }

    unfav = (id) => {

        fetch('https://api.imgur.com/3/album/'+id+'/favorite', {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + this.props.screenProps.token
            },
        }).then((response) => response.json())
            .then((responseJson) => {
                this.showFav();
            })
            .catch((error) => {
                console.error(error);
            });
    };

    wave = {
      if (current) {

      }
    };

    loading()
    {
        if(this.state.images === null) {
            return (
                <View>
                    <ActivityIndicator size="large" color="#0000ff" />
                </View>
            );
        }
    }

    render() {
        return (
            <View>
                {this.displayImages(0)}
                {/*<View style={styles.wave}>
                    <Image style={{right: 12,height: '50%', width: '50%'}} source={require('../Assert/PNG/wave.png')}/>
                </View>*/}
            </View>

    );
    }
}

/*const styles = StyleSheet.create({
    wave: {
        zIndex: 10,
        display: 'flex',
        width: '50%',
        height: 45,
        left: 0,
        right: 600,
        top: 292,
        marginTop: 350,
    }
});*/

export default Home
