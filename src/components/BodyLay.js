import React, { useState, useEffect, Component } from 'react'
import LazyLoad from 'react-lazyload'
import Spinner from './spinner'
import Post from './post'
import {Container, Row,Col} from 'react-bootstrap'
import MovieService from '../services/MovieService'
import MovieList from './MovieList'
const json = require('../services/API-data.json')
export default class BodyLay extends Component  {
  constructor() {
    super();

    this.state = {
        movies: []
    };
}

getMovies = () => {
  return json ? json : {}
  }
  
componentDidMount() {
  this.setState(() => ({ movies: this.getMovies()}));
}


render() {
    return (
       <Container fluid>
         <Row className="d-flex flex-row">
            
              <MovieList movies={this.state.movies}> </MovieList>
            
         </Row>
       </Container>
    )
    }
  }


