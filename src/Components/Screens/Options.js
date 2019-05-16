import React, {Component} from 'react';
import { View, Text, StyleSheet, FlatList, Image, TouchableWithoutFeedback, ActivityIndicator, TouchableOpacity } from 'react-native';
import axios from 'axios';
import { Actions } from 'react-native-router-flux';
import GLOBALS from '../../Config/Config';
import { convert } from '../../Config/Functions';

export default class Categories extends Component {

    constructor(props){ 
        super(props) 

        this.state = {
            options: [],
            categoryId: 0,
            loadedScreen: false

        };
    }

    
   componentWillMount() {
        this._loadOptions();
    }

    componentDidUpdate(prevProps) {
        if(this.props.idProductCategory !== prevProps.idProductCategory){
            this._loadOptions();
        }
    } 


    _loadOptions() {
        var self = this;
        // requisicao http usando axios
        axios.post(`${GLOBALS.BASE_URL}/api/filter/products`, {
            idProductCategory: this.props.idProductCategory

        })
            .then(function (response) {
                var temp = [];
                response.data.forEach(element => {
                    if(element.isActive == "1"){
                        temp.push(element)
                    }
                    
                });

                self.setState({ options: temp, loadedScreen: true })
             
            })
            .catch(function (response) {
                console.log('erro aqui');
                console.log(response.data);
            })
    }

    _screenLoading(){
        if(this.state.loadedScreen){
            return (
                <View style={{ flex: 1 }}>
                      <TouchableWithoutFeedback 
                    onPress={() => Actions.Cart()}
                >
                    <View style={styles.kart}>
                        <Text style={styles.text}>Ver carrinho de pedidos</Text>
                        <Image style={{ height: 30, width: 30 }} source={require('../imgs/shoppingKart.png')} />
                    </View>
                </TouchableWithoutFeedback>

                <View style={styles.body}>
                    <FlatList
                        data={this.state.options}
                        keyExtractor={(item, index) => item.desName}
                        numColumns={1}
                        renderItem={({ item }) =>
                    
                            <TouchableOpacity
                                onPress={() => Actions.ProductDescription({ idProduct: item.idProduct })}
                            >
                                <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 5, backgroundColor: '#E8EBE8' }}>
                                    <View style={{ flexDirection: 'column' }}>
                                        <Text style={styles.itemName}>{item.desName}</Text>
                                        <Text style={styles.itemPrice}>{convert(parseFloat(item.vlUnity))}</Text>
                                    </View>
                                    <Image style={{ width: 120, height: 120, margin: 8 }} source={{ uri: `http://technicalassist.com.br${item.desImagePath}` }} defaultSource={require('../imgs/foodIcon.png')} >
                                    </Image>
                                 
                                </View>
                            </TouchableOpacity>}
                    >
                    </FlatList>
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
       marginTop: 50
    },

    kart: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#80ccff'
    },

    text: {
        fontSize: 18,
        fontWeight: 'bold'
    },

    body: {
        flex: 9,
        flexDirection: 'column',
        justifyContent: 'center',
        backgroundColor: 'transparent'
    },

    itemName: {
        fontSize: 19,
        fontWeight: 'bold',
        color: 'black'
    },

    itemPrice: {
        fontSize: 16,
        fontWeight: 'bold',
        color: 'black',
        marginTop: 20
        }

})