import React from 'react';
import Collapsible from "react-collapsible";
import { Card } from "react-bootstrap";

export default class Filter extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            movies: [],
            shows: []
        };
    }

    componentDidMount() {
        this.grabMoviesAndShows();
    }

    grabMoviesAndShows() {
        fetch('https://casecomp.konnectrv.io/movie')
            .then(response => response.json())
            .then(data => this.setState({movies: data}));
        console.log(this.state.movies);
    }

    //HTML
    render() {
        return (
            <div className="main">
                <div style={{ height: "140px" }}></div>
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
        )
    }
}