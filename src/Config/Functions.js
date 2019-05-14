export const convert = (value) => {
    return "R$ " + value.toFixed(2).replace('.', ',').replace(/(\d)(?=(\d{3})+\,)/g, "$1.");
}

export const destroyAll = () => {
    alert('Destroi tudo e pede novo login...');
}


export const ringBell = () => {
    alert('Implementar código de chamar garçon aqui');
}