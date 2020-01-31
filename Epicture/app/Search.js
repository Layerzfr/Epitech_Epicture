import React, {Component} from "react";
import {Image, ScrollView, Text, View} from "react-native";
import Login from "./login";
import {SearchBar} from "react-native-elements";

class Search extends Component {

    state = {search: null, token: null, maxImage: 2}

    constructor(props) {
        super(props);
        this.setState(previousState => (
            {token: this.props.token, images: null}
        ));
    }

    isCloseToBottom = ({ layoutMeasurement, contentOffset, contentSize }) => {
        return layoutMeasurement.height + contentOffset.y >= contentSize.height - 1;
    };

    searchImages = (search) => {
        console.log('test');
        this.setState(previousState => (
            {search: search}
        ));
        let token = this.props.token;
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
                    {images: responseJson["data"]}
                ));
                this.displaySearchImages();
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

    displaySearchImages() {
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
        // if (this.state.images != null) {
        //     return <ScrollView>
        //         {this.state.searchImages.map((image) => {
        //             return (
        //                 <Image
        //                     style={{width: 50, height: 50}}
        //                     source={{uri: 'https://i.imgur.com/' + image['cover'] + '.jpg'}}
        //                 />
        //             );
        //         })}
        //     </ScrollView>
        // }
    }

    render() {
        return(
            <View
            >
                <SearchBar
                            placeholder="Type Here..."
                            onChangeText={this.searchImages}
                            value={this.state.search}
                        />
                <Text>Search page</Text>
                {this.displaySearchImages()}

            </View>
        )
    }
}

export default Search;