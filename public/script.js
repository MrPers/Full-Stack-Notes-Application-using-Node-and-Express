const form = document.getElementById('note-form');
const titleInput = document.getElementById('title');
const textInput = document.getElementById('text');
const notesContainer = document.getElementById('notes-container');
const submitBtn = document.getElementById('submit-btn');

// State variable to track which note is being edited
let editingId = null;

// READ: Fetch notes from the server and render them to the DOM
async function fetchNotes() {
    const response = await fetch('/api/notes');
    const notes = await response.json();
    
    notesContainer.innerHTML = '';
    notes.forEach(note => {
        const noteEl = document.createElement('div');
        noteEl.className = 'note-card';
        noteEl.innerHTML = `
            <h3>${note.title}</h3>
            <p>${note.text}</p>
            <div class="actions">
                <button class="edit-btn" onclick="editNote('${note.id}', '${note.title}', '${note.text}')">Edit</button>
                <button class="delete-btn" onclick="deleteNote('${note.id}')">Delete</button>
            </div>
        `;
        notesContainer.appendChild(noteEl);
    });
}

// CREATE / UPDATE: Handle form submission
form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const title = titleInput.value;
    const text = textInput.value;

    if (editingId) {
        // PUT request to update an existing note
        await fetch(`/api/notes/${editingId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ title, text })
        });
        editingId = null;
        submitBtn.textContent = 'Add Note';
    } else {
        // POST request to create a new note
        await fetch('/api/notes', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ title, text })
        });
    }

    form.reset();
    fetchNotes();
});

// DELETE: Remove a note from the server by ID
async function deleteNote(id) {
    await fetch(`/api/notes/${id}`, { method: 'DELETE' });
    fetchNotes();
}

// UI: Populate form fields to prepare for editing
function editNote(id, title, text) {
    editingId = id;
    titleInput.value = title;
    textInput.value = text;
    submitBtn.textContent = 'Update Note';
}

// INITIALIZE: Load notes when the application starts
fetchNotes();