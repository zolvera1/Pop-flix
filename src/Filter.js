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

            movies_all: [], //objects
            movies_considered: [], //array of indices

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

            shows_all: [], //objects
            shows_considered: [], //array of indices

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

            available_services: new Set(),
            selected_services: new Set(),
            available_ratings: new Set(),
            selected_ratings: new Set(),

            selected_average: [0, 10],
            selected_media: [true, true], //movies, shows

            ratingsValue: [2,8],
            isFlipped:false
        };
        this.handleClick = this.handleClick.bind(this); 
    }

    componentDidMount() {
        this.grabMoviesAndShows();
       
    }

    //take an array of arrays and return a unified set
    static reduceArrOfArr(data) {
        let finalSet = new Set();
        let i;
        for (i = 0; i < data.length; i++) {
            let j;
            for (j = 0; j < data[i].length; j++) {
                finalSet.add(data[i][j]);
            }
        }
        return Array.from(finalSet);
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

                //dynamically generate which platforms are available for streaming
                let i;
                let movie_plats = Filter.reduceArrOfArr(this.state.movie_platforms);
                for (i = 0; i < movie_plats.length; i++) {
                    let a_platform = movie_plats[i];
                    this.state.available_services.add(a_platform);
                }
                //console.log(this.state.available_services);

                //dynamically generate which maturity ratings are available
                let ratings = Filter.reduceArrOfArr(this.state.movie_ratings);
                for (i = 0; i < ratings.length; i++) {
                    let a_rating = ratings[i];
                    this.state.available_ratings.add(a_rating);
                }
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

                //dynamically generate which platforms are available for streaming
                let i;
                let show_plats = Filter.reduceArrOfArr(this.state.show_platforms);
                for (i = 0; i < show_plats.length; i++) {
                    let a_platform = show_plats[i];
                    this.state.available_services.add(a_platform);
                }

                //dynamically generate which maturity ratings are available
                let ratings = Filter.reduceArrOfArr(this.state.show_ratings);
                for (i = 0; i < ratings.length; i++) {
                    let a_rating = ratings[i];
                    this.state.available_ratings.add(a_rating);
                }
            }
        );
    }

    handleRatingsChange(event) { 
        this.setState({ratingsValue: event.target.ratingsValue}); 
    }

    handleClick(e) { 
        e.preventDefault(); 
        this.setState(prevState => ({isFlipped: !prevState.isFlipped})); 
    }

    //apply all of the filters the user has selected
    applyFilters() {
        let i;

        //initially set all movies and all shows to be considered
        for (i = 0; i < this.state.movies_all.length; i++) {
            this.state.movies_considered.push(i);
        }
        for (i = 0; i < this.state.shows_all.length; i++) {
            this.state.shows_considered.push(i);
        }

        //each of these methods reduce this.state.movies_considered and this.state.shows_considered
        this.scoreFilter();
        this.serviceFilter();
        this.mediaTypeFilter();
        this.maturityFilter();
    }

    //call this method after applyFilters to grab all movies that currently obey the filter rules
    grabFilteredMovies() {
        let returnArray = [];
        let i;
        for (i = 0; i < this.state.movies_considered.length; i++) {
            let movie_index = this.state.movies_considered[i];
            returnArray.push(this.state.movies_all[movie_index]);
        }
        return returnArray;
    }

    //call this method after applyFilters to grab all shows that currently obey the filter rules
    grabFilteredShows() {
        let returnArray = [];
        let i;
        for (i = 0; i < this.state.movies_considered.length; i++) {
            let movie_index = this.state.movies_considered[i];
            returnArray.push(this.state.movies_all[movie_index]);
        }
        return returnArray;
    }

    //ratings 0 through 10
    scoreFilter() {
        let i;
        let reduced_watchables = [];
        let low_end = this.state.selected_average[0];
        let high_end = this.state.selected_average[1];

        for (i = 0; i < this.state.movies_considered.length; i++) {
            let movie_index = this.state.movies_considered[i];

            if (this.state.movie_vote_averages[movie_index] >= low_end && this.state.movie_vote_averages[movie_index] <= high_end) {
                reduced_watchables.push(movie_index);
            }
        }
        this.setState({ movies_considered: reduced_watchables});

        reduced_watchables = [];
        for (i = 0; i < this.state.shows_considered.length; i++) {
            let show_index = this.state.shows_considered[i];
            if (this.state.show_vote_averages[show_index] >= low_end && this.state.show_vote_averages[show_index] <= high_end) {
                reduced_watchables.push(show_index);
            }
        }
        this.setState({ shows_considered: reduced_watchables});
    }

    //what platform is it available on
    serviceFilter() {
        let i;
        let reduced_watchables = [];
        for (i = 0; i < this.state.movies_considered.length; i++) {
            let movie_index = this.state.movies_considered[i];

            let services_available = this.state.movie_platforms[movie_index];
            let j;
            let movie_available = false;
            for (j = 0; j < services_available.length; j++) {
                let a_platform = services_available[j];
                if (this.state.selected_services.includes(a_platform)) {
                    movie_available = true;
                }
            }
            if (movie_available) {
                reduced_watchables.push(this.state.movies_considered[movie_index]);
            }
        }
        this.setState({ movies_considered: reduced_watchables });
        reduced_watchables = [];

        for (i = 0; i < this.state.shows_considered.length; i++) {
            let show_index = this.state.movies_considered[i];

            let services_available = this.state.show_platforms[show_index];
            let j;
            let show_available = false;
            for (j = 0; j < services_available.length; j++) {
                let a_platform = services_available[j];
                if (this.state.selected_services.includes(a_platform)) {
                    show_available = true;
                }
            }
            if (show_available) {
                reduced_watchables.push(this.state.shows_considered[show_index]);
            }
        }
        this.setState({ shows_considered: reduced_watchables });
    }

    mediaTypeFilter() {
        //whether we want movies and/or tv shows
        if (this.state.selected_media[0] === false) {
            this.setState({ movies_considered: [] });
        }
        if (this.state.selected_media[1] === false) {
            this.setState({ shows_considered: [] });
        }
    }

    //pg13, pg, r, nr
    maturityFilter() {
        let i;
        let reduced_watchables = [];
        for (i = 0; i < this.state.movies_considered.length; i++) {
            let movie_index = this.state.movies_considered[i];
            if (this.state.selected_ratings.includes(this.state.movie_ratings[movie_index])) {
                reduced_watchables.push(movie_index);
            }
        }
        this.setState({ movies_considered: reduced_watchables});
        reduced_watchables = [];

        for (i = 0; i < this.state.shows_considered.length; i++) {
            let show_index = this.state.shows_considered[i];
            if (this.state.selected_ratings.includes(this.state.show_ratings[show_index])) {
                reduced_watchables.push(show_index);
            }
        }
        this.setState({ shows_considered: reduced_watchables });
    }

    //variables to update with GUI interaction:
    //this.state.selected_average[low_end, high_end] (this is the "user" score)
    //this.state.selected_services (compare it against this.state.available_services)
    //this.state.selected_media[movies?, shows?]
    //this.state.selected_ratings (compare it against this.state.available_ratings) (G, PG, PG-13,...)

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