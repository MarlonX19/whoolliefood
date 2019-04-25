import React, {Component} from 'react';
import { View, Text, StyleSheet, FlatList, Image, TouchableWithoutFeedback, Alert } from 'react-native';
import axios from 'axios';
import { Actions } from 'react-native-router-flux';

export default class Categories extends Component {

    constructor(props){ 
        super(props) 

        this.state = { 
            productInfo: [],
            qtdProduct: 0

            };
    }

    
    componentWillMount() {
        this._loadInfo();
    }

    componentDidUpdate(prevProps) {
        if(this.props.idProduct !== prevProps.idProduct){
            this._loadInfo();
        }
    }

    _loadInfo() {
        var self = this;
        // requisicao http usando axios
        axios.get(`http://technicalassist.com.br/api/products/${this.props.idProduct}`)
            .then(function (response) {
                var temp = [];
                response.data.forEach(element => {
                    temp.push(element)
                });
                self.setState({ productInfo: temp })
                console.log(self.state.productInfo);
            })
            .catch(function (error) {
                // handle error
                console.log(error);
            })

    }

    _addItemToCart(){
        var self = this;

        axios.post(`http://technicalassist.com.br/api/cart/add/${this.props.idProduct}`)
          .then(function (response) {
            console.log(response.data)
            Alert.alert(
                'Item adicionado ao carrinho!',
                'Para concluir o pedido vá até o carrinho :) ',
                [
                  {text: 'Ir ao carrinho!', onPress: () => Actions.Cart()},
                  {text: 'Incluir mais itens!', onPress: () => Actions.Categories()}
                ],
                { cancelable: true }
              )
          })
          .catch(function (error) {
            console.log(error);
          });
    }


    render() {
        return (
            <View style={styles.container}>
                <View style={styles.child1}>
                    {/* I needed to map the productInfo by its index and then point to the property I want */}
                    <Image style={{ height: 200, width: null }} source={{ uri: `http://technicalassist.com.br${this.state.productInfo.map(index => index.desImagePath)}` }} />
                </View>

                <View style={styles.child2}>
                    {/* I needed to map the productInfo by its index and then point to the property I want */}
                    <Text style={styles.title}>{this.state.productInfo.map(index => index.desName)}</Text>
                    <Text style={styles.title}>R${this.state.productInfo.map(index => index.vlUnity)}</Text>
                </View>

                <View style={styles.child3}>
                    <Text style={styles.description}>{this.state.productInfo.map(index => index.desNote)}</Text>
                </View>

                <View style={{ flex: 0.6, flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center', backgroundColor: 'red' }}>
                    <Text style={{ fontSize: 16, fontWeight: 'bold' }}>-</Text>
                    <Text style={{ fontSize: 16, fontWeight: 'bold' }}>{this.state.qtdProduct}</Text>
                    <Text style={{ fontSize: 16, fontWeight: 'bold' }}>+</Text>
                </View>

                <View style={styles.child4}>
                    <View style={styles.addButton}>
                        <View style={styles.price}>
                            <Text style={styles.textPrice}>R${this.state.productInfo.map(index => index.vlUnity)}</Text>
                        </View>
                        <TouchableWithoutFeedback
                            onPress={() => this._addItemToCart()}
                        >
                            <View style={{ backgroundColor: '#3cb371', borderRadius: 10, flexDirection: 'row', padding: 10 }}>
                                <Text style={styles.textButton}>Adicionar ao carrinho</Text>
                                <Image style={{ height: 30, width: 30 }} source={require('../imgs/shoppingKart.png')} />
                            </View>
                        </TouchableWithoutFeedback>
                    </View>
                </View>
            </View> 
        );
    }
}


const styles = StyleSheet.create({
    container: {
       flex: 1,
       marginTop: 50,
       backgroundColor: '#ebebe0'
    },

    child1: {
        flex: 3
    },

    child2: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        backgroundColor: 'white',
        borderRadius: 10,
        marginBottom: 5,
        marginTop: 5
    },

    child3: {
        flex: 3,
        padding: 10,
        backgroundColor: 'white',
        borderRadius: 10

    },

    child4: {
        flex: 1
       
    },

    title: {
        fontSize: 27,
        fontWeight: 'bold'
    },

    description: {
        fontSize: 21
    },

    addButton: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-around'
    },

    textButton: {
        fontSize: 18,
        color: '#fff',
        fontWeight: 'bold'
        
    },

    price: {
        borderWidth: 0.5,
        padding: 5,
        borderRadius: 10,
        backgroundColor: '#fff'
    },

    textPrice: {
        fontSize: 21,
        fontWeight: 'bold'
    }

})