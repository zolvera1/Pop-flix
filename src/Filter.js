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
                let movie_plats = Filter.reduceArrOfArr(this.state.movie_platforms);
                movie_plats.forEach(v => this.state.available_services.add(v));

                //dynamically generate which maturity ratings are available
                let ratings = Filter.reduceArr(this.state.movie_ratings);
                ratings.forEach(v => this.state.available_ratings.add(v));

                console.log(this.state.available_ratings);
                console.log(this.state.available_services);
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
                let show_plats = Filter.reduceArrOfArr(this.state.show_platforms);
                show_plats.forEach(v => this.state.available_services.add(v));

                //dynamically generate which maturity ratings are available
                let ratings = Filter.reduceArr(this.state.show_ratings);
                ratings.forEach(v => this.state.available_ratings.add(v));
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
        let movies_considered_reset = [];
        let shows_considered_reset = [];

        //initially set all movies and all shows to be considered
        for (i = 0; i < this.state.movies_all.length; i++) {
            movies_considered_reset.push(i);
        }
        for (i = 0; i < this.state.shows_all.length; i++) {
            shows_considered_reset.push(i);
        }

        this.setState({ movies_considered: movies_considered_reset });
        this.setState({ shows_considered: shows_considered_reset });

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

    grabAvailableServices() {
        return this.state.available_services;
    }

    grabAvailableRatings() {
        return this.state.available_ratings;
    }

    //call this method in the dual-ranged bar for movie/show scores
    updateScoreEndsAndApply(low_end, high_end) {
        this.setState({ selected_average: [low_end, high_end] });
        this.applyFilters();
    }

    //call this after checking/un-checking Service Platforms, pass in array of all checked
    updateServicesAndApply(arrayOfSelectedServices) {
        let i;
        this.state.selected_services.clear();
        for (i = 0; i < arrayOfSelectedServices.length; i++) {
            let a_service = arrayOfSelectedServices[i];
            if (this.state.available_services.contains(a_service)) {
                this.state.selected_services.add(a_service);
            }
        }
        this.applyFilters();
    }

    //call this method after checking/un-checking whether movies and/or shows are allowed
    updateMediaAndApply(movies_allowed, shows_allowed) {
        this.setState({ selected_media: [movies_allowed, shows_allowed] });
        console.log("checked");
        // this.applyFilters();
    }

    updateRatingsAndApply(arrayOfSelectedRatings) {
        let i;
        this.state.selected_ratings.clear();
        for (i = 0; i < arrayOfSelectedRatings.length; i++) {
            let a_rating = arrayOfSelectedRatings[i];
            if (this.state.available_ratings.contains(a_rating)) {
                this.state.selected_ratings.add(a_rating);
            }
        }
        this.applyFilters();
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
                        <input id="Netflix" type="checkbox" defaultChecked={true}/>
                        <span>Netflix</span>
                        <br></br>
                        <input id="amazon" type='checkbox' defaultChecked={true}/>
                        <span>Amazon Prime</span>
                        <br></br>
                        <input id="hbo" type="checkbox" defaultChecked={true}/>
                        <span>HBO</span>
                        <br></br>
                        <input id="hulu" type="checkbox" defaultChecked={true}/>
                        <span>Hulu</span>
                        <br></br>
                    </label>
                </Collapsible>
                <br></br>
                <Collapsible trigger="Maturity Ratings" className="filter-head">
                <label className="checkbox-label">
                        <input id="NR" type="checkbox" defaultChecked={true}/>
                        <span>NR</span>
                        <br></br>
                        <input id="r" type="checkbox" defaultChecked={true}/>
                        <span>R</span>
                        <br></br>
                        <input id="PG-13" type="checkbox" defaultChecked={true}/>
                        <span>PG-13</span>
                        <br></br>
                        <input id="PG" type="checkbox" defaultChecked={true}/>
                        <span>PG</span>
                        <br></br>
                    </label>
                </Collapsible>
                <br></br>
                <Collapsible trigger="Media Type" className="filter-head">
                <input id="movies" type="checkbox" defaultChecked={true} onChange={() => this.updateMediaAndApply(true, false)}/>
                    <span>Movies</span>
                    <br></br>
                    <input id="shows" type="checkbox" defaultChecked={true}  onChange={()=>this.updateMediaAndApply(false, true)}/>
                    <span>TV Shows</span>
                </Collapsible>
                <br></br>
            </div>
        </div>
        {/* {document.write(<h1>hello</h1>)} */}
    </div>
        )
   } 
 }