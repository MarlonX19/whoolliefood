import React, {Component} from 'react';
import { View } from 'react-native';

import Routes from './src/Components/Routes';



export default class App extends Component {
  
  componentWillMount(){
    console.disableYellowBox = true; 
  }

  render() {
    return (
      <Routes />
    );
  }
}