import React, { Component } from "react";

import "./styles.css";
import "./services/Search Bar Config/css/autoCompleteHome.css";
import "./css/search.css";
import "./App.css";
import NavBar from "./components/navbar";
import LazyLoad from "react-lazyload";
import "./css/lazy.css";
import Spinner from "./components/spinner";
import Post from "./components/post";
import Filter from "./Filter"
import SearchBar from "./components/searchBar";

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

    this.setState({ data: json })
  }

  render() {
    return (
      <React.Fragment>
        {/* <img src={background} id="aqua" alt="hello"></img> */}
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
        <Filter />




        <h2>LazyLoad Demo</h2>
        <div className="post-container">
          {this.state.data.map(movie => (
            <LazyLoad
              key={movie.imdb_id}
              height={100}
              offset={[-100, 100]}
              placeholder={<Spinner />}
            >
              <Post key={movie.imdb_id} {...movie} />
            </LazyLoad>
          ))}
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

    console.log(1, jsonMovies);


  }

}









export default App;
