import React, {Component} from 'react';
import {
  Button,
  Image,
  ScrollView,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ImageBackground,
  ActivityIndicator,
  TextInput,
} from 'react-native';
import {WebView} from 'react-native-webview';
import ImagePicker from 'react-native-image-picker';
import soundImg from '../Assert/Icon/Heart/heart.png';
import muteImg from '../Assert/Icon/Heart/heart-outline.png';
import Comments from './Comments';
import Lightbox from 'react-native-lightbox';
import styles from 'react-native-webview/lib/WebView.styles';

class Home extends Component {
  state = {
    images: null,
    token: null,
    current: 'follow',
    currentEnd: 2,
    maxImage: 2,
    filePath: {},
    showSoundImg: true,
    loading: false,
    comment: null,
    newComment: null,
    currentImageId: null,
  };

  constructor(props) {
    super(props);
    console.log('props:', props);
    this.setState(previousState => ({
      token: this.props.screenProps.token,
      current: 'follow',
      showSoundImg: true,
    }));
  }

  componentDidMount() {
    this.props.navigation.addListener('willFocus', this.load);
  }
  load = () => {
    this.showViral();
  };

  showViral = () => {
    let token = this.state.token;
    let username = this.props.screenProps.home.url;
    let page = 0;
    let favoritesSort = 'newest';

    this.setState(previousState => ({loading: true}));

    fetch(
      'https://api.imgur.com/3/gallery/hot/viral/week/0?showViral=true&mature=false&album_previews=true',
      {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + this.props.screenProps.token,
        },
      },
    )
      .then(response => response.json())
      .then(responseJson => {
        this.setState(previousState => ({
          images: responseJson['data'],
          current: 'viral',
          loading: false,
        }));
        this.displayImages(0);
      })
      .catch(error => {
        console.error(error);
      });
  };

  showAvatar(username) {
    let token = this.state.token;
    let page = 0;
    let favoritesSort = 'newest';

    fetch('https://api.imgur.com/3/account/' + username + '/avatar', {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + this.props.screenProps.token,
      },
    })
      .then(response => response.json())
      .then(responseJson => {
        console.log(responseJson.data['avatar']);
        return responseJson['data']['avatar'];
        console.log('SUCCESS: ', responseJson);
      })
      .catch(error => {
        console.error(error);
      });
  }

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

    showAvatar(username){
        let token = this.state.token;
        let page = 0;
        let favoritesSort = 'newest';

    fetch(
      'https://api.imgur.com/3/account/' +
        username +
        '/favorites/' +
        page +
        '/' +
        favoritesSort,
      {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + this.props.screenProps.token,
        },
      },
    )
      .then(response => response.json())
      .then(responseJson => {
        this.setState(previousState => ({
          images: responseJson['data'],
          current: 'follow',
          currentEnd: 2,
          loading: false,
        }));
        console.log('SUCCESS: ', responseJson);
        this.displayImages(0);
      })
      .catch(error => {
        console.error(error);
      });
  };

  isCloseToBottom = ({layoutMeasurement, contentOffset, contentSize}) => {
    return layoutMeasurement.height + contentOffset.y >= contentSize.height - 1;
  };

  static navigationOptions = {
    header: null,
  };

  displayComment = image => {
    console.log('image => ', image);
    // return (
    //     <ScrollView>
    //         {/*{image['comment'].map((comment) => {*/}
    //         {/*    console.log(comment);*/}
    //         {/*})}*/}
    //     </ScrollView>
    // )
    if (image !== undefined) {
      fetch(
        'https://api.imgur.com/3/gallery/' + image['id'] + '/comments/best',
        {
          method: 'GET',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            Authorization: 'Bearer ' + this.props.screenProps.token,
          },
        },
      )
        .then(response => response.json())
        .then(responseJson => {
          console.log('SUCCESS', responseJson);
          this.setState(previousState => ({
            comment: responseJson,
            currentImageId: image['id'],
          }));
        })
        .catch(error => {
          console.error(error);
        });
    }
  };

  displayImages(pages) {
    let count = 0;
    if (this.state.loading === true) {
      return (
        <View>
          <ActivityIndicator size="large" color="#0000ff" />
        </View>
      );
    } else if (this.state.images != null) {
      return (
        <ScrollView
          onScroll={({nativeEvent}) => {
            if (this.isCloseToBottom(nativeEvent)) {
              this.setState(previousState => ({
                maxImage: this.state.maxImage + 2,
              }));
            }
          }}>
          {this.state.images.map(image => {
            if (count <= this.state.maxImage) {
              image['showcomments'] = false;
              count++;
              return (
                <View>
                  <View style={{flex: 1, width: 'auto', aspectRatio: 1, padding: '1%', backgroundColor: '#f3f3f3'}}>
                    <Lightbox>
                      <Image
                          resizeMode={'contain'}
                        style={{height: '100%', width: '100%'}}
                        source={{
                          uri: 'https://i.imgur.com/' + image['cover'] + '.jpg',
                        }}
                      />
                    </Lightbox>
                  </View>
                  <View>
                    <View>
                      <View style={{left: 10}}>
                        <TouchableOpacity
                          style={{flexDirection: 'row', alignItems: 'center'}}
                          activeOpacity={1}
                          onPress={() => {
                            this.setState({
                              showSoundImg: !this.state.showSoundImg,
                            });
                            image.favorite = !image.favorite;
                            this.unfav(image.id);
                          }}>
                          {this.renderImage(image.favorite)}
                          <View style={{top: 18}}>
                            <Text
                              style={{
                                fontSize: 20,
                                left: 8,
                                fontWeight: 'bold',
                                color: '#689FD1',
                              }}>
                              {image.favorite_count}
                            </Text>
                          </View>
                        </TouchableOpacity>
                      </View>
                      <View
                        style={{
                          display: 'flex',
                          flexDirection: 'row',
                          bottom: 10,
                          left: 200,
                        }}>
                        <View style={{height: 25, width: 19}}>
                          <Image
                            style={{height: '100%', width: '100%'}}
                            source={require('../Assert/Icon/Arrow/arrow.png')}
                          />
                        </View>
                        <Text
                          style={{
                            fontSize: 20,
                            marginTop: 1,
                            left: 8,
                            fontWeight: '500',
                            color: '#689FD1',
                          }}>
                          {image.ups}
                        </Text>
                      </View>
                      <View
                        style={{
                          display: 'flex',
                          flexDirection: 'row',
                          bottom: 37,
                          left: 300,
                        }}>
                        <View style={{height: 25, width: 19}}>
                          <Image
                            style={{height: '100%', width: '100%'}}
                            source={require('../Assert/Icon/Arrow/arrowDown.png')}
                          />
                        </View>
                        <Text
                          style={{
                            fontSize: 20,
                            marginTop: 1,
                            left: 8,
                            fontWeight: '500',
                            color: '#689FD1',
                          }}>
                          {image.downs}
                        </Text>
                      </View>
                    </View>
                  </View>
                  <View
                    style={{
                      flex: 1,
                      paddingBottom: '1%',
                      paddingTop: '1%',
                      paddingLeft: '3%',
                      paddingRight: '3%',
                      justifyContent: 'center',
                      alignItems: 'flex-start',
                      height: 'auto',
                    }}>
                    <Text
                      style={{
                        fontSize: 18,
                        fontWeight: '500',
                        color: '#345C70',
                      }}>
                      <Text style={{fontWeight: 'bold'}}>
                        {image['account_url']}
                      </Text>
                      <Text>: {image.title}</Text>
                    </Text>
                  </View>
                  <View
                    style={{
                      flex: 2,
                      marginBottom: '1%',
                      marginTop: '1%',
                      paddingLeft: '3%',
                      paddingRight: '3%',
                      justifyContent: 'center',
                      alignItems: 'flex-start',
                      height: 40,
                    }}>
                    <TouchableOpacity
                      style={{width: '100%', height: '100%'}}
                      onPress={() => {
                        this.displayComment(image);
                      }}>
                      <Text
                        style={{
                          fontSize: 16,
                          fontWeight: '500',
                          color: '#345C70',
                        }}>
                        Voir les {image.comment_count} commentaires
                      </Text>
                    </TouchableOpacity>
                    {/*{this.displayComment(image)}*/}
                  </View>
                  <View
                    style={{
                      width: '100%',
                      height: '0.6%',
                      backgroundColor: '#345C70',
                      opacity: 0.2,
                    }}
                  />
                  <View />
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
                        image['showcomments'] = false;
                        console.log(image);
                        count++;
                        return (
                            <View>
                                <View style={{flex: 1, width: 'auto', aspectRatio: 1}}>
                                    <Lightbox>
                                        <Image
                                            style={{ height: '100%', width: 'auto' }}
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
                                                this.vote("up",image['id']);

                                            }}>
                                                <View style={{height: 25, width: 19}}>
                                                    <Image style={{height: '100%', width: '100%'}} source={require('../Assert/Icon/Arrow/arrow.png')}/>
                                                </View>
                                                <Text style={{fontSize: 20, marginTop: 1, left: 8, fontWeight:"500", color:'#689FD1'}}>
                                                    {image['ups']}
                                                </Text>
                                            </TouchableOpacity>
                                        </View>
                                        <View style={{display: 'flex', flexDirection:'row', bottom:37 , left:300}}>
                                            <TouchableOpacity style={{flexDirection: 'row', alignItems: 'center'}} activeOpacity={1} onPress={() => {
                                                this.vote("down",image['id']);
                                            }}>
                                                <View style={{height: 25, width: 19}}>
                                                    <Image style={{height: '100%', width: '100%'}} source={require('../Assert/Icon/Arrow/arrowDown.png')}/>
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
                                    {/*{this.displayComment(image)}*/}
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
  }

  unfav = id => {
    fetch('https://api.imgur.com/3/album/' + id + '/favorite', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + this.props.screenProps.token,
      },
    })
      .then(response => response.json())
      .then(responseJson => {
        console.log('SUCCESS');
      })
      .catch(error => {
        console.error(error);
      });
  };

  loading() {
    if (this.state.images === null) {
      return (
        <View>
          <ActivityIndicator size="large" color="#0000ff" />
        </View>
      );
    }
  }

  addComment(imageId, comment) {
    const data = new FormData();
    data.append('comment', comment);
    fetch('https://api.imgur.com/3/gallery/' + imageId + '/comment', {
      method: 'POST',
      body: data,
      headers: {
        Authorization: 'Bearer ' + this.props.screenProps.token,
      },
    })
      .then(response => response.json())
      .then(responseJson => {
        console.log('SUCCESS');
      })
      .catch(error => {
        console.error(error);
      });
  }

  render() {
    var imgSource = this.state.showSoundImg ? soundImg : muteImg;
    if (this.state.comment !== null) {
      return (
        <ScrollView>
          <View
            style={{
              flexDirection: 'row',
              backgroundColor: '#EAEAEA',
              width: '100%',
              height: 30,
            }}>
            <View style={{height: 25, width: 30}}>
              <TouchableOpacity
                title="Retour"
                onPress={() => {
                  this.setState(previousState => ({
                    comment: null,
                    currentImageId: null,
                    newComment: null,
                  }));
                }}>
                <Image
                  style={{height: '100%', width: '100%'}}
                  source={require('../Assert/Icon/Arrow/arrowLeft.png')}
                />
              </TouchableOpacity>
            </View>
            <Text
              style={{
                fontWeight: 'bold',
                fontSize: 18,
                width: '100%',
                color: 'black',
                left: '50%',
              }}>
              Comments
            </Text>
          </View>
          <View>
            <TextInput
              placeholder="Comment..."
              onChangeText={text => {
                this.setState({
                  newComment: text,
                });
              }}
            />
            <TouchableOpacity
              style={{
                width: '100%',
                height: 30,
                backgroundColor: '#749FCD',
                justifyContent: 'center',
                alignSelf: 'center',
              }}
              title="Add a comment"
              onPress={() => {
                this.addComment(
                  this.state.currentImageId,
                  this.state.newComment,
                );
              }}>
              <Text
                style={{
                  color: 'white',
                  fontWeight: 'bold',
                  fontSize: 20,
                  textAlign: 'center',
                }}>
                Add a comment
              </Text>
            </TouchableOpacity>
          </View>
          {this.state.comment['data'].map(comment => {
            return (
              <View
                style={{
                  display: 'flex',
                  width: '100%',
                  height: 'auto',
                  padding: '3%',
                }}>
                <View>
                  <Text
                    style={{fontSize: 17, fontWeight: '500', color: '#345C70'}}>
                    <Text style={{fontWeight: 'bold'}}>{comment.author}</Text>
                    <Text style={{fontSize: 15, color: '#456F7F'}}>
                      : {comment.comment}
                    </Text>
                  </Text>
                </View>
              </View>
            );
          })}
        </ScrollView>
      );
    } else {
      return <View>{this.displayImages(0)}</View>;
    }
  }

  renderImage(isFavorite) {
    var imgSource = isFavorite ? soundImg : muteImg;
    return (
      <Image
        style={{top: 20, zIndex: 1, height: 32, width: 35}}
        source={imgSource}
      />
    );
  }
}

export default Home;
