const express = require('express');

const PORT = process.env.PORT || 3001; 

// instantiate the server
const app = express(); 

// request data 
const { animals } = require('./data/animals.json');

// function 
function filterByQuery (query, animalsArray) {
    let personalityTraitsArray = [];

    // saved the animal array here 
    let filteredResults = animalsArray; 

    if (query.personalityTraits) {
        // save personality traits as a dedicated array 
        // if personality traits is a string, place it into a new array 
        if (typeof query.personalityTraits === 'string') {
            personalityTraitsArray = [query.personalityTraits];
        } else {
            personalityTraitsArray = query.personalityTraits; 
        }
        // loop through each trait 
        personalityTraitsArray.forEach(trait => {
            // Check the trait against each animal in the filteredResults array.
            // Remember, it is initially a copy of the animalsArray,
            // but here we're updating it for each trait in the .forEach() loop.
            // For each trait being targeted by the filter, the filteredResults
            // array will then contain only the entries that contain the trait,
            // so at the end we'll have an array of animals that have every one 
            // of the traits when the .forEach() loop is finished.
            filteredResults = filteredResults.filter(animal => animal.personalityTraits.indexOf(trait) !== -1
            );
        });
    }
    if (query.diet) {
        filteredResults = filteredResults.filter(animal => animal.diet === query.diet); 
    }
    if (query.species) {
        filteredResults = filteredResults.filter(animal => animal.species === query.species);
    }
    if (query.name) {
        filteredResults = filteredResults.filter(animal => animal.name === query.name); 
    }
    return filteredResults; 
}

// route - get requires two arguments 1. describes the route, 2. call back function that will execute every time it is accessed with a GET request 
app.get('/api/animals', (req, res) => {
    let results = animals; 
    // req is request 
    if (req.query) {
        results = filterByQuery(req.query, results); 
    }
    // res is response to client 
    res.json(results);
});

// chain listen() method onto our servers 
app.listen(PORT, () => {
    console.log(`API server now on port ${PORT}!`);
});


