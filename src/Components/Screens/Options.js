import React, {Component} from 'react';
import { View, Text, StyleSheet, FlatList, Image, TouchableWithoutFeedback, ImageBackground, TouchableOpacity } from 'react-native';
import axios from 'axios';
import { Actions } from 'react-native-router-flux';
import GLOBALS from '../../Config/Config';

export default class Categories extends Component {

    constructor(props){ 
        super(props) 

        this.state = { 
            options: [],
            categoryId: 0

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

                self.setState({ options: temp })
             
            })
            .catch(function (response) {
                console.log('erro aqui');
                console.log(response.data);
            })
    }

    render() {
        return (
            <View style={styles.container}>
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
                        numColumns={2}
                        renderItem={({ item }) =>
                    
                            <TouchableOpacity
                                onPress={() => Actions.ProductDescription({ idProduct: item.idProduct })}
                            >
                                <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginTop: 15, borderColor: 'gray', borderWidth: 0.4, marginRight: 5, marginLeft: 5, borderRadius: 10 }}>
                                    <View style={{ margin: 2 }}>
                                    <Text style={styles.itemName}>{item.desName}</Text>
                                    <ImageBackground style={{ width: 160, height: 160, margin: 8 }}  source={{ uri: `http://technicalassist.com.br${item.desImagePath}` }}>
                                    </ImageBackground>
                                    </View>
                                </View>
                            </TouchableOpacity>}
                    >

                    </FlatList>
                </View>
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
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'transparent'
    },

    itemName: {
        fontSize: 16,
        fontWeight: 'bold',
        color: 'midnightblue',
        alignSelf: 'center'
    }

})