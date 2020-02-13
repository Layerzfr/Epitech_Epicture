import React, {Component} from "react";
import {
    ActivityIndicator, Button,
    Image,
    Picker,
    ScrollView,
    StyleSheet,
    Text, TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import Login from "./login";
import {SearchBar} from "react-native-elements";
import soundImg from "../Assert/Icon/Heart/heart.png";
import muteImg from "../Assert/Icon/Heart/heart-outline.png";
import Comments from "./Comments";
import Lightbox from 'react-native-lightbox';
import arrowUp from '../Assert/Icon/Arrow/arrow.png';
import isUp from '../Assert/Icon/Arrow/arrowUpGreen.png';
import arrowDown from '../Assert/Icon/Arrow/arrowDown.png';
import isDown from '../Assert/Icon/Arrow/arrowDownRed.png';

class Search extends Component {

    state = {search: null, token: null, maxImage: 2, sort: 'viral', date: 'all', loading: false,
        comment: null, newComment: null, currentImageId: null, showUp: true, showDown: false,};

    constructor(props) {
        super(props);
        this.setState(previousState => (
            {token: this.props.screenProps.token, images: null}
        ));
        this.timeout = 0;
    }

    displayComment = (image) => {
        console.log('image => ', image);
        if(image !== undefined) {
            fetch('https://api.imgur.com/3/gallery/'+image['id']+'/comments/best', {
                method: 'GET',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + this.props.screenProps.token
                },
            }).then((response) => response.json())
                .then((responseJson) => {
                    console.log('SUCCESS', responseJson);
                    this.setState(previousState => (
                        {comment: responseJson, currentImageId: image['id']}
                    ));
                })
                .catch((error) => {
                    console.error(error);
                });
        }
    };

    addComment(imageId, comment) {
        const data = new FormData();
        data.append('comment', comment);
        fetch('https://api.imgur.com/3/gallery/'+imageId+'/comment', {
            method: 'POST',
            body: data,
            headers: {
                'Authorization': 'Bearer ' + this.props.screenProps.token,
            },
        }).then((response) => response.json())
            .then((responseJson) => {
                console.log('SUCCESS');
            })
            .catch((error) => {
                console.error(error);
            });
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

    displayComment(image) {
        if (image['showcomments'] === true) {
            return (<Comments comment={image['comment']}></Comments>)
        }
    }

    displaySearchImages() {
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
                        image['showcomments'] = false
                        count++;
                        return (
                            <View>
                                <View style={{flex: 1, width: 'auto', aspectRatio: 1, padding: '1%', backgroundColor: '#f3f3f3'}}>
                                    <Lightbox>
                                        <Image
                                            resizeMode={'contain'}
                                            style={{ height: '100%', width: '100%' }}
                                            source={{ uri: 'https://i.imgur.com/' + image['cover'] + '.jpg' }}
                                        />
                                    </Lightbox>
                                </View>
                                <View>
                                    <View>
                                        <View style={{left:10}}>
                                            <TouchableOpacity style={{flexDirection: 'row', alignItems: 'center'}} activeOpacity={1} onPress={() => {
                                                this.setState({ showSoundImg: !this.state.showSoundImg });
                                                image['favorite'] = !image['favorite'];
                                                this.unfav(image['id']);
                                            }}>
                                                {this.renderImage(image['favorite'])}
                                                <View style={{top: 18}}>
                                                    <Text style={{fontSize: 20, left: 8, fontWeight:"bold", color:'#689FD1'}}>
                                                        {image['favorite_count']}
                                                    </Text>
                                                </View>
                                            </TouchableOpacity>
                                        </View>
                                        <View style={{display: 'flex', flexDirection:'row', bottom:10 , left:200}}>
                                            <TouchableOpacity style={{flexDirection: 'row', alignItems: 'center'}} activeOpacity={1} onPress={() => {
                                                this.setState({ showUp: !this.state.showUp });
                                                if(image['vote'] === 'up') {
                                                    image['vote'] = null;
                                                    this.vote("veto",image['id']);
                                                } else {
                                                    image['vote'] = 'up';
                                                    this.vote("up",image['id']);
                                                }

                                            }}>
                                                <View style={{height: 25, width: 19}}>
                                                    {this.renderUp(image['vote'])}
                                                </View>
                                                <Text style={{fontSize: 20, marginTop: 1, left: 8, fontWeight:"500", color:'#689FD1'}}>
                                                    {image['ups']}
                                                </Text>
                                            </TouchableOpacity>
                                        </View>
                                        <View style={{display: 'flex', flexDirection:'row', bottom:37 , left:300}}>
                                            <TouchableOpacity style={{flexDirection: 'row', alignItems: 'center'}} activeOpacity={1} onPress={() => {
                                                this.setState({ showDown: !this.state.showDown });
                                                if(image['vote'] === 'down') {
                                                    image['vote'] = null;
                                                    this.vote("veto",image['id']);
                                                } else {
                                                    image['vote'] = 'down';
                                                    this.vote("down",image['id']);
                                                }
                                            }}>
                                                <View style={{height: 25, width: 19}}>
                                                    {this.renderDown(image['vote'])}
                                                </View>
                                                <Text style={{fontSize: 20, marginTop: 1, left: 8, fontWeight:"500", color:'#689FD1'}}>
                                                    {image['downs']}
                                                </Text>
                                            </TouchableOpacity>
                                        </View>
                                    </View>
                                </View>
                                <View style={{flex: 1, paddingBottom: '1%', paddingTop: '1%', paddingLeft:'3%',paddingRight:'3%', justifyContent: 'center', alignItems: 'flex-start',height:'auto'}}>
                                    <Text style={{fontSize: 18, fontWeight:"500", color:'#345C70'}}>
                                        <Text style={{fontWeight:"bold"}}>{image['account_url']}</Text>
                                        <Text>: {image['title']}</Text>
                                    </Text>
                                </View>
                                <View style={{flex: 2, marginBottom: '1%', marginTop: '1%', paddingLeft:'3%',paddingRight:'3%', justifyContent: 'center', alignItems: 'flex-start',height:40}}>
                                    <TouchableOpacity style={{width:'100%', height:'100%'}} onPress={() => {this.displayComment(image)}}>
                                        <Text style={{fontSize: 16, fontWeight:"500", color:'#345C70'}}>
                                            Voir les {image['comment_count']} commentaires
                                        </Text>
                                    </TouchableOpacity>
                                </View>
                                <View style={{width: '100%', height: '0.6%', backgroundColor: '#345C70', opacity:0.2}}/>
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
        if (this.state.comment !== null) {
            return (<ScrollView>
                <View style={{flexDirection: 'row',backgroundColor:'#EAEAEA', width:'100%', height:30}}>
                    <View style={{height: 25, width: 30}}>
                        <TouchableOpacity title='Retour' onPress={() => {this.setState(previousState => (
                            {comment: null, currentImageId: null, newComment: null}
                        ))}}>

                            <Image style={{height: '100%', width: '100%'}} source={require('../Assert/Icon/Arrow/arrowLeft.png')}/>
                        </TouchableOpacity>
                    </View>
                    <Text style={{fontWeight: 'bold', fontSize: 18, width: '100%', color:'black', left:'50%'}}>Comments</Text>
                </View>
                <View>
                    <TextInput
                        placeholder= 'Comment...'
                        onChangeText={text => {
                            this.setState({
                                newComment: text
                            });
                        }}/>
                    <TouchableOpacity style={{width: '100%', height: 30, backgroundColor: '#749FCD', justifyContent: 'center', alignSelf: 'center'}} title='Add a comment'
                                      onPress={() => {
                                          this.addComment(this.state.currentImageId, this.state.newComment)
                                      }}>
                        <Text style={{color: 'white',
                            fontWeight: 'bold',
                            fontSize: 20,
                            textAlign: 'center',}}>Add a comment</Text>
                    </TouchableOpacity>
                </View>
                {this.state.comment['data'].map((comment) => {
                    return(
                        <View style={{display: 'flex', width:'100%', height: 'auto', padding: '3%'}}>
                            <View>
                                <Text style={{fontSize: 17, fontWeight:"500", color:'#345C70'}}>
                                    <Text style={{fontWeight:"bold"}}>{comment.author}</Text>
                                    <Text style={{fontSize: 15, color: '#456F7F'}}>: {comment.comment}</Text>
                                </Text>
                            </View>
                        </View>
                    )
                })}
            </ScrollView>);
        } else {
            return (
                <View>
                    <SearchBar
                        inputStyle={{backgroundColor: '#EAEAEA'}}
                        containerStyle={styles.searchcontainer}
                        inputContainerStyle={{backgroundColor: '#EAEAEA'}}
                        searchIcon={{size: 25}}
                        placeholderTextColor={'#515151'}
                        placeholder="Search..."
                        onChangeText={this.searchImages}
                        value={this.state.search}
                    />
                    <View style={styles.picker}>
                        <Picker
                            selectedValue={this.state.sort}
                            style={styles.picker01}
                            onValueChange={(itemValue, itemIndex) => {
                                this.setState({sort: itemValue});
                                if (this.state.search !== null) {
                                    this.searchImages(this.state.search);
                                }
                            }
                            }>
                            <Picker.Item label="Top" value="top"/>
                            <Picker.Item label="Viral" value="viral"/>
                            <Picker.Item label="Time" value="time"/>
                        </Picker>
                        <Picker
                            selectedValue={this.state.date}
                            style={styles.picker02}
                            onValueChange={(itemValue, itemIndex) => {
                                this.setState({date: itemValue});
                                if (this.state.search !== null) {
                                    this.searchImages(this.state.search);
                                }
                            }
                            }>
                            <Picker.Item label="Day" value="day"/>
                            <Picker.Item label="Week" value="week"/>
                            <Picker.Item label="Month" value="month"/>
                            <Picker.Item label="Year" value="year"/>
                            <Picker.Item label="All" value="all"/>
                        </Picker>
                        <View style={{
                            backgroundColor: 'grey',
                            width: '100%',
                            height: 3,
                            position: 'absolute',
                            bottom: 0,
                            opacity: 0.5
                        }}/>
                    </View>
                    {this.displaySearchImages()}
                </View>
            )
        }
        ;
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
                console.log('SUCCESS');
            })
            .catch((error) => {
                console.error(error);
            });
    };

    vote = (vote, id) => {
        let token = this.state.token;
        let username = this.props.screenProps.home['url'];
        let page = 0;
        let favoritesSort = 'newest';

        fetch('https://api.imgur.com/3/gallery/'+id+'/vote/'+vote, {
            method: 'POST',
            headers: {
                'Authorization': 'Bearer ' + this.props.screenProps.token
            },
        }).then((response) => response.json())
            .then((responseJson) => {
                console.log('SUCCESS ', responseJson);
            })
            .catch((error) => {
                console.error(error);
            });
    };

    renderUp(vote) {
        if(vote === "up") {
            var imgSource = isUp;
        } else {
            var imgSource = arrowUp;
        }
        return (
            <Image style={{height: '100%', width: '100%'}} source={imgSource}/>
        );
    }

    renderDown(vote) {
        if(vote === "down") {
            var imgSource = isDown;
        } else {
            var imgSource = arrowDown;
        }
        return (
            <Image style={{height: '100%', width: '100%'}} source={imgSource}/>
        );
    }

    renderImage(isFavorite) {
        var imgSource = isFavorite? soundImg : muteImg;
        return (
            <Image style={{top: 20,zIndex: 1, height: 32, width: 35}} source={ imgSource }/>);
    };
}

const styles = StyleSheet.create({
    searchcontainer: {
        backgroundColor: 0,
        borderWidth: 0,
        borderBottomColor: 'transparent',
        borderTopColor: 'transparent'
    },
    picker: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        width: '100%',
        height: 40
    },
    picker01: {
        flex: 1,
        alignItems: 'center',
        height: 35,
        width: '10%',
        margin: '10%'
    },
    picker02: {
        flex: 1,
        alignItems: 'center',
        height: 35,
        width: '10%',
        margin: '10%'
    }
});

export default Search;
