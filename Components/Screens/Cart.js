import React, {Component} from 'react';
import { View, Text, StyleSheet, FlatList, Image, TouchableWithoutFeedback, Alert } from 'react-native';
import axios from 'axios';
import { Actions } from 'react-native-router-flux';



export default class Cart extends Component {
    
    constructor(props){
        super(props)


        this.state = {
            cartOptions: []
        }
    }

    render() {
        return(
            <View style={styles.container}>
                <View style={styles.child1}>
                    <Text style={styles.textTop}>Confirme o preparo no botão abaixo</Text>
                </View>

                <View style={styles.child2}>
                    
                </View>

                <TouchableWithoutFeedback
                onPress={() => Alert.alert('Pedido feito com sucesso, basta aguardar!')}
                >
                <View style={styles.child3}>
                    <Text style={styles.textBottom}>Concluir pedido</Text>
                </View>
                </TouchableWithoutFeedback>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#ebebe0',
        justifyContent: 'center',
        
    },

    child1: {
        flex: 1,
        justifyContent: 'flex-end',
        alignItems: 'center',
        backgroundColor: '#80ccff'
    },

    textTop: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 15
    },

    child2: {
        flex: 5
    },

    child3: {
        flex: 0.5,
        backgroundColor: 'green',
        justifyContent: 'center',
        alignItems: 'center'
    },

    textBottom: {
        fontSize: 23,
        fontWeight: 'bold',
        color: '#fff'
    }
})