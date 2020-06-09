// eslint-disable-next-line no-console
import React, { Component } from "react";

import "../css/navbar.css";

class NavBar extends Component {
  constructor(props) {
    super(props);

    this.state = {
      data: [],
    };
  }

  componentDidMount() {
    let menuButton = document.querySelector(".kad-menu-button");
    let navItems = document.querySelector(".kad-nav");
    let barHide = document.querySelector(".kad-menu-bar-two");
    let barLeft = document.querySelector(".kad-menu-bar-one");
    let barRight = document.querySelector(".kad-menu-bar-three");

    menuButton.onclick = openMenu;

    function openMenu() {
      navItems.classList.toggle("toggle-kad-nav");
      barHide.classList.toggle("hide-bar-two");
      barLeft.classList.toggle("cross-bar-one");
      barRight.classList.toggle("cross-bar-three");
    }
  }

  render() {
    return (
      <React.Fragment>
        <header className="kad-header">
          <div className="kad-mobile-container">
            <div className="kad-header-logo">
              <span className="kad-link" id="logo" title="kadnavbar">
                Pop-flix
              </span>
            </div>

            <div className="kad-menu-button">
              <div className="kad-menu-bar kad-menu-bar-one"></div>
              <div className="kad-menu-bar kad-menu-bar-two"></div>
              <div className="kad-menu-bar kad-menu-bar-three"></div>
            </div>
          </div>

          <nav className="kad-nav">
            <ul className="kad-nav-list">
              <li className="kad-nav-list-item">
                <span className="kad-link kad-list-link">Home</span>
              </li>
              <li className="kad-nav-list-item">
                <span className="kad-link kad-list-link">Features</span>
              </li>
              <li className="kad-nav-list-item">
                <span className="kad-link kad-list-link">Documentation</span>
              </li>
              <li className="kad-nav-list-item">
                <span className="kad-link kad-list-link">Contribute</span>
              </li>
              <li className="kad-nav-list-item">
                <span className="kad-link kad-list-link">Report issue</span>
              </li>
            </ul>

            <div className="kad-nav-extras">
              <button className="kad-nav-button">
                <span className="kad-link kad-list-link">Download</span>
              </button>
              <div className="kad-nav-icons">
                <a href="https://github.com/kadetXx" title="github">
                  <i className="fab fa-github"></i>
                </a>
                <a href="https://twitter.com/kadetXx" title="twitter">
                  <i className="fab fa-twitter"></i>
                </a>
                <a href="https://codepen.io/kadetXx/" title="codepen">
                  <i className="fab fa-codepen"></i>
                </a>
                <a href="https://twitter.com/kadetXx" title="twitter">
                  <i className="fas fa-hashtag"></i>
                </a>
                <a href=" mailto:techkadet@gmail.com" title="send an email">
                  <i className="fas fa-envelope"></i>
                </a>
              </div>
            </div>
          </nav>
        </header>
      </React.Fragment>
    );
  }
}

export default NavBar;
