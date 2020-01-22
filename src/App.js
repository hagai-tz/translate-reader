/*global chrome*/
import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import './App.css';
import { getCurrentTab } from "./common/Utils";
import axios from 'axios'
import Nav from './components/Nav';

import { Button, DatePicker, version } from "antd";
import "antd/dist/antd.css";
import ArticleRender from './components/ArticleRender';


class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: []
    }
  }

async componentDidMount (){
  let newData = await axios.get(`http://localhost:8000/`)
    console.log("I'm newData", newData.data)
    let newState = [...newData.data]
    this.setState({data: newState},function(){
      console.log(this.state.data)

    })
}
 
  render() {
    return (
      <div className="App">
        <Nav />
        <ArticleRender/>
      </div>
    )
  }
}

export default App;
      // <Router>
      //   <Nav />
      //     <div className="flex-container">
      //       {
      //         this.state.data.map(word => { 
      //           return (
      //               <ul className='word-ul'>
      //                 <li className="word"> {word.word} </li> 
      //                 <li className='translatedWord'> {word.translatedWord}</li>
      //               </ul> 
      //           )
      //         })
      //       }
      //     </div>


      // </Router>