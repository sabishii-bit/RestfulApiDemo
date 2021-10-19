// Cody Sheets
// Last updated: 10/19/2021, 4:21PM PST
// Purpose is to demonstrate understanding of RESTful API construction and JSON manipulation
// Developed in JavaScript, Node.js, and Express

const express = require('express');         // Include express
const bodyParser = require('body-parser');  // Import body-parser
var path = require('./data.json');          // Load JSON file from path
const app = express();                      // Include express to app
app.use(express.json());
const port = process.env.PORT || 3000;      // Establish port

// Load JSON elements from file to a JSON object
fs = require('fs')
const buffer = fs.readFileSync(__dirname + '/data.json');
var JSONfile = JSON.parse(buffer);

// GET route - All data from JSON file
app.get('/', (req, res) => {
    res.send(JSON.stringify(JSONfile, null, 3));
    res.status = 200;
});

// GET route - item names
app.get('/recipes', (req, res) => {
    p = new Array();                            // Array for all item names
    for (var i = 0; i < JSONfile.recipes.length; i++) {
        p.push(JSONfile.recipes[i].name);       // Push all item names onto the array
    }
    res.send(JSON.stringify({"recipeNames": p}, null, 3));
    res.status = 200;
});

// GET route - item details
app.get('/recipes/details/:name', (req, res) => {
    const foodName = JSONfile.recipes.find(c => c.name === req.params.name);    // Get food name and representative elements into json object
    if (!foodName) {                                                            // 404 if not found
        res.status(404).send('404, item not found.');
        return;
    }
    // Logic to move all ingredients elements into new array for stringify
    var ingredientList = new Array();
    var cnt = foodName.instructions.length;                                     // Number of instructions in json object
    for (var i = 0; i < foodName.ingredients.length; i++) {                     // For loop to iterate through json object to get all ingredients into array
        ingredientList.push(foodName.ingredients[i]);
    }
    res.send(JSON.stringify({'details': {'ingredients': ingredientList, 'numSteps': cnt}}, null, 3));
    res.status = 200;
});

// POST route - user sends their own item to server
app.post('/recipes', (req, res) => {
    const input = {
        name: req.body.name,
        ingredients: req.body.ingredients,
        instructions: req.body.instructions
    };
    res.header("Content-Type",'application/json');
    // Catch logic for duplicate item name
    for (var i = 0; i < JSONfile.recipes.length; i++) {
        if (JSONfile.recipes[i].name === input.name) {
            res.status(400).send(JSON.stringify({'error': "Recipe already exists"}, null, 3));
            return;
        }
    }
    // Push the new item onto the array in JSONfile
    JSONfile.recipes.push(input);
    res.send(JSON.stringify(input));
    res.status(201);
});

// PUT route - user updates an existing item on the server
app.put('/recipes', (req, res) => {
    const input = {
        name: req.body.name,
        ingredients: req.body.ingredients,
        instructions: req.body.instructions
    };
    // Iterate through JSONfile to find the item
    for (var i = 0; i < JSONfile.recipes.length; i++) {
        if (JSONfile.recipes[i].name === input.name) {
            // Update recipes and return updated recipe body
            JSONfile.recipes.push(input);
            res.send(JSON.stringify(input));
            res.status(204);
            return;
        }
    }
    // If item name was never found in the loop
    res.status(404).send(JSON.stringify({'error': "Recipe does not exist"}, null, 3));
});

// DELETE route - user deletes an existing item from the server
app.delete('/recipes', (req, res) => {
    const input = {
        name: req.body.name
    };
    // find the item and delete it
    for (var i = 0; i < JSONfile.recipes.length; i++) {
        if (JSONfile.recipes[i].name === input.name) {
            JSONfile.recipes.splice(i, 1);
            res.send(JSON.stringify(JSONfile, null, 3));
            res.status(204);
            return;
        }
    }
    // If item name was never found in the loop
    res.status(404).send(JSON.stringify({'error': "Recipe does not exist"}, null, 3));
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});