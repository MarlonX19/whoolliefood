import React from 'react';
import { StatusBar, Image  } from 'react-native';
import { Router, Scene, Stack } from 'react-native-router-flux';

import Home from './Screens/Home';
import Login from './Screens/Login';
import Categories from './Screens/Categories';
import Options from './Screens/Options';
import ProductDescription from './Screens/ProductDescription';
import Cart from './Screens/Cart';
import ClientInfo from './Screens/ClientInfo';
import OpenBill from './Screens/OpenBill';


export default props => (
    <Router navigationBarStyle={{ backgroundColor: "#fff" }} titleStyle={{ color: "black" }}>
        <Stack key="root">
            <Scene key='Home' type= "reset" component={Home} title="HOME" hideNavBar={true} />
            <Scene key='Login' direction='vertical' initial component={Login} title="FAZER LOGIN" hideNavBar={true} />
            <Scene key='Categories' direction='vertical' component={Categories} title="CATEGORIAS" hideNavBar={false} />
            <Scene key='ClientInfo' type= "reset" direction='vertical' component={ClientInfo} title="ABRIR COMANDA" hideNavBar={true} />
            <Scene key='Options' direction='vertical' component={Options} title="OPÇÕES" hideNavBar={false} />
            <Scene key='ProductDescription' direction='vertical' component={ProductDescription} title="DESCRIÇÃO" hideNavBar={false} />
            <Scene key='Cart' direction='vertical' component={Cart} title="CARRINHO" hideNavBar={false} />
            <Scene key='OpenBill' direction='vertical' component={OpenBill} title="COMANDA ABERTA" hideNavBar={false} />
        </Stack>
    </Router>
)