import React, {Component} from 'react';
import { View, Modal, Text, StyleSheet, FlatList, Image, TouchableWithoutFeedback, Alert, TouchableOpacity, ActivityIndicator, TextInput } from 'react-native';
import axios from 'axios';
import { Actions } from 'react-native-router-flux';
import GLOBALS from '../../Config/Config';
import { convert } from '../../Config/Functions';


export default class Cart extends Component {
    
    constructor(props){
        super(props)

        this.state = {
            cartOptions: [],
            desNote: '',
            isCartLoaded: false,
            isButtonPressed: false,
            totalValue: 0,
            noItems: false,
            succesModalVisible: false,
            emptyCartModalVisible: false

        };
    }


    _setModalVisible(visible) {
        this.setState({ succesModalVisible: visible, emptyCartModalVisible: visible });
    }


    componentWillMount() {
        var self = this;

        axios.get(`${GLOBALS.BASE_URL}/api/cart`)
        .then(function (response) {
            console.log(response.data);
            var temp = [];
            response.data.forEach(element => {
                temp.push(element)
            });
            self.setState({ cartOptions: temp })
            if(temp.length > 0) { 
                self.setState({ isCartLoaded: true, number: 0 })
             } else {
                 self.setState({ noItems: true })
             }
            console.log(self.state.cartOptions)

        })
        .catch(function (error) {
            // handle error
            console.log(error);
        });
    }


    _sendCart(){
        var self = this;
        this.setState({ isButtonPressed: true })

        if(this.state.cartOptions.length > 0) {
        axios.post(`${GLOBALS.BASE_URL}/api/request`, {
            desNote: this.state.desNote
        })
            .then(function (response) {
                // handle success
                self.setState({ isButtonPressed: false })
                console.log(response.data);
                self.setState({ cartOptions: [], isCartLoaded: false, noItems: true, succesModalVisible: true });
              /*  Alert.alert(
                    'Pedido feito com sucesso!',
                    'Basta aguardar :)',
                    [
                        { text: 'Ok', onPress: () => Actions.Home() }
                    ],
                    { cancelable: false }
                ) */

            })
            .catch(function (error) {
                // handle error
                console.log(error.message);
            });

        } else {
            self.setState({ isButtonPressed: false, emptyCartModalVisible: true })
           /* Alert.alert(
                'Carrinho vazio!',
                'Para fazer um pedido veja o menu de opções :)',
                [
                    {text: 'Ver opções', onPress: () => Actions.Categories()},
                    {text: 'Voltar ao menu principal', onPress: () => Actions.Home()}
                ],
                { cancelable: true}
            ) */
        }
    }


    _removeItemFromCart(idProduct){
        var self = this;
        this.setState({ isButtonPressed: true })

        axios.post(`${GLOBALS.BASE_URL}/api/cart/remove/all/${idProduct}`)
        .then(function (response) {
            // handle success

            axios.get(`${GLOBALS.BASE_URL}/api/cart`)
            .then(function (response) {
                console.log(response.data);
                var temp = [];
                response.data.forEach(element => {
                    temp.push(element)
                });
                self.setState({ cartOptions: temp, isButtonPressed: false })
                if (temp.length > 0) { 
                    self.setState({ isCartLoaded: true }) 
                } else { self.setState({ isCartLoaded: false, noItems: true }) }
                console.log(self.state.cartOptions)
            })
            .catch(function (error) {
                // handle error
                console.log(error);
            });
            
        })
        .catch(function (error) {
            // handle error
            console.log(error.message);
        });
    }


