import React, {
    Component
} from 'react';
import {
    Text,
    Button,
    Image,
    ScrollView,
    View,
    StyleSheet,
    ImageBackground,
    ActivityIndicator,
    TouchableOpacity
} from 'react-native';
import Lightbox from 'react-native-lightbox';
import soundImg from "../Assert/Icon/Heart/heart.png";
import muteImg from "../Assert/Icon/Heart/heart-outline.png";
import Comments from "./Comments";
import AlertPro from "react-native-alert-pro";
import {Icon} from 'react-native-elements';

class Profile extends Component {

    state = {images: null, token: null, current: 'follow', currentEnd: 2, maxImage: 2, filePath: {}, loading: false, showSoundImg: true,
            imageFocus: null
    };

    constructor(props) {
        super(props);
        this.setState(previousState => (
            {token: this.props.screenProps.token, current: 'follow', showSoundImg: true}
        ));
        /*this.setState = {
            images: null, token: null, current: 'follow', currentEnd: 2, maxImage: 2, filePath: {}, loading: false, showSoundImg: true
        };*/
    }
    componentDidMount(){
        // this.load();
        this.props.navigation.addListener('willFocus', this.load);
    }
    load = () => {
        this.showOwnImages();
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

    displayComment(image) {
        if (image['showcomments'] === true) {
            return (<Comments comment={image['comment']}></Comments>)
        }
    }

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
                        image['showcomments'] = false
                        count++;
                        return (
                            <View>
                                <View style={{display: 'flex', width:'100%', height: 30, backgroundColor:'#EAEAEA'}}>
                                    <View>
                                        <TouchableOpacity style={{alignSelf: 'flex-end', right:'1%',height: '100%', width: 25}} onPress={() => {
                                            this.setState(previousState => (
                                                {imageFocus: image['id']}
                                            ));
                                            this.AlertPro.open()
                                        }}>
                                            <Icon name={'delete'} color="#419FD9" size={30}/>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                                <View style={{flex: 1, width: 'auto', aspectRatio: 1, padding: '1%', backgroundColor: '#f3f3f3'}}>
                                    <Lightbox>
                                        <Image
                                            resizeMode={'contain'}
                                            style={{ height: '100%', width: '100%' }}
                                            source={{ uri: 'https://i.imgur.com/' + image['id'] + '.jpg' }}
                                        />
                                    </Lightbox>
                                </View>
                                <View>
                                    <View>
                                        <View style={{left:10}}>
                                            <TouchableOpacity style={{flexDirection: 'row', alignItems: 'center'}} activeOpacity={1} onPress={() => {
                                                this.setState({ showSoundImg: !this.state.showSoundImg });
                                                image['favorite'] = !image['favorite'];
                                                // this.unfav(image['id']);
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
                                            <View style={{height: 25, width: 19}}>
                                                <Image style={{height: '100%', width: '100%'}} source={require('../Assert/Icon/Arrow/arrow.png')}/>
                                            </View>
                                            <Text style={{fontSize: 20, marginTop: 1, left: 8, fontWeight:"500", color:'#689FD1'}}>
                                                {image['ups']}
                                            </Text>
                                        </View>
                                        <View style={{display: 'flex', flexDirection:'row', bottom:37 , left:300}}>
                                            <View style={{height: 25, width: 19}}>
                                                <Image style={{height: '100%', width: '100%'}} source={require('../Assert/Icon/Arrow/arrowDown.png')}/>
                                            </View>
                                            <Text style={{fontSize: 20, marginTop: 1, left: 8, fontWeight:"500", color:'#689FD1'}}>
                                                {image['downs']}
                                            </Text>
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
                                    <TouchableOpacity style={{width:'100%', height:'100%'}} onPress={() => image['showcomments'] = true}>
                                        <Text style={{fontSize: 16, fontWeight:"500", color:'#345C70'}}>
                                            Voir les {image['comment_count']} commentaires
                                        </Text>
                                    </TouchableOpacity>
                                    {this.displayComment(image)}
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

    deleteImage(id){
        this.setState(previousState => (
            {loading: true,}
        ));
        fetch('https://api.imgur.com/3/image/'+id, {
            method: 'DELETE',
            headers: {
                'Authorization': 'Bearer ' + this.props.screenProps.token
            },
        }).then((response) => response.json())
            .then((responseJson) => {
                console.log('SUCCESS => ', responseJson);
                this.setState(previousState => (
                    {loading: false,}
                ));
                this.showOwnImages();
            })
            .catch((error) => {
                console.error(error);
                this.setState(previousState => (
                    {loading: false,}
                ));
            });
    }

    render() {
        let imgSource = this.state.showSoundImg? soundImg : muteImg;
        return(
            <ScrollView style={styles.container}>
                <View style={styles.header}>
                    <ImageBackground style={styles.backgroundImage} source={{uri: this.props.screenProps.home['cover']}}>
                        <View style={{zIndex:10,display: 'flex',width:'100%', height: 30}}>
                            <TouchableOpacity style={{alignSelf: 'flex-end', right:'1%', top: '20%',height: '100%', width: 25}} onPress={this.props.screenProps.disconnect} title='disconnect'>
                                <Image style={{height: '100%', width: '100%'}} source={require('../Assert/PNG/SignOut.png')}/>
                            </TouchableOpacity>
                        </View>
                    </ImageBackground>
                </View>
                <Image style={styles.avatar} source={{uri: this.props.screenProps.home['avatar']}}/>
                <View style={styles.body}>
                    <View style={styles.bodyContent}>
                        <Text style={styles.name}>{this.props.screenProps.home['url']}</Text>
                    </View>
                    <AlertPro
                        ref={ref => {
                            this.AlertPro = ref;
                        }}
                        onConfirm={() => {
                            this.deleteImage(this.state.imageFocus);
                            this.AlertPro.close()
                        }}
                        onCancel={() => this.AlertPro.close()}
                        title="Confirmation"
                        message="Etes-vous sûr de vouloir supprimer cette image ?"
                        textCancel="Annuler"
                        textConfirm="Supprimer"
                        customStyles={{
                            mask: {
                                backgroundColor: "transparent"
                            },
                            container: {
                                borderWidth: 1,
                                borderColor: "#9900cc",
                                shadowColor: "#000000",
                                shadowOpacity: 0.1,
                                shadowRadius: 10
                            },
                            buttonCancel: {
                                backgroundColor: "#4da6ff"
                            },
                            buttonConfirm: {
                                backgroundColor: "#EB301A"
                            }
                        }}
                    />
                    {this.displayImages(0)}
                </View>
            </ScrollView>
        )
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

    renderImage(isFavorite) {
        let imgSource = isFavorite? soundImg : muteImg;
        return (
            <Image style={{top: 20,zIndex: 1, height: 32, width: 35}} source={ imgSource }/>);
    };
}

const styles = StyleSheet.create({
    header:{
        height:200,
    },
    backgroundImage: {
        zIndex: 0,
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
