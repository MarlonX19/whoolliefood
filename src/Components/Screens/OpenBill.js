import React, {Component} from 'react';
import { StyleSheet, Text, View, FlatList, Image, ImageBackground, Alert, ActivityIndicator, Button} from 'react-native';
import axios from 'axios';
import { Actions} from 'react-native-router-flux';
import GLOBALS from '../../Config/Config';
import { convert, destroyAll } from '../../Config/Functions';

export default class Login extends Component {
    constructor(props) {
        super(props)

        this.state = {
            requests: [],
            isButtonPressed: false,
            color: 1,
            hasRequests: false

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
                if(temp.length >= 1) {
                    self.setState({ requests: temp, hasRequests: true })
                } 

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

    _listing(items) {
        var tempo = '';

        items.forEach(element => {
            tempo = tempo + `${element.qtProduct} x ${convert(parseFloat(element.vlUnity))} ${element.desName} \n`
            console.log(element)
        })

        return tempo;

    }

    _showObs(itemObs){
        if(itemObs !== ''){
            return `OBS: ${itemObs}`
        } else {
            return '';
        }
    }

    _requestStatus(status){
        if(status == "1"){
            return <Text style={{ color: 'green', marginLeft: 5 }}>Concluído</Text> 
        } else {
            return <Text style={{ color: '#9D6F1D', marginLeft: 5 }}>Em andamento</Text> 
        }
    }

    _hasRequests(){
        if(this.state.hasRequests){
            return (
                <View style={{ flex: 1 }}>
                <View style={styles.orderedItems}>
                    <FlatList
                        data={this.state.requests}
                        keyExtractor={(item) => item.idRequest}
                        renderItem={({ item }) =>
                            <View style={styles.items}>
                                <View style={{flex: 1, flexDirection: 'row', justifyContent: 'space-between', borderBottomWidth: 0.5, backgroundColor: '#F8F8F8', padding: 5 }}>
                                    <Text style={{ fontSize: 22, fontWeight: 'bold' }}>PEDIDO Nº {item.idRequest}</Text>
                                    <Text style={{ fontSize: 22, fontWeight: 'bold' }}>TOTAL: {convert(parseFloat(item.vlTotal))}</Text>
                                </View>
                                
                                <View style={{ backgroundColor: "#fff", padding: 5 }}>
                                    <Text style={{ fontSize: 18 }}>{this._listing(item.listProducts)}</Text>
                                    <Text style={{ fontSize: 13, fontStyle: 'italic' }}>{this._showObs(item.desNote)}</Text>
                                </View>

                                <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#F8F8F8' }}>
                                    <View>
                                        {this._requestStatus(item.vlStatus)}
                                    </View>
                                    <View style={{ flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center' }}>
                                        <Image style={{ width: 15, height: 15 }} source={require('../imgs/clock.png')} />
                                        <Text style={{ margin: 5 }}>{item.dtRegister.substring(0, 16)}</Text>
                                    </View>
                                </View>

                            </View>

                        }
                    >
                    </FlatList>

                </View>
                <View style={styles.totalPrice}>
                    <Text style={{ fontSize: 18, color: 'black' }}>TOTAL: {convert(this._totalValue())}</Text>
                        <Button
                            title='Encerrar'
                            color='#ccc'
                            onPress={() => destroyAll()}
                            style={{ alignSelf: 'flex-end' }}
                        />
                </View>
            </View>
            )
        } else {
            return (
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                    <Image style={{ width: 150, height: 150 }} source={require('../imgs/hasRequests.png')} />
                    <Text style={{ fontSize: 16, fontWeight: 'bold' }}>Você não fez nenhum pedido ainda!</Text>
                </View>
            )
        }
    }


    render() {
        return (
            <View style={styles.container}>
                {this._hasRequests()}
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff'
    },

    orderedItems: {
        flex: 9,
        marginTop: 55
    },

    items: {
        flex: 1,
        flexDirection: 'column',
        margin: 5,
        padding: 0,
        borderWidth: 0.3,
        borderRadius: 5
    },

    totalPrice: {
        flex: 1,
        flexDirection: 'row',
        padding: 3,
        justifyContent: 'space-around',
        alignItems: 'center',
        backgroundColor: '#fff'
    }

});