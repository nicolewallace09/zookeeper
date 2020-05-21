const router = require('express').Router();

const { filterByQuery, findById, createNewAnimal, validateAnimal } = require('../../lib/animals');
const { animals } = require('../../data/animals'); 

// route - get requires two arguments 1. describes the route, 2. call back function that will execute every time it is accessed with a GET request 
router.get('/animals', (req, res) => {
    let results = animals; 
    // req is request 
    if (req.query) {
        results = filterByQuery(req.query, results); 
    }
    // res is response to client 
    res.json(results);
});

// calling for specific animals 
router.get('/animals/:id', (req, res) => {
    const result = findById(req.params.id, animals);
    if (result) {
        res.json(result); 
    } else {
        res.send(404); 
    }
});

// route to server to accept data to be used or stored server-side
router.post('/animals', (req, res) => {
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

module.exports = router; 