// Import required modules
const express = require('express') // Express is a web framework for Node.js
const path = require('path')       // Path helps handle file paths
const bodyParser = require('body-parser') // Middleware to parse incoming request bodies

const PORT = process.env.PORT || 5000 // Use environment port or default to 5000
const MAX_NOTES = 100                 // Limit the number of stored notes
const app = express()                // Create an Express application

// Middleware to parse form data and JSON
app.use(bodyParser.urlencoded({ extended: true })) // Parse URL-encoded form data
app.use(bodyParser.json())                         // Parse JSON data

// Serve static files (like CSS, JS, images) from the "exampleapp" folder
// These files will be accessible via URLs starting with /exampleapp
app.use('/exampleapp', express.static(path.join(__dirname, 'exampleapp')))

// In-memory array to store notes
const notes = [
  { content: 'HTML is easy', date: new Date('2019-05-23T17:30:31.098Z') },
  { content: 'Browser can execute only Javascript', date: new Date('2019-05-23T18:39:34.091Z') },
  { content: 'Most important methods of HTTP-protocol are GET and POST', date: new Date('2019-05-23T19:20:14.298Z') },
]

// Helper function to validate a note object
const isValidNote = note =>
  typeof note === 'object' &&
  typeof note.content === 'string' &&
  !isNaN(new Date(note.date).getTime())

// Add a new note to the array and remove the oldest if over the limit
const createNote = note => {
  notes.push(note)
  if (notes.length > MAX_NOTES) notes.shift()
}

// Format a note to ensure content is trimmed and date is valid
const formatNote = note => ({
  content: note.content.substring(0, 200),
  date: new Date(note.date),
})

// HTML page for the traditional notes view
const notes_page = `
<!DOCTYPE html>
<html>
<head>
  <link rel="stylesheet" type="text/css" href="/exampleapp/main.css" />
  <script type="text/javascript" src="/exampleapp/main.js"></script>
</head>
<body>
  <div class='container'>
    <h1>Notes</h1>
    <div id='notes'></div>
    <form action='/new_note' method='POST'>
      <input type="text" name="note"><br>
      <input type="submit" value="Save">
    </form>
  </div>
</body>
</html>
`

// HTML page for the single-page app (SPA) version
const notes_spa = `
<!DOCTYPE html>
<html>
<head>
  <link rel="stylesheet" type="text/css" href="/exampleapp/main.css" />
  <script type="text/javascript" src="/exampleapp/spa.js"></script>
</head>
<body>
  <div class='container'>
    <h1>Notes -- single page app</h1>
    <div id='notes'></div>
    <form id='notes_form'>
      <input type="text" name="note"><br>
      <input type="submit" value="Save">
    </form>
  </div>
</body>
</html>
`

// Function to generate the front page HTML
const getFrontPageHtml = noteCount => `
<!DOCTYPE html>
<html>
  <head></head>
  <body>
    <div class='container'>
      <h1>Full Stack example app</h1>
      <p>number of notes created ${noteCount}</p>
      <a href='/notes'>notes</a>
      <img src='/exampleapp/kuva.png' width='200' />
    </div>
  </body>
</html>
`

// Create a router to define routes (URLs) and their handlers
const router = express.Router()

// Route: GET / → show the front page
router.get('/', (req, res) => {
  res.send(getFrontPageHtml(notes.length))
})

// Route: GET /reset → clear all notes
router.get('/reset', (req, res) => {
  notes.splice(0, notes.length) // Empty the notes array
  res.status(201).send({ message: 'notes reset' })
})

// Route: GET /notes → show the traditional notes page
router.get('/notes', (req, res) => {
  res.send(notes_page)
})

// Route: GET /spa → show the single-page app version
router.get('/spa', (req, res) => {
  res.send(notes_spa)
})

// Route: GET /data.json → return notes as JSON (used by frontend JS)
router.get('/data.json', (req, res) => {
  res.json(notes)
})

// Route: POST /new_note_spa → add a note via SPA (expects JSON)
router.post('/new_note_spa', (req, res) => {
  if (!isValidNote(req.body)) {
    return res.status(400).send('invalid note')
  }
  createNote(formatNote(req.body))
  res.status(201).send({ message: 'note created' })
})

// Route: POST /new_note → add a note via form submission
router.post('/new_note', (req, res) => {
  if (typeof req.body.note === 'string') {
    createNote(formatNote({ content: req.body.note, date: new Date() }))
  }
  res.redirect('/notes') // Redirect back to the notes page
})

// Use the router for all routes starting from root
app.use('/', router)

// Start the server and listen on the specified port
app.listen(PORT, () => console.log(`Listening on ${PORT}`))
