const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('public'));

// API route to get all notes
app.get('/api/notes', (req, res) => {
    const notes = JSON.parse(fs.readFileSync('./db/db.json', 'utf8'));
    res.json(notes);
});

// API route to add a new note
app.post('/api/notes', (req, res) => {
    const notes = JSON.parse(fs.readFileSync('./db/db.json', 'utf8'));
    const newNote = req.body;

    if (notes.length === 0) {
        newNote.id = 1;
    } else {
        // Filter out any notes that do not have a valid ID
        const validIds = notes.map(note => note.id).filter(id => typeof id === 'number' && id > 0);
        newNote.id = validIds.length ? Math.max(...validIds) + 1 : 1;
    }

    notes.push(newNote);
    fs.writeFileSync('./db/db.json', JSON.stringify(notes, null, 2));
    res.json(newNote);
});

// HTML route to serve the notes page
app.get('/notes', (req, res) => {
    res.sendFile(path.join(__dirname, '/public/notes.html'));
});

// Catch-all route to serve the home page
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '/public/index.html'));
});

app.delete('/api/notes/:id', (req, res) => {
    const noteId = parseInt(req.params.id);  // Get the ID from the URL and convert it to a number
    const notes = JSON.parse(fs.readFileSync('./db/db.json', 'utf8'));  // Read the notes from the JSON file
    
    // Create a new array that doesn't contain the note with the specified ID
    const newNotes = notes.filter(note => note.id !== noteId);
    
    fs.writeFileSync('./db/db.json', JSON.stringify(newNotes, null, 2));  // Write the new notes array back to the JSON file
    
    res.json({ message: `Note with ID: ${noteId} deleted` });  // Send a response back to the client
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
