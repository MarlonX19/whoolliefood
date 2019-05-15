import React from 'react';
import { StyleSheet, View, Image, TouchableOpacity, StatusBar } from 'react-native';
import { Actions } from 'react-native-router-flux';
import { ringBell } from '../../Config/Functions';

const Home = () => {
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
                    onPress={() => ringBell()} //Yet to be implemented
                >
                    <Image style={styles.imgMenu} source={require('../imgs/bellIcon.png')} />
                </TouchableOpacity>
            </View>
        </View>
    );
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
