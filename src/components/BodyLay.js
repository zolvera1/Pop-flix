import React, { useState, useEffect, Component } from 'react'

import { Container, Row, Col } from 'react-bootstrap'
import MovieService from '../services/MovieService'
import MovieList from './MovieList'
const json = require('../services/API-data.json')
export default class BodyLay extends Component {
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
    this.setState(() => ({ movies: this.getMovies() }));

  }


  render() {
    return (
      <Container fluid>
        <Row className="d-flex flex-row">

          <MovieList movies={this.props.values}> </MovieList>

        </Row>
      </Container>
    )
  }
}


