import React, {Component} from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, Image, ImageBackground, Alert, ActivityIndicator } from 'react-native';
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
            loadedScreen: false

        }
    }

    componentDidMount() {
        var self = this;
        // requisição HTTP usando axios
        axios.post(`${GLOBALS.BASE_URL}/api/opened/order`)
            .then(function (res) {
                console.log(res.data)
                if (res.data.open == true) {
                    
                    var channel = pusher.subscribe(`${res.data.desChannel}`);
                    channel.bind(`close-order-id-${res.data.id}`, function(data) {
                        axios.post(`${GLOBALS.BASE_URL}/api/clear/order`)
                        .then(function (response) {
                            Actions.ClientInfo();
                            console.log('order clearned');
                        })
                        .catch(function (response) {
                            console.log('error clear order')
                        })
                    });
                    
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

    _sendClientInfo(clientName) {
        var self = this;

        this.setState({ isButtonPressed: true })

        if (clientName !== '') {

            axios.post(`${GLOBALS.BASE_URL}/api/open/order`, {
                desName: clientName
            })
                .then(function (res) {
                    console.log(res.data);

                    var channel = pusher.subscribe(`${res.data.desChannel}`);
                    channel.bind(`close-order-id-${res.data.idOrder}`, function(data) {
                        axios.post(`${GLOBALS.BASE_URL}/api/clear/order`)
                        .then(function (response) {
                            Actions.ClientInfo();
                            console.log('order clearned');
                        })
                        .catch(function (response) {
                            console.log('error clear order')
                        })
                    });

                    self.setState({ name: '', isButtonPressed: false })
                    Actions.Home();

                })
                .catch(function (res) {
                    console.log(res.response);
                    self.setState({ isButtonPressed: false })
                    alert('erro')
                })

        } else {
            self.setState({ isButtonPressed: false })
            Alert.alert('Insira um nome válido!')
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
        if(this.state.loadedScreen){
            return(
                <View style={{ flex:1, justifyContent: 'center', alignItems: 'center' }}>
                <Image style={{ width: 110, height: 110, marginBottom: 30 }} source={require('../imgs/openOrder.png')} />
                <TextInput
                    style={styles.textinput}
                    onChangeText={ text => this.setState({ name: text }) }
                    placeholder={'Insira seu nome'}
                    placeholderTextColor={'gray'}
                />
                
                {this._isButtonPressed()}
                </View>
            )
        } 
        else {
            return (
                <ActivityIndicator size='large' color= 'red' />
            )
        }
    }



    render() {
        return (
            <View style={styles.container}>
                { this._ScreenLoading() }
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
