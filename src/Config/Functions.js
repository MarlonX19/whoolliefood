import axios from 'axios';




export const convert = (value) => {
    return "R$ " + value.toFixed(2).replace('.', ',').replace(/(\d)(?=(\d{3})+\,)/g, "$1.");
}

export const destroyAll = () => {
    alert('Destroi tudo e pede novo login...');
}


export const ringBell = () => {
    axios.post("http://technicalassist.com.br/api/order/ringbell")
        .then(function (response) {
            alert('O garçon foi acionado!')

        })
        .catch(function (error) {
            // handle error
            alert('Erro');
        });
}