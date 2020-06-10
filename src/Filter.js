// eslint-disable-next-line no-console

import React, { useEffect } from 'react';
import Collapsible from "react-collapsible";
import "./App.css"; 
import Slider from '@material-ui/core/Slider';


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
            selected_services: [true, true, true], //netflix, amazon_prime, hbo
            available_ratings: new Set(),
            selected_ratings: [true, true, true, true], //NR, R, PG13, PG

            
            selected_average: [0, 10],
            selected_media: [true, true], //movies, shows

            include_netflix: true,
            include_prime: true,
            include_hbo: true,

            include_NR: true,
            include_R: true,
            include_PG13: true,
            include_PG: true
        };
        // this.handleClick = this.handleClick.bind(this); 
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

    static reduceArr(myArray) {
        let reducedSet = new Set();
        let i;
        for (i = 0; i < myArray.length; i++) {
            reducedSet.add(myArray[i]);
        }
        return reducedSet;
    }

    //RV API call to grab movies/shows and store their data in arrays for parsing later
    grabMoviesAndShows() {
        fetch('https://casecomp.konnectrv.io/movie') 
            .then(response => response.json()) 
            .then(dataArray => {   
                this.setState({ movies_all: dataArray });
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
                let movie_plats = Filter.reduceArrOfArr(this.state.movie_platforms);
                movie_plats.forEach(v =>
                    this.state.available_services.add(v) &&
                    this.state.selected_services.push(v));

                //dynamically generate which maturity ratings are available
                let ratings = Filter.reduceArr(this.state.movie_ratings);
                ratings.forEach(v =>
                    this.state.available_ratings.add(v) &&
                    this.state.selected_ratings.push(v));

                //consider all movies at first
                let j;
                for (j = 0; j < this.state.movies_all.length; j++) {
                    this.state.movies_considered.push(j);
                }
            }
        );

        fetch('https://casecomp.konnectrv.io/show')
            .then(response => response.json())
            .then(dataArray => {
                this.setState({ shows_all: dataArray });
                //this.setState({ shows_considered: dataArray });
                this.setState({ show_keys: dataArray.map(data => data.imdb)  });
                this.setState({ show_titles: dataArray.map(data => data.title)  });
                this.setState({ show_platforms: dataArray.map(data => data.streaming_platform)  });
                this.setState({ show_companies: dataArray.map(data => data.production_companies)  });
                this.setState({ show_vote_counts: dataArray.map(data => data.vote_count)  });
                this.setState({ show_vote_averages: dataArray.map(data => data.vote_average)  });
                this.setState({ show_languages: dataArray.map(data => data.original_language)  });
                this.setState({ show_pops: dataArray.map(data => data.popularity)  });

                //dynamically generate which platforms are available for streaming
                let show_plats = Filter.reduceArrOfArr(this.state.show_platforms);
                show_plats.forEach(v =>
                     this.state.available_services.add(v)); 
                    

                //dynamically generate which maturity ratings are available
                let ratings = Filter.reduceArr(this.state.show_ratings);
                ratings.forEach(v =>
                    this.state.available_ratings.add(v) &&
                    this.state.selected_ratings.push(v));

                //consider all shows at first
                let j;
                for (j = 0; j < this.state.shows_all.length; j++) {
                    this.state.shows_considered.push(j);
                }
            }
        );
    }

    handleRatingsChange(event, newValue) { 
        // this.setState({ratingsValue: event.target.newValue});
        // event.setValue(newValue); 
        console.log(newValue);  
    }

    //apply all of the filters the user has selected
    applyFilters() {
        let i = 0;
        let movies_considered_reset = [];
        let shows_considered_reset = [];

        //initially set all movies and all shows to be considered
        for (i = 0; i < this.state.movies_all.length; i++) {
            movies_considered_reset.push(i);
        }
        for (i = 0; i < this.state.shows_all.length; i++) {
            shows_considered_reset.push(i);
        }

        this.setState({ movies_considered: movies_considered_reset }, async () => {
            this.setState({ shows_considered: shows_considered_reset }, async () => {
                //each of these methods reduce this.state.movies_considered and this.state.shows_considered
                await this.scoreFilter();
                await this.serviceFilter();
                await this.mediaTypeFilter();
                await this.maturityFilter();

                console.log("movies: " + this.state.movies_considered);
                console.log("shows: " + this.state.shows_considered);
            });
        });
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

    grabFilteredAll() {
        let finalArray = this.grabFilteredMovies();
        let newArray = this.grabFilteredShows();
        let i;
        for (i = 0; i < newArray.length; i++) {
            let show = newArray[i];
            finalArray.push(show);
        }
        return finalArray;
    }

    //ratings 0 through 10
    async scoreFilter() {
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

        return 1;
    }

    //what platform is it available on
    async serviceFilter() {
        let i;
        let reduced_watchables_m = [];

        console.log(this.state.available_services);

        for (i = 0; i < this.state.movies_considered.length; i++) {
            let movie_index = this.state.movies_considered[i];
            let services_available = this.state.movie_platforms[movie_index];
            let movie_available = false;
            if (services_available.includes("netflix") && this.state.include_netflix) {
                movie_available = true;
            } else if (services_available.includes("amazon_prime") && this.state.include_prime) {
                movie_available = true;
            } else if (services_available.includes("hbo") && this.state.include_hbo) {
                movie_available = true;
            }
            if (movie_available) {
                reduced_watchables_m.push(this.state.movies_considered[movie_index]);
            }
        }

        let reduced_watchables_s = [];

        for (i = 0; i < this.state.shows_considered.length; i++) {
            let show_index = this.state.shows_considered[i];
            let services_available = this.state.show_platforms[show_index];
            let show_available = false;
            if (services_available.includes("netflix") && this.state.include_netflix) {
                show_available = true;
            } else if (services_available.includes("amazon_prime") && this.state.include_prime) {
                show_available = true;
            } else if (services_available.includes("hbo") && this.state.include_hbo) {
                show_available = true;
            }
            if (show_available) {
                reduced_watchables_s.push(this.state.shows_considered[show_index]);
            }
        }

        this.setState({ movies_considered: reduced_watchables_m }, () => {
            this.setState({ shows_considered: reduced_watchables_s }, () => {
                return 1;
            });
        });
    }

    async mediaTypeFilter() {
        //whether we want movies and/or tv shows
        if (this.state.selected_media[0] === false) {
            this.setState({ movies_considered: [] });
        }
        if (this.state.selected_media[1] === false) {
            this.setState({ shows_considered: [] });
        }

        return 1;
    }


    //pg13, pg, r, nr
    async maturityFilter() {
        let i;
        let reduced_watchables_m = [];
        //only push movies if they match our requested maturity ratings
        for (i = 0; i < this.state.movies_considered.length; i++) {
            let keep_movie = false;
            let movie_index = this.state.movies_considered[i];
            let movie_rating = this.state.movie_ratings[movie_index];
            if (movie_rating.localeCompare("NR") && this.state.include_NR) {
                keep_movie = true;
            } else if (movie_rating.localeCompare("R") && this.state.include_R) {
                keep_movie = true;
            } else if (movie_rating.localeCompare("PG-13") && this.state.include_PG13) {
                keep_movie = true;
            } else if (movie_rating.localeCompare("PG") && this.state.include_PG) {
                keep_movie = true;
            }
            if (keep_movie) {
                reduced_watchables_m.push(movie_index);
            }
        }

        let reduced_watchables_s = [];

        //only push the shows if non of the ratings are selected
        if (!(this.state.include_NR || this.state.include_R || this.state.include_PG13 || this.state.include_PG)) {
            for (i = 0; i < this.state.shows_considered.length; i++) {
                let show_index = this.state.shows_considered[i];
                reduced_watchables_s.push(show_index);
            }
        }

        this.setState({ movies_considered: reduced_watchables_m}, () => {
            this.setState({ shows_considered: reduced_watchables_s }, () => {
                return 1;
            });
        });
    }

    grabAvailableServices() {
        return this.state.available_services;
    }

    grabAvailableRatings() {
        return this.state.available_ratings;
    }

    //call this method in the dual-ranged bar for movie/show scores
    updateScoreEndsAndApply(low_end,high_end) { 
        this.setState({ selected_average: [low_end, high_end] }, () => {
            console.log(this.state.selected_average); 
            this.applyFilters();
        });
    }

    //call this after checking/un-checking Service Platforms, pass in array of all checked
    updateServicesAndApply(netflix, amPrime, hbo) {
        this.setState({include_netflix: netflix}, () => { 
            this.setState({include_prime: amPrime}, () => { 
                this.setState({include_hbo: hbo}, () => { 
                    this.applyFilters(); 
                });
            });
        });

    }

    //call this method after checking/un-checking whether movies and/or shows are allowed
    updateMediaAndApply(movies_allowed, shows_allowed) {
        this.setState({selected_media: [movies_allowed, shows_allowed] }, () => {
            console.log(this.state.selected_media);
            this.applyFilters();
        });
    }



    updateRatingsAndApply(nr, r, pg13, pg) {
        this.setState({include_NR: nr}, () => {
            this.setState({include_R: r}, () => { 
                this.setState({include_PG13: pg13}, () => { 
                    this.setState({include_PG: pg}, () => { 
                        this.applyFilters(); 
                    });
                });
            });
        });
        
    } 

    handleChange(event, newValue) { 
        // console.log(newValue);
         this.setState({selected_average: newValue}, () => {
            console.log(this.state.selected_average); 
        this.applyFilters(); 
         });
    }

    //call grabAvailableServices() to get set of services that can be options (use this to dynamically write HTML)
    //call grabAvailableRatings() to get set of maturity ratings that can be options (use for dynamic HTML as well)
    //call updateScoreEndsAndApply([float] new_low, [float] new_high) to set new score endpoints and apply them
    //call updateServicesAndApply([Array] SelectedServices) to set which services to include and apply them
    //call updateMediaAndApply([bool] movies_allowed, [bool] shows_allowed) to set if movies and/or shows are included
    //call updateRatingsAndApply([Array] SelectedRatings) to set which maturity ratings to include and apply them

    //HTML
    render() {
    return (
    <div className="main">
        <div className="nav-filters">
            {/* <div className="sort"> */}
                <h3 className='filter-header'>Filter by...</h3>
                <hr></hr>
                <Collapsible trigger="Vote Ratings" className="filter-head">
                    <br></br><br></br>
                    <div className='slider-box'>
                        <Slider className="slider" defaultValue={[0,10]} min={0} max={10} step={0.5} marks onChange={ (event, newValue) => this.handleChange(event, newValue)} valueLabelDisplay="on"/>
                        </div>
                </Collapsible>
                <br></br>
                <Collapsible trigger="Streaming Services" className="filter-head">
                    <label className="checkbox-label">
                        <input id="Netflix" type="checkbox" defaultChecked={true} onChange ={() => this.updateServicesAndApply(!this.state.include_netflix, this.state.include_prime, this.state.include_hbo)} /> 
                        <span>Netflix</span>
                        <br></br>
                        <input id="amazon" type='checkbox' defaultChecked={true} onChange ={() => this.updateServicesAndApply(this.state.include_netflix, !this.state.include_prime, this.state.include_hbo)}/>
                        <span>Amazon Prime</span>
                        <br></br>
                        <input id="hbo" type="checkbox" defaultChecked={true} onChange ={() => this.updateServicesAndApply(this.state.include_netflix, this.state.include_prime, !this.state.include_hbo)}/>
                        <span>HBO</span>
                        <br></br>
                    </label>
                </Collapsible>
                <br></br>
                <Collapsible trigger="Maturity Ratings" className="filter-head">
                <label className="checkbox-label">
                        <input id="NR" type="checkbox" defaultChecked={true} onChange ={()=>this.updateRatingsAndApply(!this.state.include_NR, this.state.include_R, this.state.include_PG13, this.state.include_PG)}/>
                        <span>NR</span>
                        <br></br>
                        <input id="r" type="checkbox" defaultChecked={true}onChange ={()=>this.updateRatingsAndApply(this.state.include_NR, !this.state.include_R, this.state.include_PG13, this.state.include_PG)}/>
                        <span>R</span>
                        <br></br>
                        <input id="PG-13" type="checkbox" defaultChecked={true} onChange ={()=>this.updateRatingsAndApply(this.state.include_NR, this.state.include_R, !this.state.include_PG13, this.state.include_PG)}/>
                        <span>PG-13</span>
                        <br></br>
                        <input id="PG" type="checkbox" defaultChecked={true} onChange ={()=>this.updateRatingsAndApply(this.state.include_NR, this.state.include_R, this.state.include_PG13, !this.state.include_PG)}/>
                        <span>PG</span>
                        <br></br>
                    </label>
                </Collapsible>
                <br></br>
                <Collapsible trigger="Media Type" className="filter-head">
                <input id="movies" type="checkbox" defaultChecked={true} onChange={() => this.updateMediaAndApply(!this.state.selected_media[0], this.state.selected_media[1])}/>
                    <span>Movies</span>
                    <br></br>
                    <input id="shows" type="checkbox" defaultChecked={true}  onChange={()=>this.updateMediaAndApply(this.state.selected_media[0],!this.state.selected_media[1])}/>
                    <span>TV Shows</span>
                </Collapsible>
                <br></br>
            {/* </div> */}
        </div>
        {/* {console.log(this.state.available_services)} */}
    </div>
        )
   } 
 }