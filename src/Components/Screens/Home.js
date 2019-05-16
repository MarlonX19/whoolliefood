import React, { Component } from 'react';
import { StyleSheet, View, Image, TouchableOpacity, StatusBar, Text } from 'react-native';
import { Actions } from 'react-native-router-flux';
import { ringBell } from '../../Config/Functions';

class Home extends Component {

    render() {
        return (
            <View style={styles.container}>
                <StatusBar
                    hidden
                />
                <View>
                    <View style={styles.cards}>
                        <TouchableOpacity
                            onPress={() => Actions.Categories()}
                        >
                            <Image style={styles.imgMenu} source={require('../imgs/menu.png')} />
                        </TouchableOpacity>
                        <Text style={{ fontSize: 14 }}>MENU</Text>
                    </View>

                    <View style={styles.cards}>
                        <TouchableOpacity
                            onPress={() => Actions.OpenBill()}
                        >
                            <Image style={styles.imgMenu} source={require('../imgs/purse.png')} />
                        </TouchableOpacity>
                        <Text style={{ fontSize: 14 }}>Comanda aberta</Text>
                    </View>
                </View>
                <View>
                    <View style={styles.cards}>
                        <TouchableOpacity
                            onPress={() => Actions.Cart()}
                        >
                            <Image style={styles.imgMenu} source={require('../imgs/cart.png')} />
                        </TouchableOpacity>
                        <Text style={{ fontSize: 14 }}>Carrinho de pedidos</Text>
                    </View>
                    <View style={styles.cards}>
                        <TouchableOpacity
                            onPress={() => ringBell()}
                        >
                            <Image style={styles.imgMenu} source={require('../imgs/bellIcon.png')} />
                        </TouchableOpacity>
                        <Text style={{ fontSize: 14 }}>Chamar garçon</Text>
                    </View>
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
    },

    cards: {
        flexDirection: 'column',
        justifyContent: 'flex-start',
        alignItems: 'center'
        
    }

})
