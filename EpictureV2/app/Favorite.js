import React, {
    Component
} from 'react';
import {Button, Image, ScrollView, View, Text, ActivityIndicator, TouchableOpacity} from 'react-native';
import ImagePicker from 'react-native-image-picker';
import soundImg from "../Assert/Icon/Heart/heart.png";
import muteImg from "../Assert/Icon/Heart/heart-outline.png";
class Favorite extends Component {

    state = {images: null, token: null, current: 'follow', currentEnd: 2, maxImage: 2, filePath: {}, loading: false, showSoundImg: true};

    constructor (props) {
        super(props);
        console.log('props:', props);
        this.setState(previousState => (
            {token: this.props.screenProps.token, current: 'follow', showSoundImg: true}
        ));
    }

    componentDidMount(){
        this.props.navigation.addListener('willFocus', this.load);
    }
    load = () => {
        this.showFav();
    };


    showViral = () => {
        let token = this.state.token;
        let username = this.props.screenProps.home['url'];
        let page = 0;
        let favoritesSort = 'newest';

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
                    {images: responseJson["data"], current: 'viral'}
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

        this.setState(previousState => (
            {loading: true}
        ));

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

    static navigationOptions = {
        header: null,
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
                                    <View>
                                        <View style={{left:10}}>
                                            <TouchableOpacity style={{flexDirection: 'row', alignItems: 'center'}} activeOpacity={1} onPress={() => {
                                                this.setState({ showSoundImg: !this.state.showSoundImg });
                                                image['favorite'] = !image['favorite'];
                                                this.unfav(image['id']);
                                            }}>
                                                {this.renderImage(image['favorite'])}
                                            </TouchableOpacity>
                                            <Image style={{bottom: 12, left: 60,height: 32, width: 37}} source={require('../Assert/Card/Logo/commenting-o.png')}/>
                                        </View>
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
                                </View>
                                <View>
                                    <Text>
                                        {image['comment_count']} commentaires
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

    render() {
        return (
            <View>
                {this.displayImages(0)}
            </View>

    );
    }

    renderImage(isFavorite) {
        var imgSource = isFavorite? soundImg : muteImg;
        return (
            <Image style={{top: 20,zIndex: 1, height: 32, width: 35}} source={ imgSource }/>);
    };
}

export default Favorite
