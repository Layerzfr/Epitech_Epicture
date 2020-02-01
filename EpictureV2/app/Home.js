import React, {
    Component
} from 'react';
import {Button, Image, ScrollView, View, Text} from "react-native";
import ImagePicker from 'react-native-image-picker';
class Home extends Component {

    state = {images: null, token: null, current: 'follow', currentEnd: 2, maxImage: 2, filePath: {}};

    constructor (props) {
        super(props);
        console.log('props:', props);
        this.setState(previousState => (
            {token: this.props.screenProps.token, current: 'follow'}
        ));
    }

    createFormData = (photo, body) => {
        const data = new FormData();

        data.append("photo", {
            name: photo.fileName,
            type: photo.type,
            uri:
                Platform.OS === "android" ? photo.uri : photo.uri.replace("file://", "")
        });

        Object.keys(body).forEach(key => {
            data.append(key, body[key]);
        });

        return data;
    };

    handleUploadPhoto = () => {
        fetch("https://api.imgur.com/3/upload", {
            method: "POST",
            body: this.createFormData(this.state.filePath, { userId: "123" })
        })
            .then(response => response.json())
            .then(response => {
                console.log("upload succes", response);
                alert("Upload success!");
                this.setState({ photo: null });
            })
            .catch(error => {
                console.log("upload error", error);
                alert("Upload failed!");
            });
    };

    chooseFile = () => {
        const options = {
            noData: true,
        };
        ImagePicker.showImagePicker(options, response => {
            if (response.uri) {
                this.setState(previousState => (
                    {filePath: response}
                ));
                this.handleUploadPhoto();
            }
        });
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
                    {images: responseJson["data"], current: 'follow', currentEnd: 2}
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
                                    source={{uri: 'https://i.imgur.com/' + image['cover'] + '.jpg'}}
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
        return (
            <View>
                <Button title="Follow" onPress={this.showFav}>

                </Button>
                <Button title="Popular" onPress={this.showViral}>

                </Button>
                <Button title="Choose File" onPress={this.chooseFile.bind(this)} />
                <Image
                    source={{ uri: this.state.filePath.uri }}
                />
                {this.displayImages(0)}
            </View>

    );
    }
}

export default Home
