import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import openSocket from 'socket.io-client';
import {send} from './sockets';

class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
      text1:'',
      text2:''
    };
  }

  callback = (err, data) => {
    this.setState({text2: data});
  }

  onTextChange = (e) => {
    this.setState({text1: e.target.value});
  }

  onSubmit = () => {
    send(this.state.text1,this.callback);
  }

  render() {
    return (
      <div className="App">
        <input value={this.state.text1} onChange={this.onTextChange}/>  
        <button onClick={this.onSubmit}>send</button>
        <label>{this.state.text2}</label>
      </div>
    );
  }
}

export default App;
