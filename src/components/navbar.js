// eslint-disable-next-line no-console
import React, { Component } from "react";

import "../css/navbar.css";
import logo from "../images/popflixLogo.png";

class NavBar extends Component {
  constructor(props) {
    super(props);

    this.state = {
      data: [],
    };
  }

  componentDidMount() {

    const toggleCollapse = document.querySelector('.toggle-collapse span');
    const nav = document.querySelector('.nav');


    // onclick event on toggle Collapse span tag
    toggleCollapse.onclick = (e) => {
      nav.classList.toggle("collapse");
      e.target.classList.toggle("toggle-click");
    }

  }

  render() {
    return (
      <React.Fragment>
        <nav className="nav flex-row" style={{ padding: "10px" }}>
          <div className="nav-menu">
            <div className="nav-brand " style={{ marginTop: "0" }}>
              <a href="/#" className="text-black " style={{ marginTop: "0" }}><img alt="logo" className="logo"
                src={logo} /></a>
            </div>
          </div>
          <div className="toggle-collapse">
            <div className="toggle-icons text-black">

              <span className="icon"></span>
            </div>
          </div>
          <div>
            <ul className="nav-items flex-row">

            </ul>
          </div>
          <div className="social text-black">

            <a href="/#" className="icons-x"><i className="fab fa-facebook-f"></i></a>

            <a href="https://github.com/zolvera1/Pop-flix" className="icons-x"><i className="fab fa-github"></i></a>

            <a href="/#" className="icons-x"><i className="fab fa-instagram"></i></a>

            <a href="/#" className="icons-x"><i className="fab fa-youtube"></i></a>
          </div>
        </nav>
      </React.Fragment>
    );
  }
}

export default NavBar;
