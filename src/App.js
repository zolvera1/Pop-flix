import React, { Component } from 'react';

// import '../node_modules/bootstrap/dist/css/bootstrap.css';
import './styles.css';
import './css/search.css'
import Autocomplete from "./services/search";

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
        <div className='nav-filters'>

          <h4>Ratings</h4>
          <h4>Streaming Service</h4>
          <h4>Genre</h4>
          <h4>Length</h4>
          <h4>Media Type</h4>
        </div>
        <div className="header-container">
          <h1>Movie Collection</h1>
        </div>

        <div className="movies">
          <p> this is where all the movies would go</p>
        </div>
      </div>
    );
  }
}

export default App;
