import React, { useEffect } from 'react';
import Collapsible from "react-collapsible";
import { Card } from "react-bootstrap";
import "./App.css"; 
import Slider from '@material-ui/core/Slider';
import ReactCardFlip from "react-card-flip"; 


export default class Filter extends React.Component {
    constructor(props) {
        super(props);
        this.state = {

            movies_all: [],
            movies_considered: [],

            movie_keys: [],
            movie_titles: [],
            movie_dates: [],
            movie_ratings: [],
            movie_platforms: [],
            movie_companies: [],
            movie_vote_counts: [],
            movie_vote_averages: [],
            movie_languages: [],
            movie_pops: [],
            //movie_genres: [],

            shows_all: [],
            shows_considered: [],

            show_keys: [],
            show_titles: [],
            show_ratings: [],
            show_platforms: [],
            show_companies: [],
            show_vote_counts: [],
            show_vote_averages: [],
            show_languages: [],
            show_pops: [],
            show_genres: [],

            //available_genres: new Set(),

            selected_average: [0, 10],
            selected_services: [],
            //selected_genres: [],
            selected_media: [true, true], //movies, shows
            ratingsValue: [2,8],
            isFlipped:false
        };
        this.handleClick = this.handleClick.bind(this); 
    }

    componentDidMount() {
        this.grabMoviesAndShows();
       
    }

    //RV API call to grab movies/shows and store their data in arrays for parsing later
    grabMoviesAndShows() {
        fetch('https://casecomp.konnectrv.io/movie') 
            .then(response => response.json()) 
            .then(dataArray => {   
                this.setState({ movies_all: dataArray });
                this.setState({ movies_considered: dataArray });
                this.setState({ movie_keys: dataArray.map(data => data.imdb)  });
                this.setState({ movie_titles: dataArray.map(data => data.title)  });
                this.setState({ movie_dates: dataArray.map(data => data.release_date)  });
                this.setState({ movie_ratings: dataArray.map(data => data.rating)  });
                this.setState({ movie_platforms: dataArray.map(data => data.streaming_platform)  });
                this.setState({ movie_companies: dataArray.map(data => data.production_companies)  });
                this.setState({ movie_vote_counts: dataArray.map(data => data.vote_count)  });
                this.setState({ movie_vote_averages: dataArray.map(data => data.vote_average)  });
                this.setState({ movie_languages: dataArray.map(data => data.original_language)  });
                this.setState({ movie_pops: dataArray.map(data => data.popularity)  });

                // //now grab all of the movies' info from IMDB and set total available genres
                // let i;
                // for (i = 0; i < this.state.movies_all.length; i++) {
                //     let genres = [];
                //     let j;
                //     let movie_fetch = 'https://api.themoviedb.org/3/movie/' + this.state.movie_keys[i] + '?api_key=9b720ff3634dcb0e3e7923c780e028b9';
                //     fetch(movie_fetch)
                //         .then(result => result.json())
                //         .then(details => {
                //             genres = details.genres.map(deets => deets.name);
                //             for (j = 0; j < genres.length; j++) {
                //                 this.state.available_genres.add(genres[j]);
                //             }
                //         })
                // }
            }
        );

        fetch('https://casecomp.konnectrv.io/show')
            .then(response => response.json())
            .then(dataArray => {
                this.setState({ shows_all: dataArray });
                this.setState({ shows_considered: dataArray });
                this.setState({ show_keys: dataArray.map(data => data.imdb)  });
                this.setState({ show_titles: dataArray.map(data => data.title)  });
                this.setState({ show_platforms: dataArray.map(data => data.streaming_platform)  });
                this.setState({ show_companies: dataArray.map(data => data.production_companies)  });
                this.setState({ show_vote_counts: dataArray.map(data => data.vote_count)  });
                this.setState({ show_vote_averages: dataArray.map(data => data.vote_average)  });
                this.setState({ show_languages: dataArray.map(data => data.original_language)  });
                this.setState({ show_pops: dataArray.map(data => data.popularity)  });

                //now grab all of the shows' info from IMDB and set total available genres
                /*let i;
                for (i = 0; i < this.state.shows_all.length; i++) {
                    let genres = [];
                    let j;
                    let show_fetch = 'https://api.themoviedb.org/3/tv/tt1844624?api_key=9b720ff3634dcb0e3e7923c780e028b9'
                    //let show_fetch = 'https://api.themoviedb.org/3/tv/' + this.state.show_keys[i] + '?api_key=9b720ff3634dcb0e3e7923c780e028b9';
                    fetch(show_fetch)
                        .then(result => result.json())
                        .then(details => {
                            genres = details.genres.map(deets => deets.name);
                            for (j = 0; j < genres.length; j++) {
                                this.state.available_genres.add(genres[j]);
                            }
                        })
                }*/
            }
        );
        //console.log(this.state.available_genres);
    }

    handleRatingsChange(event) { 
        this.setState({ratingsValue: event.target.ratingsValue}); 
    }

    handleClick(e) { 
        e.preventDefault(); 
        this.setState(prevState => ({isFlipped: !prevState.isFlipped})); 
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
                    <Collapsible trigger="Vote Ratings" className="filter-head">
                        <br></br><br></br>
                        <div className='slider-box'>
                            <Slider className="slider" min={0} max={10} defaultValue={[0,10]} onChange={() => this.handleRatingsChange} valueLabelDisplay="on"/>
                            </div>
                    </Collapsible>
                    <br></br>
                    <Collapsible trigger="Streaming Services" className="filter-head">
                        <label className="checkbox-label">
                           <input id="Netflix" type="checkbox" />
                            <span>Netflix</span>
                            <br></br>
                            <input id="amazon" type='checkbox'/>
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
                    <Collapsible trigger="Maturity Ratings" className="filter-head">
                    <label className="checkbox-label">
                            <input id="NR" type="checkbox" />
                            <span>NR</span>
                            <br></br>
                            <input id="r" type="checkbox" />
                            <span>R</span>
                            <br></br>
                            <input id="PG-13" type="checkbox" />
                            <span>PG-13</span>
                            <br></br>
                            <input id="PG" type="checkbox" />
                            <span>PG</span>
                            <br></br>
                        </label>
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
                <div className="react-card">
                   <ReactCardFlip isFlipped={this.state.isFlipped} flipDirection='vertical'> 
                   <div>
                        this is front of card w/ Title
                        <button onClick={this.handleClick}>click to flip</button>
                   </div>
                   <div>
                       this has back of card with other info 
                       <button onClick={this.handleClick}>click to flip</button>
                   </div>
                   </ReactCardFlip>
                </div>
                </div>
            </div>
        )
   } 
 }