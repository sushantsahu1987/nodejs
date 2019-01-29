import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
      text1,
      text2
    };
  }

  onTextChange = (e) => {
    this.setState({text1: e.target.value});
  }

  render() {
    return (
      <div className="App">
        <input value={this.state.text1} onChange={this.onTextChange}/>  
        <button>send</button>
        <label>{this.state.text2}</label>
      </div>
    );
  }
}

export default App;
