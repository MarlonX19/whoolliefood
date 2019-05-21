import React, {Component} from 'react';
import { Modal, StyleSheet, Text, View, TextInput, TouchableOpacity, Image, ImageBackground, Alert, ActivityIndicator } from 'react-native';
import axios from 'axios';
import { Actions} from 'react-native-router-flux';
import GLOBALS from '../../Config/Config';
import Pusher from 'pusher-js/react-native';

Pusher.logToConsole = true;

var pusher = new Pusher('7a6218b4df87abcc1c7c', {
    cluster: 'us2',
    forceTLS: true
});

export default class Login extends Component {

    constructor(props) {
        super(props)

        this.state = {
            name: '',
            isButtonPressed: false,
            loadedScreen: false,
            modalVisible: false

        }
    }


    _setModalVisible(visible) {
        this.setState({ modalVisible: visible });
    }


    _bindCloseOrder = (desChannel, idOrder) => {

        var channel = pusher.subscribe(`${desChannel}`);
        channel.bind(`close-order-id-${idOrder}`, function (data) {
            axios.post(`${GLOBALS.BASE_URL}/api/clear/order`)
                .then(function (response) {
                    Actions.ClientInfo();
                    console.log('order clearned');
                })
                .catch(function (response) {
                    console.log('error clear order')
                })
        });

    }


    componentDidMount() {
        var self = this;
        // requisição HTTP usando axios
        axios.post(`${GLOBALS.BASE_URL}/api/opened/order`)
            .then(function (res) {
                console.log(res.data)
                if (res.data.open == true) {

                    self._bindCloseOrder(res.data.desChannel, res.data.id);

                    Actions.Home();
                }
                else {
                    self.setState({ loadedScreen: true })
                }
            })
            .catch(function (error) {
                console.log(error);
            });
    }



    _sendClientInfo = (clientName) => {
        var self = this;

        this.setState({ isButtonPressed: true })

        if (clientName !== '') {

            axios.post(`${GLOBALS.BASE_URL}/api/open/order`, {
                desName: clientName
            })
                .then(function (res) {
                    console.log(res.data);

                    self._bindCloseOrder(res.data.desChannel, res.data.idOrder);

                    self.setState({ name: '', isButtonPressed: false })
                    Actions.Home();

                })
                .catch(function (res) {
                    console.log(res);
                    self.setState({ isButtonPressed: false })
                    alert('erro')
                })

        } else {
            self.setState({ isButtonPressed: false, modalVisible: true })
        }

    }


    _isButtonPressed() {
        if(this.state.isButtonPressed) {
            return(
                <ActivityIndicator size= 'large' />
            )
        } else {
            return (
                <TouchableOpacity
                    onPress={() => this._sendClientInfo(this.state.name)}
                >
                    <View style={{ width: 250, height: 50, alignItems: 'center', justifyContent: 'center', backgroundColor: 'green', marginTop: 2 }}>
                        <Text style={styles.button}>Abrir comanda</Text>
                    </View>
                </TouchableOpacity>
            )
        }
    }

    _ScreenLoading(){
        if (this.state.loadedScreen) {
            return (
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                    <Image style={{ width: 110, height: 110, marginBottom: 30 }} source={require('../imgs/openOrder.png')} />
                    <TextInput
                        style={styles.textinput}
                        onChangeText={text => this.setState({ name: text })}
                        placeholder={'Insira seu nome'}
                        placeholderTextColor={'gray'}
                    />
                    {this._isButtonPressed()}
                </View>
            )
        }
        else {
            return (
                <ActivityIndicator size='large' color='red' />
            )
        }
    }

    _loadModal(){
        return (
            <Modal
                animationType='none'
                transparent={true}
                visible={this.state.modalVisible}
                onRequestClose={() => {
                    Alert.alert('Modal has been closed.');
                }}>
                <View style={{ flex: 1, backgroundColor: 'rgba(52, 52, 52, 0.8)', justifyContent: 'center', alignItems: 'center' }}>
                    <View style={{ width: null, height: 200, borderRadius: 10, backgroundColor: 'yellow', justifyContent: 'center', alignItems: 'stretch' }}>
                        <View style={{ flex: 3 }}>
                            <Image style={{ width: 50, height: 50, alignSelf: 'center', margin: 10 }} source={require('../imgs/sadIcon.png')} />
                            <Text style={{ fontSize: 16, fontWeight: 'bold', margin: 20 }}>Nome inserido inválido!</Text>
                        </View>
                        <TouchableOpacity
                            style={{ flex: 1 }}
                            onPress={() => {
                                this._setModalVisible(false);
                            }}>
                            <View style={{ flex: 1, padding: 15, backgroundColor: '#fff', alignItems: 'center', borderBottomRightRadius: 10, borderBottomLeftRadius: 10 }}>
                                <Text>Tentar novamente</Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        )
    }


    render() {
        return (
            <View style={styles.container}>
                {this._loadModal()}
                {this._ScreenLoading()}
            </View>
        )
    }
}



const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff'

    },

    textinput: {
        padding: 10,
        margin: 2,
        height: 50,
        width: 250,
        borderColor: 'gray',
        borderWidth: 0.5,
        backgroundColor: '#fff',
        alignItems: 'center',
        fontSize: 22
    },

    button: {
        fontSize: 20,
        color: 'white'
    }

});
