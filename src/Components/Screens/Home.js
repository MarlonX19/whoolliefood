import React, { Component } from 'react';
import { StyleSheet, View, Image, TouchableOpacity, StatusBar } from 'react-native';
import { Actions } from 'react-native-router-flux';
import { ringBell } from '../../Config/Functions';
import axios from 'axios';
import GLOBALS from '../../Config/Config';
import Pusher from 'pusher-js/react-native';

Pusher.logToConsole = true;

var pusher = new Pusher('7a6218b4df87abcc1c7c', {
    cluster: 'us2',
    forceTLS: true
});

class Home extends Component {

    render() {
        return (
            <View style={styles.container}>
                <StatusBar
                    hidden
                />
                <View>
                    <TouchableOpacity
                        onPress={() => Actions.Categories()}
                    >
                        <Image style={styles.imgMenu} source={require('../imgs/menu.png')} />
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={() => Actions.OpenBill()}
                    >
                        <Image style={styles.imgMenu} source={require('../imgs/purse.png')} />
                    </TouchableOpacity>
                </View>
                <View>
                    <TouchableOpacity
                        onPress={() => Actions.Cart()}
                    >
                        <Image style={styles.imgMenu} source={require('../imgs/cart.png')} />
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={() => ringBell()}
                    >
                        <Image style={styles.imgMenu} source={require('../imgs/bellIcon.png')} />
                    </TouchableOpacity>
                </View>
            </View>
        );
    }
}

export default Home;

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#fff',
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center'
    },

    imgMenu: {
        margin: 20,
        width: 120,
        height: 120
    }

})
