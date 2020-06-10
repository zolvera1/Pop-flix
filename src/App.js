import React, { Component } from "react";

import "./styles.css";
import "./services/Search Bar Config/css/autoCompleteHome.css";
import "./css/search.css";
import "./App.css";
import NavBar from "./components/navbar";

import "./css/lazy.css";

import Filter from "./Filter"
import SearchBar from "./components/searchBar";
import BodyLay from './components/BodyLay'
var json = require('./services/API-data.json');


class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      data: [],
      searchValue: null
    };
  }

  componentDidMount() {

    //this.setState({ data: json })

    fetch('https://casecomp.konnectrv.io/movie')
      .then(response => response.json())
      .then(dataArray => {



        this.setState({ data: dataArray });
        // console.log(dataArray);
      }
      );


  }

  render() {
    return (
      <React.Fragment>

        <div className="header-container">
          <NavBar></NavBar>
          <div className="App">
            <div className="search-container">
              <div className="all-center">

                <SearchBar parentMethod={this.SearchedItem}></SearchBar>
              </div>
            </div>
          </div>
        </div>

        <Filter parentMethod={this.refreshDataArray} />





        {console.log("print")}
        <h1 className="movie-header">Movie Collection</h1>
        <div className="post-container">



          <BodyLay values={this.state.data} ></BodyLay>

        </div>



      </React.Fragment>
    );
  }

  SearchedItem = async e => {
    e.preventDefault();

    let searchedValue = document.getElementById("autoComplete").value;

    const source = await fetch("https://casecomp.konnectrv.io/movie");
    const data = await source.json();
    let movieObject = [];
    movieObject.push(data.find(x => x.title === searchedValue));


    let jsonMovies = [];
    jsonMovies.push(json.find(x => x.imdb_id === movieObject[0].imdb));

    this.setState({ data: jsonMovies })




  }

  refreshDataArray = async (newData) => {


    this.setState({ data: newData },()=>{
      console.log("another data",this.state.data);
      
    })
  }

}









export default App;
