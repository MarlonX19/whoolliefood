import axios from 'axios';
import { Alert } from 'react-native';


export const convert = (value) => {
    return "R$ " + value.toFixed(2).replace('.', ',').replace(/(\d)(?=(\d{3})+\,)/g, "$1.");
}

export const destroyAll = () => {
    alert('Destroi tudo e pede novo login...');
}


export const ringBell = () => {
    axios.post("http://technicalassist.com.br/api/order/ringbell")
        .then(response => {
            Alert.alert('O garçon foi acionado!')

        })
        .catch(error => {
            // handle error
            alert('Erro');
        });
}