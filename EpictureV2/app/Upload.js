import React, {Component} from 'react';
import {Button, Image, Text, TextInput, View, PermissionsAndroid} from 'react-native';
import ImagePicker from 'react-native-image-picker';

class Upload extends Component {

    state: {filePath: null, title: null, uploadStatus: false, imageData: null, imageError: null, image: {}};

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


        const data = new FormData();
        data.append('image', this.state.imageData);
        data.append('title', this.state.title);
        data.append('type', 'file');

        fetch('https://api.imgur.com/3/upload', {
            method: 'POST',
            body: data,
            headers: {
                // Accept: 'application/json',
                // 'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + this.props.screenProps.token,
            },
        }).then((response) => response.json())
            .then((responseJson) => {
                console.log('success: ', responseJson);


            })
            .catch((error) => {
                console.error(error);
                this.setState(previousState => (
                    {imageError: true, uploadStatus: false,}
                ));

            });
        // if (this.state.image.didCancel) {
        //     console.log('User cancelled image picker');
        //     this.setState(previousState => (
        //         {imageError: true, uploadStatus: false,}
        //     ));
        // } else if (this.state.image.error) {
        //     console.log('ImagePicker Error: ', this.state.image.error);
        //     this.setState(previousState => (
        //         {imageError: true, uploadStatus: false,}
        //     ));
        // } else if (this.state.image.customButton) {
        //     console.log('User tapped custom button: ', this.state.image.customButton);
        //     this.setState(previousState => (
        //         {imageError: true, uploadStatus: false,}
        //     ));
        // } else {
        //     this.setState(previousState => (
        //         {uploadStatus: true, imageError: false}
        //     ));
        // }
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
                            onSubmitEditing={text => {
                                this.setState({
                                    title: text.nativeEvent.text
                                });
                            }
                            }
                            value={this.value}
                        />
                    </View>
                    <Button title="Choose File" onPress={this.selectFile.bind(this)}/>
                    <Image
                        source={{uri: this.state.filePath.uri}}
                        style={{width: 250, height: 250}}
                    />
                    <Button title="Submit" onPress={this.uploadFile}>

                    </Button>
                    {this.displayError()}
                </View>
            );
        }
    }
}

export default Upload;
