// require modules
const express = require('express');
const fs = require('fs');
const path = require('path'); 

// routes
const apiRoutes = require('./routes/apiRoutes');
const htmlRoutes = require('./routes/htmlRoutes'); 

const PORT = process.env.PORT || 3001; 

// instantiate the server
const app = express(); 

// parse incoming string or array data
app.use(express.urlencoded ( { extended: true }));
// parse incoming JSON data
app.use(express.json());

// api routes
app.use('/api', apiRoutes);
app.use('/', htmlRoutes); 

// middleware for public files
app.use(express.static('public')); 

// request data 
const { animals } = require('./data/animals.json');

// chain listen() method onto our servers 
app.listen(PORT, () => {
    console.log(`API server now on port ${PORT}!`);
});


