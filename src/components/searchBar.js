import React, { Component } from "react";

import "../services/Search Bar Config/css/autoCompleteHome.css";
import "../css/search.css";
import autoComplete from "../services/Search Bar Config/js/index";


class SearchBar extends Component {
  constructor(props) {
    super(props);

    this.state = {
      data: [],
    };
  }

  componentDidMount() {
    autoComplete("https://casecomp.konnectrv.io/movie", ["title"]);
  }

  click = (event) => {
    this.props.parentMethod(event);
  }

  render() {
    return (
      <div className="center">
        <form id="search-form" onSubmit={this.click}>
          <div className="contanier">
            <div className="centered-container">
              <input
                id="autoComplete"
                autoComplete="off"
                type="text"
                tabIndex="1"
                maxLength="25"
              />
              <div className="selection"></div>
            </div>
          </div>

          <button type="submit" className="btn btn-default" id="search-btn">
            Search
        </button>
        </form>
      </div>
    );
  }
}

export default SearchBar;