    _isCartLoaded() {
        if (this.state.isCartLoaded) {
            return (
                <View style={{ flex: 1 }}>
                    <View style={{ flex: 5 }}>
                    <FlatList
                        data={this.state.cartOptions}
                        keyExtractor={(item, index) => item.desName}
                        renderItem={({ item }) =>
                            <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'flex-start', padding: 5, backgroundColor: '#fff' }}>
                                <View style={{ flex: 0.4, justifyContent: 'center' }}>
                                    <View style={{ width: 25, height: 25, justifyContent: 'center', alignItems: 'center', borderWidth: 0.6 }}>
                                        <Text style={{ color: 'green', fontSize: 18, fontWeight: 'bold' }}>{item.qtTotal}</Text>
                                    </View>
                                </View>

                                <View style={{ flex: 1.5, justifyContent: 'center' }}>
                                    <Text style={{ fontSize: 16, fontWeight: 'bold' }}>{item.desName}</Text>
                                </View>

                                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                                    <Text style={{ fontSize: 16, fontWeight: 'bold' }}>{convert(parseFloat(item.qtTotal * item.vlUnity))}</Text>
                                </View>

                                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'flex-end' }}>
                                    <TouchableOpacity
                                        onPress={() => this._removeItemFromCart(item.idProduct)}
                                    >
                                        <Image style={{ width: 30, height: 30 }} source={require('../imgs/deleteIcon.png')} />
                                    </TouchableOpacity>
                                </View>
                            </View>
                        }
                    >
                    </FlatList>
                    </View>
                    <View style={{ height: 80, flexDirection: 'row', padding: 5, margin: 15, borderWidth: 0.5, borderRadius: 10, flexWrap: 'wrap-reverse' }}>
                        <TextInput
                            style={{ flex: 1, textAlignVertical: 'top' }}
                            multiline={true}
                            numberOfLines={10}
                            placeholder='Anote aqui suas observações'
                            onChangeText={(text) => this.setState({ desNote: text })}
                            maxLength={200}
                        />
                    </View>
                </View>
            );
        }
        else {
            return (
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                    { this._noItems() }
                </View>
            );
        }
    }

    _noItems(){
        if(this.state.noItems){
            return (
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <Image style={{ width: 200, height: 200 }} source={require('../imgs/empty-cart.png')} />
                <Text style={{ fontSize: 20, fontWeight: 'bold' }}>Nenhum item no carrinho atualmente!</Text>
                </View>
            )
        }
        else {
            return (
                <ActivityIndicator size='large' />
            )
        }
    }

    _totalValue(){
        var temp = 0;
                this.state.cartOptions.forEach(element => {
                    temp = temp + element.qtTotal*element.vlUnity;
                });

      return temp;

    }

    _isButtonPressed() {
        if (this.state.isButtonPressed) {
            return (
                <ActivityIndicator size='large' />
            );
        } else {
            return (
                <View style={{ flex: 0.5, flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center', backgroundColor: '#fff' }}>
                    <View style={styles.price}>
                        <Text style={styles.textPrice}> {convert(parseFloat(this._totalValue()))}</Text>
                    </View>
                
                <TouchableWithoutFeedback
                    onPress={() => this._sendCart()}
                >
                    <View style={styles.child3}>
                        <Text style={styles.textButton}>Concluir pedido</Text>
                    </View>
                </TouchableWithoutFeedback>
                </View>
            );
        }
    }

    _loadModal(){
        if(this.state.succesModalVisible){
            return (
                <Modal
                    animationType='none'
                    transparent={true}
                    visible={this.state.succesModalVisible}
                    onRequestClose={() => {
                        Alert.alert('Modal has been closed.');
                    }}>
                    <View style={{ flex: 1, backgroundColor: 'rgba(52, 52, 52, 0.8)', justifyContent: 'center', alignItems: 'center' }}>
                        <View style={{ width: null, height: 200, borderRadius: 10, backgroundColor: '#3cb371', justifyContent: 'center', alignItems: 'stretch' }}>
                            <View style={{ flex: 3, alignItems: 'center' }}>
                                <Image style={{ width: 60, height: 60, alignSelf: 'center', margin: 10 }} source={require('../imgs/thumbsUpIcon.png')} />
                                <Text style={{ fontSize: 18, fontWeight: 'bold', margin: 5, color: 'white' }}>Pedido feito com sucesso!</Text>
                                <Text style={{ fontSize: 14, fontWeight: 'bold', margin: 5, color: 'white' }}>Basta aguardar</Text>
                            </View>
    
                            <View style={{ flex: 1, flexDirection: 'row', alignItems: 'flex-end', marginTop: 10 }}>
                                <TouchableOpacity
                                    style={{ flex: 1 }}
                                    onPress={() => {
                                        this._setModalVisible(false)
                                        Actions.Home();
                                    }}>
                                    <View style={{ paddingBottom: 12, paddingTop: 12, backgroundColor: '#fff', alignItems: 'center', borderBottomLeftRadius: 10, borderBottomRightRadius: 10 }}>
                                        <Text>Ok</Text>
                                    </View>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </Modal>
            )
        } 

        if(this.state.emptyCartModalVisible){
            return (
                <Modal
                animationType='none'
                transparent={true}
                visible={this.state.emptyCartModalVisible}
                onRequestClose={() => {
                    Alert.alert('Modal has been closed.');
                }}>
                <View style={{ flex: 1, backgroundColor: 'rgba(52, 52, 52, 0.8)', justifyContent: 'center', alignItems: 'center' }}>
                    <View style={{ width: null, height: 200, borderRadius: 10, backgroundColor: 'gold', justifyContent: 'center', alignItems: 'stretch' }}>
                        <View style={{ flex: 3, alignItems: 'center' }}>
                            <Image style={{ width: 50, height: 50, alignSelf: 'center', margin: 10 }} source={require('../imgs/neutralIcon.png')} />
                            <Text style={{ fontSize: 18, fontWeight: 'bold', margin: 5, color: 'white' }}>O carrinho está vazio!</Text>
                            <Text style={{ fontSize: 14, fontWeight: 'bold', margin: 5, color: 'white' }}>Adicione itens ao carrinho antes</Text>
                        </View>

                        <View style={{ flex: 1, flexDirection: 'row', alignItems: 'flex-end', marginTop: 10 }}>
                            <TouchableOpacity
                                style={{ flex: 1 }}
                                onPress={() => {
                                    this._setModalVisible(false)
                                    Actions.Categories();
                                }}>
                                <View style={{ paddingBottom: 12, paddingTop: 12, backgroundColor: '#fff', alignItems: 'center', borderBottomLeftRadius: 10 }}>
                                    <Text>Ver opções</Text>
                                </View>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={{ flex: 1 }}
                                onPress={() => {
                                    this._setModalVisible(false)
                                    Actions.Home();
                                }}>
                                <View style={{ paddingBottom: 12, paddingTop: 12, backgroundColor: '#fff', alignItems: 'center', borderBottomRightRadius: 10 }}>
                                    <Text>Voltar ao menu</Text>
                                </View>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
            )
        }

    }

    render() {
        return(
            <View style={styles.container}>
                {this._loadModal()}
                <View style={styles.child2}>
                    {this._isCartLoaded()}
                </View>
                {this._isButtonPressed()}
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        justifyContent: 'center',
        
    },

    textTop: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10
    },

    child2: {
        flex: 5,
        marginTop: 55
    },

    child3: {
        backgroundColor: '#3cb371',
        borderRadius: 10,
        flexDirection: 'row',
        padding: 7
    },

    textButton: {
        fontSize: 20,
        color: '#fff',
        fontWeight: 'bold'
    },

    price: {
        borderWidth: 0.5,
        padding: 7,
        borderRadius: 10,
        backgroundColor: '#fff'
    },

    textPrice: {
        fontSize: 20,
        fontWeight: 'bold',
        color: 'green'
    }
})