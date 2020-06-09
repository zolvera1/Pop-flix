import React, { Component } from "react";

import "./styles.css";
import "./services/Search Bar Config/css/autoCompleteHome.css";
import "./css/search.css";
import "./App.css";

import NavBar from "./components/navbar";
import background from "./images/aqua-man.jpg";

import LazyLoad from "react-lazyload";
import "./css/lazy.css";
import Spinner from "./components/spinner";
import Post from "./components/post";

import data from "./services/data";


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

  componentDidMount() { }

  render() {
    return (
      <React.Fragment>
        <img src={background} id="aqua" alt="hello"></img>
        <NavBar></NavBar>
        <div className="App">
          <div className="all-center">
            <SearchBar></SearchBar>
          </div>

          <Filter />

        </div>


        <h2>LazyLoad Demo</h2>
        <div className="post-container">
          {json.map(movie => (
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
}









export default App;
