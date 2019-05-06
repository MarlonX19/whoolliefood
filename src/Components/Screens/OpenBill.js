import React, {Component} from 'react';
import { StyleSheet, Text, View, FlatList, TouchableOpacity, Button, ImageBackground, Alert, ActivityIndicator } from 'react-native';
import axios from 'axios';
import { Actions} from 'react-native-router-flux';
import GLOBALS from '../../Config/Config';
import Pusher from 'pusher-js/react-native';

Pusher.logToConsole = true; 

var pusher = new Pusher('7a6218b4df87abcc1c7c', { 
    cluster: 'us2', 
    forceTLS: true 
}); 

var channel = pusher.subscribe('whoollie'); 
channel.bind('my-event', function(data) { 
    alert(JSON.stringify(data)); 
});

export default class Login extends Component {
    constructor(props) {
        super(props)

        this.state = {
            requests: [],
            isButtonPressed: false,
            color: 1

        }
    }

    componentDidMount() {
        var self = this;

        // requisição HTTP usando axios
        axios.get(`${GLOBALS.BASE_URL}/api/requests/current/order/data/list`)
            .then(function (response) {
                var temp = [];
                console.log(response.data);
               response.data.forEach(element => {
                   temp.push(element)
               });
                console.log(temp);

                self.setState({ requests: temp })
               
            })
            .catch(function (error) {
                console.log(error);
            });
    }

    _totalValue() {
        var temp = 0;

        this.state.requests.forEach(element => {
            temp = temp + parseInt(element.vlTotal);
        });

        return temp;

    }



    render() {
        return (
            <View style={styles.container}>
                <View style={styles.orderedItems}>
                    <FlatList
                        data={this.state.requests}
                        keyExtractor={(item) => item.idRequest}
                        renderItem={({ item }) =>
                            <View style={styles.items}>
                                <View style={{flex: 1, flexDirection: 'row', justifyContent: 'space-between' }}>
                                    <Text style={{ fontSize: 20, fontWeight: 'bold' }}>Pedido nº {item.idRequest}</Text>
                                    <Text style={{ fontSize: 20, fontWeight: 'bold' }}>Total: R$ {item.vlTotal}</Text>
                                </View>
                                <View style={{ flex: 1, flexDirection: 'row' }}>
                                    <Text style={{ fontSize: 16, margin: 5 }}>{item.listProducts.map(index => index.desName)}</Text>
                                </View>
                            </View>

                        }
                    >


                    </FlatList>

                </View>
                <View style={styles.totalPrice}>
                    <Text style={{ fontSize: 20, color: '#fff' }}>Total da conta R$ {this._totalValue()},00</Text>
                </View>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'cornsilk'
    },

    orderedItems: {
        flex: 9,
        marginTop: 60
    },

    items: {
        flex: 1,
        flexDirection: 'column',
        margin: 5
    },

    totalPrice: {
        flex: 1,
        flexDirection: 'row',
        padding: 3,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'crimson'
    }

});