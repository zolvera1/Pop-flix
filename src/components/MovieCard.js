import React from 'react';
import PropTypes from 'prop-types';
import {Card } from 'react-bootstrap'

const MovieCard = (props) => (
    
    <Card key= {props.movie.id} className="movie-card" style= {{height: '100%'}}>
            <Card.Img variant="top"  src={`https://image.tmdb.org/t/p/w500/${props.movie.poster_path}`} alt=""/>
            <Card.Body> 
                <Card.Title>{props.movie.original_title} </Card.Title>
                <Card.Text className= "movie-text"> 
                    {props.movie.overview}
                </Card.Text>
           </Card.Body>
           <Card.Footer>
               <small className ="text-muted"> Rated: {props.movie.vote_average}/10</small>
           </Card.Footer>
    </Card>
);

MovieCard.defaultProps = {
    movie: {}
};

MovieCard.propTypes = {
    movie: PropTypes.object
};

export default MovieCard;