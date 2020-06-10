import React, { Component } from "react";
import "../css/lazy.css";
import LazyLoad from "react-lazyload";
var json = require('../services/API-data.json');

//function Post({ imdb, title, overview, poster_path }) {
// function Post({ id, title, body }) {
class Post extends Component {
    constructor(props) {
        super(props);

        this.state = {
            jsonData: null,
            searchValue: null
        };
    }

    // Update the document title using the browser API


    componentDidMount() {
        let jsonMovies = json.find(x => x.imdb_id === this.props.imdb);
        console.log(jsonMovies);

        this.setState({ jsonData: jsonMovies }, () => {

            try {
                document.getElementById(this.props.imdb).src = `https://image.tmdb.org/t/p/w500${this.state.jsonData.poster_path}`;
            }
            catch (err) {


                // setTimeout(function () {
                //     document.getElementById(this.props.imdb).src = `https://image.tmdb.org/t/p/w500${this.state.jsonData.poster_path}`;
                // }, 10000);
            }

        })

    }


    render() {
        return (
            <div className="post">
                <LazyLoad
                    className="img"
                    once={true}
                // placeholder={<img src={`https://image.tmdb.org/t/p/w500${this.state.jsonData.poster_path}`} alt="..." />}
                >
                    <div className="post-img">
                        <img id={this.props.imdb} src alt="..." />
                        {/* {this.state.jsonData} */}
                    </div>
                </LazyLoad>
                <div className="post-body">
                    <h4>{this.props.title}</h4>
                    <p>{this.props.overview}</p>
                </div>
            </div>
        );
    }
}

export default Post;