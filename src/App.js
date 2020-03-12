/*global chrome*/
import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import './App.css';
import { getCurrentTab } from "./common/Utils";
import axios from 'axios'
import Nav from './components/Nav';
import ArticleRender from './components/ArticleRender';

import { Button, DatePicker, version, Skeleton } from "antd";
import "antd/dist/antd.css";
import ArticleContent from './components/ArticleContent';
import ArticleTitle from './components/ArticleTitle';


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
      <div id='interface-container'>
        <Nav/>
        <ArticleTitle data={this.state.data}/>
        <ArticleContent data={this.state.data}/>

      </div>
      
    )
  }
}

export default App;












// <div className='App2'>
// {
//       this.state.data.map(word => { 
//         return (
          
//                 <div className='word-ul'>
//                     <span className="word"> {word.word} </span> 
//                     <span className='translatedWord'> {word.translatedWord}</span>
//                 </div> 

//         )
//       })
//     }

// </div>

// <div className="App">

// <div className='i1'>
//   <Nav/>
// </div>

// <div className='i2'>
//   <div className='space1'></div>
//   <div className='article-content-container'>
//     {/* <ArticleRender/> */}
//     <ArticleTitle/>
//     <ArticleContent data={this.state.data}/>



//   </div>
//   <div className='space1'></div>
// </div>


// </div>








// <div className='i1'>
// <Nav />
// </div>

// <div className='i2'>
//   { <div className='space1'></div>
//   <div className='article-container'>
//     <ArticleRender />
//   </div>
//   <div className='space2'></div> }
// </div>


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