import React, {Component} from 'react';
import {Button, Image, Text, TextInput, View, PermissionsAndroid, ActivityIndicator} from 'react-native';
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
            return (<Button title="Submit" onPress={this.uploadFile}>

            </Button>)
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
                    <Text>Upload images</Text>
                    <Text>
                        Title:
                    </Text>
                    <View>
                        <TextInput
                            style={{height: 40, borderColor: 'gray', borderWidth: 1}}
                            onChangeText={text => {
                                this.setState({
                                    title: text
                                });
                                console.log(text)
                            }
                            }
                            value={this.state.title}
                        />
                    </View>
                    <Button title="Choose File" onPress={this.selectFile.bind(this)}/>
                    <Image
                        source={{uri: this.state.filePath.uri}}
                        style={{width: 250, height: 250}}
                    />
                    {this.submit()}
                    {this.success()}
                    {this.displayError()}
                </View>
            );
        }
    }
}

export default Upload;
