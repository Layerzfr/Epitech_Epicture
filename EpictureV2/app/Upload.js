import React, {Component} from 'react';
import {
    StyleSheet,
    Button,
    Image,
    Text,
    TextInput,
    View,
    PermissionsAndroid,
    ActivityIndicator,
    TouchableOpacity
} from 'react-native';
import ImagePicker from 'react-native-image-picker';
import LottieView from 'lottie-react-native';

class Upload extends Component {

    state: {filePath: null, title: null, uploadStatus: false, imageData: null, imageError: null, image: {}, loading: false, success: false};

    componentDidMount(){
        // this.load();
        this.props.navigation.addListener('willFocus', this.load);
    }
    load = () => {
        console.log('MMMMHHH')
        this.state = {
            filePath: {
                uri: null
            },
            title: null,
            uploadStatus: false,
            imageData: null,
            imageError: null,
            image: {}
        };
        console.log(this.state.uploadStatus);
        this.render();
    };


    constructor(props) {
        super(props);
        this.state = {
            filePath: {
                uri: null
            },
            title: null,
            uploadStatus: false,
            imageData: null,
        }
    }

    uploadFile = () => {
        const options = {
            noData: true,
        };
        this.setState(previousState => (
            {loading: true,}
        ));


        const data = new FormData();
        data.append('image', this.state.imageData);
        data.append('title', this.state.title);
        data.append('type', 'file');

        fetch('https://api.imgur.com/3/upload', {
            method: 'POST',
            body: data,
            headers: {
                'Authorization': 'Bearer ' + this.props.screenProps.token,
            },
        }).then((response) => response.json())
            .then((responseJson) => {
                console.log('success: ', responseJson);
                this.setState(previousState => (
                    {imageError: false, uploadStatus: false, loading: false, filePath: {
                            uri: null
                        }, title: null, success: true}
                ));

            })
            .catch((error) => {
                console.error(error);
                this.setState(previousState => (
                    {imageError: true, uploadStatus: false, loading: false,}
                ));

            });
    }

    displayError() {
        if(this.state.imageError === true) {
            return (
                <View>
                    <Text>
                        Error upload
                    </Text>
                </View>
            );
        }
    }

    selectFile = async () => {

        try {
            const granted = await PermissionsAndroid.request(
                PermissionsAndroid.PERMISSIONS.CAMERA,
                {
                    title: 'Epicture',
                    message:
                        'Epicture a besoin de votre autorisation ' +
                        'pour utiliser ou prendre une photo.',
                    buttonNeutral: 'Plus tard',
                    buttonNegative: 'Annuler',
                    buttonPositive: 'OK',
                },
            );
            //
                const grantedStockage = await PermissionsAndroid.request(
                    PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
                    {
                        title: 'Epicture',
                        message:
                            'Epicture a besoin de votre autorisation ' +
                            'pour utiliser ou prendre une photo.',
                        buttonNeutral: 'Plus tard',
                        buttonNegative: 'Annuler',
                        buttonPositive: 'OK',
                    },
                );
        } catch (err) {
            console.warn(err);
        }

        ImagePicker.showImagePicker({
            title: 'Choisir un fichier',
            // customButtons: [{name: 'fb', title: 'Choose Photo from Facebook'}],
            storageOptions: {
                skipBackup: true,
                path: 'images',
            },
        }, (response) => {
            console.log('Response = ', response);

            if (response.didCancel) {
                console.log('User cancelled image picker');
            } else if (response.error) {
                console.log('ImagePicker Error: ', response.error);
            } else if (response.customButton) {
                console.log('User tapped custom button: ', response.customButton);
            } else {
                const source = { uri: response.uri };


                // this.setState({
                //     filePath: source,
                //     imageData: response.data,
                //     image: response,
                // });

                this.setState(previousState => (
                    {
                        filePath: source,
                        imageData: response.data,
                        image: response,
                    }
                ));

                console.log(this.state.filePath.uri);
            }
        });

    };

    submit() {
        if(this.state.loading === true ) {
            return (<View>
                <ActivityIndicator size="large" color="#0000ff" />
            </View>);
        } else {
            return (
                <TouchableOpacity style={styles.submit} onPress={this.uploadFile}><Text style={styles.textUpload}>Submit</Text></TouchableOpacity>
            )
        }
    }

    success() {
        if(this.state.success === true) {
            setTimeout(() => {
                this.setState(previousState => (
                    {success: false}
                ));
            }, 1500);
            return (
                <LottieView source={require('../Assert/Animation/1798-check-animation.json')} autoPlay />
            )
        } else {
            return (
                <View style={{top:'7%'}}>
                    <TouchableOpacity style={styles.upload} onPress={this.selectFile.bind(this)}><Text style={styles.textUpload}>Upload</Text></TouchableOpacity>
                    <View style={{bottom:'150%',zIndex:1, justifyContent: 'center', alignItems: 'center',}}>
                        <View style={{top:'55%',justifyContent: 'center', alignItems: 'center', width: '70%', height: '70%'}}>
                            <Image
                                source={{uri: this.state.filePath.uri}}
                                style={{zIndex:2, width: '90%', height: '90%'}}
                            />
                        </View>
                        <Image style={{bottom:'10%',width: '40%', height: '40%'}} resizeMode="contain" source={require('../Assert/PNG/Upload.png')}/>
                    </View>
                </View>
            )
        }
    }

    upload() {
        if(this.state.loading === true ) {
            return (<View>
                <ActivityIndicator size="large" color="#0000ff" />
            </View>);
        } else {
            return (
                <TouchableOpacity onPress={this.uploadFile}><Text style={styles.textUpload}>Submit</Text></TouchableOpacity>
            )
        }
    }

    render() {

        if (this.state.uploadStatus === true) {
            return (
                <View>
                    <Text>
                        Upload success !
                    </Text>
                    {this.displayError()}
                </View>
            );
        } else {

            return (
                <View>
                    <View>
                        <View style={{width: '100%', height: '70%', top:'1%'}}>
                            <Image style={{zIndex:0,width: '100%', height: '100%'}} resizeMode="contain" source={require('../Assert/PNG/UploadOutline.png')}/>
                            {this.success()}
                        </View>
                        <Text style={{textAlign:'center',padding: "2%",fontSize: 20, fontWeight:"bold", color:'#699FD3'}}>
                            Titre:
                        </Text>
                        <TextInput
                            style={{zIndex:1,alignSelf:'center', width:'95%',height: 40, borderColor: 'gray', borderWidth: 1, top:'1%'}}
                            onChangeText={(text) => {
                                this.setState({
                                    title: text
                                });
                            }
                            }
                            value={this.state.title}
                        />
                        {this.submit()}
                    </View>
                    {/*{this.success()}*/}
                    {this.displayError()}
                </View>
            );
        }
    }
}

const styles = StyleSheet.create({
    submit:{
        flex: 1,
        zIndex: 0,
        width: '35%',
        height: 40,
        borderRadius: 5,
        backgroundColor: '#699FD3',
        justifyContent: 'center',
        alignSelf: 'center',
        top: '10%'
    },
    upload:{
        zIndex: 1,
        width: '35%',
        height: 40,
        bottom: '30%',
        borderRadius: 5,
        backgroundColor: '#699FD3',
        justifyContent: 'center',
        alignSelf: 'center',
    },
    textUpload:{
        textAlign: 'center',
        fontWeight: 'bold',
        fontSize: 18,
        width: '100%',
        color:'white'
    }
});

export default Upload;

