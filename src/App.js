import React from 'react';
import logo from './logo.svg';
import './App.css';

function App() {
  return (
    <div className="App">
       <div class='topnav'>
                <input type="text" placeholder="Search..." name='search'></input>
        </div>
        <div class='nav-filters'>
            <h4>Ratings</h4>
            <h4>Streaming Service</h4>
            <h4>Genre</h4>
            <h4>Length</h4>
            <h4>Media Type</h4>
        </div>
        <div class = "header-container"> 
            <h1>Movie Collection</h1>
        </div>
        
        <div class = "movies">
            <p> this is where all the movies would go</p>
        </div>
    </div>
  );
}

export default App;
