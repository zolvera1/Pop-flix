import React from 'react'
import PropTypes from 'prop-types'
import { CardDeck, Col } from 'react-bootstrap'
import MovieCard from './MovieCard'
import Spinner from './spinner'
import LazyLoad from 'react-lazyload'
const getMovies = (movies) => {
    return (
        <CardDeck>
            {
                movies.map(movie =>
                    <LazyLoad
                        key={movie.imdb}
                        height={100}
                        offset={[-100, 100]}
                        placeholder={<Spinner />}
                    >
                        <Col key={movie.imdb} sm={6} lg={6} md={4} >
                            <MovieCard movie={movie} />
                        </Col>
                    </LazyLoad>)
            }
        </CardDeck>
    );
};

const MovieList = (props) => (
    <div>
        {getMovies(props.movies)}
    </div>
);

MovieList.defaultProps = {
    movies: []
};

MovieList.propTypes = {
    movies: PropTypes.array
};

export default MovieList;
