import React, { Component } from "react";

import "./styles.css";
import "./services/Search Bar Config/css/autoCompleteHome.css";
import "./css/search.css";
import "./App.css";

import NavBar from "./components/navbar";
import background from "./images/aqua-man.jpg";
import Filter from "./Filter"

import SearchBar from "./components/searchBar";

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      data: [],
    };
  }

  componentDidMount() {}

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
      </React.Fragment>
    );
  }
}

export default App;
