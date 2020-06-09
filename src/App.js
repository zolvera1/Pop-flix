import React, { Component } from "react";

import "./styles.css";
import "./services/Search Bar Config/css/autoCompleteHome.css";
import "./css/search.css";
import "./App.css";
import Collapsible from "react-collapsible";
import { Card } from "react-bootstrap";
import NavBar from "./components/navbar";
import background from "./images/aqua-man.jpg";
import LazyLoad from "react-lazyload";
import "./css/lazy.css";
import Spinner from "./components/spinner";
import Post from "./components/post";

import data from "./services/data";


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

          <div style={{ height: "140px" }}></div>

          <div className="main">
            <div className="nav-filters">
              <div className="sort">
                <h3>Filter by...</h3>
                <hr></hr>
                <Collapsible trigger="Ratings" className="filter-head">
                  <input type="range" name="ratings" min="0" max="10"></input>
                </Collapsible>
                <br></br>
                <Collapsible
                  trigger="Streaming Services"
                  className="filter-head"
                >
                  <label className="checkbox-label">
                    <input id="Netflix" type="checkbox" />
                    <span>Netflix</span>
                    <br></br>
                    <input id="amazon" type="checkbox" />
                    <span>Amazon Prime</span>
                    <br></br>
                    <input id="hbo" type="checkbox" />
                    <span>HBO</span>
                    <br></br>
                    <input id="hulu" type="checkbox" />
                    <span>Hulu</span>
                    <br></br>
                  </label>
                </Collapsible>
                <br></br>
                <Collapsible trigger="Genres" className="filter-head">
                  <p> list off checkboxes of available genres</p>
                </Collapsible>
                <br></br>
                <Collapsible trigger="Length" className="filter-head">
                  <input type="range" min="0" max="180"></input>
                </Collapsible>
                <br></br>
                <Collapsible trigger="Media Type" className="filter-head">
                  <input id="movies" type="checkbox" />
                  <span>Movies</span>
                  <br></br>
                  <input id="shows" type="checkbox" />
                  <span>TV Shows</span>
                </Collapsible>
                <br></br>
              </div>
            </div>
            <div className="movie-content">
              <h1>Movie Collection</h1>
              <div className="movie-grid">
                <Card>
                  <Card.Img variant="top" />
                  <Card.Body>
                    <Card.Title>Movie Title</Card.Title>
                  </Card.Body>
                </Card>
              </div>
            </div>
          </div>


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
