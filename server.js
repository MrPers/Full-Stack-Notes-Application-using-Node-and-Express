const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware для чтения JSON и раздачи статических файлов из папки public
app.use(express.json());
app.use(express.static('public'));

const dataPath = path.join(__dirname, 'data.json');

// Вспомогательная функция для чтения файла
const getNotes = () => {
    try {
        const data = fs.readFileSync(dataPath, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        return [];
    }
};

// Вспомогательная функция для записи в файл
const saveNotes = (notes) => {
    fs.writeFileSync(dataPath, JSON.stringify(notes, null, 2));
};

// READ: Получить все заметки
app.get('/api/notes', (req, res) => {
    res.json(getNotes());
});

// CREATE: Создать новую заметку
app.post('/api/notes', (req, res) => {
    const { title, text } = req.body;
    if (!title || !text) {
        return res.status(400).json({ error: 'Title and text are required' });
    }
    const notes = getNotes();
    const newNote = { id: Date.now().toString(), title, text };
    notes.push(newNote);
    saveNotes(notes);
    res.status(201).json(newNote);
});

// UPDATE: Обновить существующую заметку
app.put('/api/notes/:id', (req, res) => {
    const { id } = req.params;
    const { title, text } = req.body;
    const notes = getNotes();
    const noteIndex = notes.findIndex(n => n.id === id);
    
    if (noteIndex === -1) {
        return res.status(404).json({ error: 'Note not found' });
    }
    
    notes[noteIndex] = { ...notes[noteIndex], title, text };
    saveNotes(notes);
    res.json(notes[noteIndex]);
});

// DELETE: Удалить заметку
app.delete('/api/notes/:id', (req, res) => {
    const { id } = req.params;
    let notes = getNotes();
    const initialLength = notes.length;
    notes = notes.filter(n => n.id !== id);
    
    if (notes.length === initialLength) {
        return res.status(404).json({ error: 'Note not found' });
    }
    
    saveNotes(notes);
    res.status(204).send();
});

// Запуск сервера
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});