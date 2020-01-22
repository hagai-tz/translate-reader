

/*global chrome*/
import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import './App.css';
import TrafficContainer from "./components/TrafficContainer";
import { getCurrentTab } from "./common/Utils";
import axios from 'axios'
import Nav from './components/Nav';




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
      <Router>
        <Nav
          <div className="flex-container">
            {
              this.state.data.map(word => { 
                return(
                 <ul >
                   <li className="word"> {word.word} </li> 
                   <li className='translatedWord'> {word.translatedWord}</li>
                 </ul> 
                )
              })
            }
          </div>


      </Router>
    );
  }
}

export default App;





// {


// import React from 'react';
// import logo from './logo.svg';
// import './App.css';
// // import { Parallax, Background } from 'react-parallax';
// // import MyComponent from './components/parallax'

// // import { observer } from 'mobx-react'


// // @observe r
// function App() {
//   console.log("IM WORKING")
//   return (
//     <div className="App">
//       HELLO WORLD
//     </div>
//   );
// }

// export default App;
// }

