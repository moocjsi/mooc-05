// Array to store notes locally in the browser
var notes = []

// Function to redraw the notes list on the page
var redrawNotes = function() {
  // Create a new <ul> element to hold the notes
  var ul = document.createElement('ul')
  ul.setAttribute('class', 'notes') // Add a CSS class for styling

  // Loop through each note and create a <li> element
  notes.forEach(function (note) {
    var li = document.createElement('li')
    li.appendChild(document.createTextNode(note.content)) // Add note content as text
    ul.appendChild(li) // Add <li> to the <ul>
  })

  // Find the container element where notes should be displayed
  var notesElement = document.getElementById("notes")

  // Remove any existing list before adding the new one
  if (notesElement.hasChildNodes()) {
    notesElement.removeChild(notesElement.childNodes[0])
  }

  // Add the new <ul> to the page
  notesElement.appendChild(ul)
}

// Create a new XMLHttpRequest to fetch notes from the server
var xhttp = new XMLHttpRequest()

// Define what happens when the server responds
xhttp.onreadystatechange = function () {
  // Check if the request is complete and successful
  if (this.readyState == 4 && this.status == 200) {
    notes = JSON.parse(this.responseText) // Parse the JSON response
    redrawNotes() // Display the notes on the page
  }
}

// Send a GET request to fetch notes (corrected path)
xhttp.open("GET", "/data.json", true)
xhttp.send()

// Function to send a new note to the server
var sendToServer = function (note) {
  var xhttpForPost = new XMLHttpRequest()

  // Handle the server response
  xhttpForPost.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 201) {
      console.log(this.responseText) // Log confirmation from server
    }
  }

  // Send a POST request with the note data (corrected path)
  xhttpForPost.open("POST", '/new_note_spa', true)
  xhttpForPost.setRequestHeader("Content-type", "application/json")
  xhttpForPost.send(JSON.stringify(note)) // Convert note to JSON and send
}

// When the page loads, set up the form submission handler
window.onload = function () {
  var form = document.getElementById("notes_form")

  // Intercept the form submission
  form.onsubmit = function (e) {
    e.preventDefault() // Prevent the default page reload

    // Create a new note object from the input field
    var note = {
      content: e.target.elements[0].value,
      date: new Date() // Add current date
    }

    notes.push(note) // Add note to local array
    e.target.elements[0].value = "" // Clear the input field
    redrawNotes() // Update the notes list on the page
    sendToServer(note) // Send the note to the server
  }
}
