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

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      data: [],
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
          {data.map(post => (
            <LazyLoad
              key={post.id}
              height={100}
              offset={[-100, 100]}
              placeholder={<Spinner />}
            >
              <Post key={post.id} {...post} />
            </LazyLoad>
          ))}
        </div>



      </React.Fragment>
    );
  }
}









export default App;
