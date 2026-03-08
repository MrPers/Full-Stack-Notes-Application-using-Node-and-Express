# Full-Stack Notes Application

A simple full-stack notes app built with Node.js and Express.
It supports full CRUD functionality — you can create, read, update and delete notes.
All data is stored in a local JSON file.

## Tech Stack

- **Backend:** Node.js, Express 5
- **Frontend:** Vanilla HTML, CSS, JavaScript (Fetch API)
- **Data Storage:** `data.json` 

## Installation & Setup

```bash
# 1. Install dependencies
npm install

# 2. Start the server
node server.js
```

## Submission Links

- **URL:** `https://full-stack-notes-application-using-node-m8sj.onrender.com/`


## API

| Method   | Endpoint          | Description               |
|----------|-------------------|---------------------------|
| `GET`    | `/api/notes`      | Retrieve all notes        |
| `POST`   | `/api/notes`      | Create a new note         |
| `PUT`    | `/api/notes/:id`  | Update a note by ID       |
| `DELETE` | `/api/notes/:id`  | Delete a note by ID       |
