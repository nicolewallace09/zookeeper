// require modules
const express = require('express');
const fs = require('fs');
const path = require('path'); 

const PORT = process.env.PORT || 3001; 

// instantiate the server
const app = express(); 

// parse incoming string or array data
app.use(express.urlencoded ( { extended: true }));
// parse incoming JSON data
app.use(express.json());

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

function findById(id, animalsArray) {
    const result = animalsArray.filter(animal => animal.id === id) [0];
    return result; 
}

// function handling taking the data from req.body and adding it to our animals.json file
function createNewAnimal (body, animalsArray) {
    const animal = body; 
    animalsArray.push(animal); 
    fs.writeFileSync(
        path.join(__dirname, './data/animals.json'),
        // converting JS array to JSON 
        JSON.stringify({ animals : animalsArray }, null, 2)
    
    );
    // return finished code to post route for response
    return animal; 
}

// validating data
function validateAnimal (animal) {
    if (!animal.name || typeof animal.name !== 'string') {
        return false; 
    }
    if (!animal.species || typeof animal.species !== "string") {
        return false;
    }
    if (!animal.diet || typeof animal.diet !== 'string') {
        return false; 
    }
    if (!animal.personalityTraits || !Array.isArray(animal.personalityTraits)) {
        return false;
    }
    return true;   
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

// calling for specific animals 
app.get('/api/animals/:id', (req, res) => {
    const result = findById(req.params.id, animals);
    if (result) {
        res.json(result); 
    } else {
        res.send(404); 
    }
});

// route to server to accept data to be used or stored server-side
app.post('/api/animals', (req, res) => {
    // set id based on what the next index of the array will be 
    req.body.id = animals.length.toString(); 

    // if any data in req.body is incorrect, send error
    if (!validateAnimal(req.body)) {
        res.status(400).send('The animal is not properly formatted.'); 
    } else {
    // add animal to json file and animals array in this function 
    const animal = createNewAnimal(req.body, animals); 

    res.json(animal); 
    }
});

// chain listen() method onto our servers 
app.listen(PORT, () => {
    console.log(`API server now on port ${PORT}!`);
});


