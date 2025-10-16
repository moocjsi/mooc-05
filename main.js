// Create a new XMLHttpRequest object to fetch notes from the server
var xhttp = new XMLHttpRequest()

// Define what happens when the server responds
xhttp.onreadystatechange = function () {
  // Check if the request is complete and successful
  if (this.readyState == 4 && this.status == 200) {
    const data = JSON.parse(this.responseText) // Parse the JSON response
    console.log(data) // Log the notes to the console for debugging

    // Create a new <ul> element to hold the notes
    var ul = document.createElement('ul')
    ul.setAttribute('class', 'notes') // Add a CSS class for styling

    // Loop through each note and create a <li> element
    data.forEach(function(note){
      var li = document.createElement('li')
      li.appendChild(document.createTextNode(note.content)) // Add note content as text
      ul.appendChild(li) // Add <li> to the <ul>
    })

    // Find the container element where notes should be displayed
    document.getElementById("notes").appendChild(ul)
  }
}

// Send a GET request to fetch notes from the server (corrected path)
xhttp.open("GET", "/data.json", true)
xhttp.send()
