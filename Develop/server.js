const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;

// Middleware for parsing JSON and urlencoded form data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// API route to get all notes
app.get('/api/notes', (req, res) => {
    const notes = JSON.parse(fs.readFileSync('./db/db.json', 'utf8'));
    res.json(notes);
});

// API route to add a new note
app.post('/api/notes', (req, res) => {
    const notes = JSON.parse(fs.readFileSync('./db/db.json', 'utf8'));
    const newNote = req.body;

    // Check if notes array is empty
    if (notes.length === 0) {
        newNote.id = 1;
    } else {
        // Otherwise, assign an ID that is one greater than the max ID in the array
        newNote.id = Math.max(...notes.map(note => note.id)) + 1;
    }
    
    notes.push(newNote);
    fs.writeFileSync('./db/db.json', JSON.stringify(notes, null, 2));
    res.json(newNote);
});

// Static files (moved after API routes)
app.use(express.static('public'));

// Return the notes.html file
app.get('/notes', (req, res) => {
    res.sendFile(path.join(__dirname, './public/notes.html'));
});

// Return the index.html file
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, './public/index.html'));
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
