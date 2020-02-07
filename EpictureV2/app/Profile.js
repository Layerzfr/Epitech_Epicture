import React from 'react';
import {Button, Image, ScrollView, View, StyleSheet, ImageBackground, ActivityIndicator} from 'react-native';
import {Text} from 'react-native-paper';
import Lightbox from 'react-native-lightbox';

class Profile extends React.Component {

    state: {images: null, maxImage: 2, loading: false};

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
        this.setState(previousState => (
            {loading: true}
        ));

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
                    {images: responseJson["data"], loading: false}
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
                                <Text> {image['title']}</Text>
                                <Lightbox>
                                    <Image
                                        style={{ height: '100%', width: 'auto' }}
                                        source={{ uri: 'https://i.imgur.com/' + image['id'] + '.jpg' }}
                                    />
                                </Lightbox>
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
            <ScrollView style={styles.container}>
                <View style={styles.header}>
                    <Image style={styles.backgroundImage} source={{uri: this.props.screenProps.home['cover']}}/>
                </View>
                {/*<Button onPress={this.props.screenProps.disconnect} title='disconnect'></Button>*/}
                <Image style={styles.avatar} source={{uri: this.props.screenProps.home['avatar']}}/>
                <View style={styles.body}>
                    <View style={styles.bodyContent}>
                        <Text style={styles.name}>{this.props.screenProps.home['url']}</Text>
                    </View>
                    {this.displayImages()}
                </View>
            </ScrollView>
        )
    }
}

const styles = StyleSheet.create({
    header:{
        height:200,
    },
    backgroundImage: {
        flex: 1,
        width: null,
        height: null,
        resizeMode: 'cover'
    },
    avatar: {
        width: 130,
        height: 130,
        borderRadius: 63,
        borderWidth: 4,
        borderColor: "white",
        marginBottom:10,
        alignSelf:'center',
        position: 'absolute',
        marginTop:130
    },
    name:{
        fontSize:22,
        color:"#FFFFFF",
        fontWeight:'600',
    },
    body:{
        marginTop:40,
    },
    bodyContent: {
        flex: 1,
        alignItems: 'center',
        padding:30,
    },
    name:{
        fontSize:28,
        color: "#696969",
        fontWeight: "600"
    },
    info:{
        fontSize:16,
        color: "#00BFFF",
        marginTop:10
    },
    description:{
        fontSize:16,
        color: "#696969",
        marginTop:10,
        textAlign: 'center'
    },
    buttonContainer: {
        marginTop:10,
        height:45,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom:20,
        width:250,
        borderRadius:30,
        backgroundColor: "#00BFFF",
    },
});

export default Profile;
