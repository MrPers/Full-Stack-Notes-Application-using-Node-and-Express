const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware to parse JSON bodies and serve static files
app.use(express.json());
app.use(express.static('public'));

const dataPath = path.join(__dirname, 'data.json');

// Helper function to read notes from the JSON file
const getNotes = () => {
    try {
        if (!fs.existsSync(dataPath)) {
            return [];
        }
        const data = fs.readFileSync(dataPath, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        console.error('Error reading notes:', error);
        return []; // Return empty array if reading fails
    }
};

// Helper function to save notes to the JSON file
const saveNotes = (notes) => {
    try {
        fs.writeFileSync(dataPath, JSON.stringify(notes, null, 2));
    } catch (error) {
        console.error('Error saving notes:', error);
        throw new Error('Could not save data');
    }
};

// READ: Get all notes
app.get('/api/notes', (req, res) => {
    try {
        const notes = getNotes();
        res.json(notes);
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
});

// CREATE: Add a new note
app.post('/api/notes', (req, res) => {
    const { title, text } = req.body;
    
    // Validate request body
    if (!title || !text) {
        return res.status(400).json({ error: 'Title and text are required' });
    }
    
    try {
        const notes = getNotes();
        const newNote = { id: Date.now().toString(), title, text };
        notes.push(newNote);
        saveNotes(notes);
        res.status(201).json(newNote);
    } catch (error) {
        res.status(500).json({ error: 'Failed to save note' });
    }
});

// UPDATE: Modify an existing note
app.put('/api/notes/:id', (req, res) => {
    const { id } = req.params;
    const { title, text } = req.body;
    
    try {
        const notes = getNotes();
        const noteIndex = notes.findIndex(n => n.id === id);
        
        if (noteIndex === -1) {
            return res.status(404).json({ error: 'Note not found' });
        }
        
        notes[noteIndex] = { ...notes[noteIndex], title, text };
        saveNotes(notes);
        res.json(notes[noteIndex]);
    } catch (error) {
        res.status(500).json({ error: 'Failed to update note' });
    }
});

// DELETE: Remove a note
app.delete('/api/notes/:id', (req, res) => {
    const { id } = req.params;
    
    try {
        let notes = getNotes();
        const initialLength = notes.length;
        notes = notes.filter(n => n.id !== id);
        
        if (notes.length === initialLength) {
            return res.status(404).json({ error: 'Note not found' });
        }
        
        saveNotes(notes);
        res.status(204).send(); // 204 No Content
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete note' });
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});