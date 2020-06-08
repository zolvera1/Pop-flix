import React, { Component } from 'react';

// import '../node_modules/bootstrap/dist/css/bootstrap.css';
import './styles.css';
import './css/search.css'
import Autocomplete from "./services/search";
import logo from './logo.svg';
import './App.css';
import Collapsible from 'react-collapsible'; 
import {Card} from 'react-bootstrap'; 

class App extends Component {

  constructor(props) {
    super(props);

    this.state = {
      data: [],
    };
  }

  componentDidMount() {

    fetch('https://casecomp.konnectrv.io/movie')
      .then(response => response.json())
      .then(dataArray => {


        let result = dataArray.map(data => data.title)
        this.setState({ data: result });
        console.log(result);
      }
      );
  }


  render() {
    return (
      <div className="App">
        <div className='topnav'>
          <input type="text" placeholder="Search..." name='search'></input>
        </div>

        <div className="center">

          <div className="contanier">
            <Autocomplete
              suggestions={this.state.data}
            />
          </div>

          <button type="button" className="btn btn-default" id="search-btn">Success</button>
        </div>
        <div class='main'>
        <div class='nav-filters'>
          <div class="sort">
          <h3>Filter by...</h3>
          <hr></hr>
            <Collapsible trigger = "Ratings" className = "filter-head">
                <input type='range' name = 'ratings' min = '0' max = '10' ></input>
               
            </Collapsible><br></br>
            <Collapsible trigger = "Streaming Services" className = "filter-head">
              <label className="checkbox-label">
                <input id="Netflix" type="checkbox"/><span>Netflix</span><br></br>
                <input id="amazon" type="checkbox"/><span>Amazon Prime</span><br></br>
                <input id="hbo" type="checkbox"/><span>HBO</span><br></br>
                <input id="hulu" type="checkbox"/><span>Hulu</span><br></br>
              </label>
            </Collapsible><br></br>
            <Collapsible trigger = "Genres" className = "filter-head">
              <p> list off checkboxes of available genres</p>
              </Collapsible><br></br>
            <Collapsible trigger = "Length" className = "filter-head">
            <input type='range' min = '0' max = '180'></input>
              </Collapsible><br></br>
            <Collapsible trigger = "Media Type" className = "filter-head">
               <input id="movies" type="checkbox"/><span>Movies</span><br></br>
                <input id="shows" type="checkbox"/><span>TV Shows</span>
              </Collapsible><br></br>
              </div>
        </div>
        <div class = "movie-content"> 
          <h1>Movie Collection</h1>
          <div class="movie-grid"> 
          <Card> 
            <Card.Img variant = "top"/>
            <Card.Body> 
              <Card.Title>Movie Title</Card.Title>
            </Card.Body>
         </Card>
        </div>
        </div>
       </div>
       </div>
    );
  }
}


export default App;
