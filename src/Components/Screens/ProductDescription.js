import React, {Component} from 'react';
import { View, Text, StyleSheet, ActivityIndicator, Image, TouchableWithoutFeedback, Alert, TouchableOpacity } from 'react-native';
import axios from 'axios';
import { Actions } from 'react-native-router-flux';
import GLOBALS from '../../Config/Config';
import { convert } from '../../Config/Functions';

export default class Categories extends Component {

    constructor(props){ 
        super(props) 

        this.state = { 
            productInfo: [],
            qtdProduct: 1,
            isButtonPressed: false,
            loadedScreen: false

            };
    }

    
    componentWillMount() {
       this._loadInfo();
    }

    componentDidUpdate(prevProps) {
        if(this.props.idProduct !== prevProps.idProduct){
            this.setState({ qtdProduct: 1 })
            this._loadInfo();
        }
    }


    _countQuantity(operation) {
        if (operation == 'plus') {
            this.setState({ qtdProduct: this.state.qtdProduct + 1 })
        } else {
            if (this.state.qtdProduct > 1) {
                this.setState({ qtdProduct: this.state.qtdProduct - 1 })
            }
        }
    }

    _loadInfo() {
        var self = this;
        // requisicao http usando axios
        axios.get(`${GLOBALS.BASE_URL}/api/products/${this.props.idProduct}`)
            .then(function (response) {
                var temp = [];
                response.data.forEach(element => {
                    temp.push(element)
                });
                self.setState({ productInfo: temp, loadedScreen: true })
                console.log(self.state.productInfo);
            })
            .catch(function (error) {
                // handle error
                console.log(error);
            })

    }

    _addItemToCart(){
        var self = this;

        this.setState({ isButtonPressed: true })

        axios.post(`${GLOBALS.BASE_URL}/api/cart/add`, {
            "idProduct": this.props.idProduct,
            "vlTotal": this.state.qtdProduct

        })
          .then(function (response) {
            console.log(response.data)
            self.setState({ isButtonPressed: false })
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


    _isButtonPressed() {
        if (this.state.isButtonPressed) {
            return (
                <ActivityIndicator size='large' />
            );
        } else {
            return (
                <View>
                <TouchableOpacity
                    onPress={() => this._addItemToCart()}
                >
                    <View style={{ backgroundColor: '#3cb371', borderRadius: 10, flexDirection: 'row', padding: 10 }}>
                        <Text style={styles.textButton}>Adicionar ao carrinho</Text>
                    </View>
                </TouchableOpacity>
                </View>
            );
        }
    }

  _checksIngredients() {
        if( this.state.productInfo[0].listIngredients.length > 0 ){
            console.log('diferente de falseeeee')
            console.log(this.state.productInfo)

            var temp = 'Ingredientes:\n';
            this.state.productInfo[0].listIngredients.forEach(element => {
                temp = temp  + `${element.desName} \n`
            })
            return temp;
        
        } else {
            console.log('igual a falseeeeeeee')
            console.log(this.state.productInfo)
            var temp = 'No ingredients';
            return temp;
        }
    } 


    _screenLoading() {
        if(this.state.loadedScreen){
            return (
                <View style={{ flex: 1 }}>
                    <View style={styles.child1}>
                        {/* I needed to map the productInfo by its index and then point to the property I want */}
                        <Image style={{ flexGrow: 1 }} source={{ uri: `${GLOBALS.BASE_URL}${this.state.productInfo.map(index => index.desImagePath)}` }} />
                    </View>

                    <View style={styles.child2}>
                        {/* I needed to map the productInfo by its index and then point to the property I want */}
                        <Text style={styles.title}>{this.state.productInfo.map(index => index.desName)}</Text>
                        <Text style={styles.title}>{convert(parseFloat(this.state.productInfo.map(index => index.vlUnity)))}</Text>
                    </View>

                    <View style={styles.child3}>
                        <Text style={styles.description}>{ this._checksIngredients() }</Text>
                    </View>

                    <View style={{ flex: 0.8, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff', marginTop: 3 }}>
                        <TouchableWithoutFeedback
                            onPress={() => this._countQuantity('minus')}
                        >
                            <Image style={{ width: 25, height: 25 }} source={require('../imgs/minus.png')} />
                        </TouchableWithoutFeedback>
                        <Text style={{ fontSize: 31, fontWeight: 'bold', marginLeft: 25, marginRight: 25, color: 'green' }}>{this.state.qtdProduct}</Text>
                        <TouchableWithoutFeedback
                            onPress={() => this._countQuantity('plus')}
                        >
                            <Image style={{ width: 25, height: 25 }} source={require('../imgs/plus.png')} />
                        </TouchableWithoutFeedback>
                    </View>

                    <View style={styles.child4}>
                        <View style={styles.addButton}>
                            <View style={styles.price}>
                                <Text style={styles.textPrice}>{convert(parseFloat(this.state.productInfo.map(index => index.vlUnity) * this.state.qtdProduct))}</Text>
                            </View>
                            {this._isButtonPressed()}
                        </View>
                    </View>
                </View>
            )
        } 
        else {
            return (
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                    <ActivityIndicator size='large' />
                </View>
            )
        }
    }


    render() {
        return (
            <View style={styles.container}>
               { this._screenLoading() }
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
        marginBottom: 3,
        marginTop: 3
    },

    child3: {
        flex: 3,
        padding: 10,
        backgroundColor: '#fff',
        borderRadius: 10

    },

    child4: {
        flex: 1,
        backgroundColor: '#fff'
       
    },

    title: {
        fontSize: 27,
        fontWeight: 'bold'
    },

    description: {
        fontSize: 18,
        color: 'black'
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
        padding: 2.7,
        fontSize: 21,
        fontWeight: 'bold',
        color: 'green'
    }

})