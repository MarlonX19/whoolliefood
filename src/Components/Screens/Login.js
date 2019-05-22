import React, {Component} from 'react';
import { Modal, StyleSheet, TouchableHighlight, Text, View, TextInput, TouchableOpacity, Image, ImageBackground, Alert, ActivityIndicator } from 'react-native';
import axios from 'axios';
import { Actions} from 'react-native-router-flux';
import GLOBALS from '../../Config/Config';


export default class Login extends Component {
    constructor(props) {
        super(props)

        this.state = {
            login: '',
            password: '',
            loading: false,
            isButtonPressed: false,
            loadedScreen: false,
            modalVisible: false
        }
    }

    _setModalVisible(visible) {
        this.setState({ modalVisible: visible });
    }

    componentDidMount() {
        var self = this;
        // requisição HTTP usando axios
        axios.get(`${GLOBALS.BASE_URL}/api/verify/login/device`)
            .then(function (response) {
                if (response.data == true) {
                    Actions.ClientInfo();                    
                } else {
                    self.setState({ loadedScreen: true })
                }

            })
            .catch(function (error) {
                console.log(error);
            });
    }



    _login = (login, password) => {
        var self = this;
        this.setState({ isButtonPressed: true })
        // requisicao http usando axios
        axios.post(`${GLOBALS.BASE_URL}/api/device/login`, {
            desLogin: login,
            desPassword: password

        })
            .then(function (response) {
                console.log(response.data.message);
                if (response.data.login) {
                    self.setState({ isButtonPressed: false })
                    Actions.ClientInfo()

                } else {
                    self.setState({ isButtonPressed: false })
                   // Alert.alert('Usuário ou senha incorretos!')
                   self.setState({ modalVisible: true })
                }
            })
            .catch(function (response) {
                self.setState({ isButtonPressed: false })
                console.log(response);
            })
    }



    _isButtonPressed() {
        if (this.state.isButtonPressed) {
            return (
                <ActivityIndicator size='large' />
            )
        } else {
            return (
                <TouchableOpacity
                    onPress={() => this._login(this.state.login, this.state.password)}
                >
                    <View style={{ width: 285, height: 50, alignItems: 'center', justifyContent: 'center', backgroundColor: 'green', marginTop: 2 }}>
                        <Text style={styles.button}>Entrar</Text>
                    </View>
                </TouchableOpacity>
            )
        }
    }



    _ScreenLoading() {
        if (this.state.loadedScreen) {
            return (
                <ImageBackground source={require('../imgs/loginScreen.jpg')} style={{ width: '100%', height: '100%' }}>
                    <View style={styles.container}>
                        <View style={styles.main}>
                            <View style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: '#f2f2f2', margin: 2, padding: 3 }}>
                                <Image style={{ width: 25, height: 25 }} source={require('../imgs/loginIcon.png')} />
                                <TextInput
                                    style={styles.textinput}
                                    onChangeText={text => this.setState({ login: text })}
                                    placeholder={'Login'}
                                    placeholderTextColor={'gray'}
                                />
                            </View>
                            <View style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: '#f2f2f2', margin: 2, padding: 3 }}>
                                <Image style={{ width: 25, height: 25 }} source={require('../imgs/passwordIcon.jpg')} />
                                <TextInput
                                    style={styles.textinput}
                                    onChangeText={text => this.setState({ password: text })}
                                    placeholder={'Senha'}
                                    placeholderTextColor={'gray'}
                                    secureTextEntry={true}
                                />
                            </View>

                            {this._isButtonPressed()}

                        </View>
                        <View style={styles.bottom}>
                            <TouchableOpacity
                                onPress={() => false}
                            >
                                <Text style={styles.textbottom}>Termos de uso</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </ImageBackground>
            )
        }
        else {
            return (
                <View>
                    <Image style={{ width: 65, height: 65, margin: 20 }} source={require('../imgs/logo.png')} />
                    <ActivityIndicator size='large' color='red' />
                </View>
            )
        }
    }

    _loadModal() {
        return (
            <Modal
                animationType='none'
                transparent={true}
                visible={this.state.modalVisible}
                onRequestClose={() => {
                    Alert.alert('Modal has been closed.');
                }}>
                <View style={{ flex: 1, backgroundColor: 'rgba(52, 52, 52, 0.8)', justifyContent: 'center', alignItems: 'center' }}>
                    <View style={{ width: null, height: 200, borderRadius: 10, backgroundColor: '#ff4500', justifyContent: 'center', alignItems: 'stretch' }}>
                        <View style={{ flex: 3 }}>
                            <Image style={{ width: 50, height: 50, alignSelf: 'center', margin: 10 }} source={require('../imgs/sadIcon.png')} />
                            <Text style={{ fontSize: 16, fontWeight: 'bold', margin: 20, color: '#fff' }}>Dados de login incorretos!</Text>
                        </View>
                        <TouchableOpacity
                            style={{ flex: 1 }}
                            onPress={() => {
                                this._setModalVisible(false);
                            }}>
                            <View style={{ flex: 1, padding: 15, backgroundColor: '#fff', alignItems: 'center', borderBottomRightRadius: 10, borderBottomLeftRadius: 10 }}>
                                <Text>Tentar de novo</Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        )
    }



    render() {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                {this._loadModal()}
                {this._ScreenLoading()}
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1

    },

    textinput: {
        padding: 10,
        margin: 2,
        height: 50,
        width: 250,
        backgroundColor: '#f2f2f2',
        alignItems: 'center'

    },

    main: {
        flex: 19,
        alignItems: 'center',
        justifyContent: 'center'
    },

    button: {
        fontSize: 24,
        color: 'white'
    },

    bottom: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'flex-end'
    },

    textbottom: {
        color: '#fff',
        fontSize: 18
    }
});
