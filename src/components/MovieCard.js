import React, { Component } from 'react';

import { Card } from 'react-bootstrap'
var json = require('../services/API-data.json');

class MovieCard extends Component {
    constructor(props) {
        super(props);

        this.state = {
            jsonData: null,
            searchValue: null
        };
    }

    // Update the document title using the browser API


    componentDidMount() {
        let jsonMovies = json.find(x => x.imdb_id === this.props.movie.imdb);


        this.setState({ jsonData: jsonMovies }, () => {

            try {

                document.getElementById(this.props.movie.imdb).src = `https://image.tmdb.org/t/p/w500${this.state.jsonData.poster_path}`;
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
            <Card key={this.props.movie.id} className="movie-card" style={{ height: '100%' }}>
                <Card.Img variant="top" id={this.props.movie.imdb} alt="" />
                <Card.Body>
                    <Card.Title>{this.props.movie.original_title} </Card.Title>
                    <Card.Text className="movie-text">
                        {this.props.movie.overview}
                    </Card.Text>
                </Card.Body>
                <Card.Footer>
                    <small className="text-muted"> Rated: {this.props.movie.vote_average}/10</small>
                </Card.Footer>
            </Card>);
    }
}


// MovieCard.defaultProps = {
//     movie: {}
// };

// MovieCard.propTypes = {
//     movie: PropTypes.object
// };

export default MovieCard;