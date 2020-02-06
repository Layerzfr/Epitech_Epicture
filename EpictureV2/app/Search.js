import React, {Component} from "react";
import {ActivityIndicator, Image, Picker, ScrollView, Text, View} from 'react-native';
import Login from "./login";
import {SearchBar} from "react-native-elements";

class Search extends Component {

    state = {search: null, token: null, maxImage: 2, sort: 'viral', date: 'all', loading: false,};

    constructor(props) {
        super(props);
        this.setState(previousState => (
            {token: this.props.screenProps.token, images: null}
        ));
        this.timeout = 0;
    }

    isCloseToBottom = ({ layoutMeasurement, contentOffset, contentSize }) => {
        return layoutMeasurement.height + contentOffset.y >= contentSize.height - 1;
    };

    searchImages = (search) => {
        this.setState(previousState => (
            {search: search, loading: true}
        ));

        if(this.timeout) clearTimeout(this.timeout);
        this.timeout = setTimeout(()=>{
            let token = this.props.screenProps.token;
            fetch('https://api.imgur.com/3/gallery/search/' + this.state.sort + '/' + this.state.date + '/0?q=' + search, {
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
                        {images: responseJson["data"], loading: false,}
                    ));
                    this.displaySearchImages();
                })
                .catch((error) => {
                    console.error(error);
                });
        }, 2000);

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
        if(this.state.loading == true) {
            return ( <View>
                <ActivityIndicator size="large" color="#0000ff" />
            </View>);
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
                                <Text>
                                    {image['title']}
                                </Text>
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

    loading()
    {
        if(this.state.loading === true) {
            return (
                <View>
                    <ActivityIndicator size="large" color="#0000ff" />
                </View>
            );
        }
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
                <Picker
                    selectedValue={this.state.sort}
                    style={{height: 50, width: 100}}
                    onValueChange={(itemValue, itemIndex) => {
                        this.setState({sort: itemValue});
                        if (this.state.search !== null) {
                            this.searchImages(this.state.search);
                        }
                    }
                    }>
                    <Picker.Item label="Top" value="top" />
                    <Picker.Item label="Viral" value="viral" />
                    <Picker.Item label="Time" value="time" />
                </Picker>
                <Picker
                    selectedValue={this.state.date}
                    style={{height: 50, width: 100}}
                    onValueChange={(itemValue, itemIndex) => {
                        this.setState({date: itemValue});
                        if (this.state.search !== null) {
                            this.searchImages(this.state.search);
                        }
                    }
                    }>
                    <Picker.Item label="Day" value="day" />
                    <Picker.Item label="Week" value="week" />
                    <Picker.Item label="Month" value="month" />
                    <Picker.Item label="Year" value="year" />
                    <Picker.Item label="All" value="all" />
                </Picker>

                {/*{this.loading()}*/}
                {this.displaySearchImages()}

            </View>
        )
    }
}

export default Search;
