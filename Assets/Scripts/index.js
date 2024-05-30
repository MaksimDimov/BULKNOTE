import { notesData } from './data.js';

// Selecting necessary elements from the DOM
let rightPanel = document.querySelector('.right-panel');
let notesListContainer = document.querySelector('.notes-list-container');
let createButton = document.querySelector('.create-button');
let leftPanel = document.querySelector('.left-panel');

// Function to create a panel with input fields for creating a new note
function createNotePanel() {
    // Clear the right panel first
    rightPanel.innerHTML = ''; 

    // Create input field for note name
    let noteNameInput = document.createElement('input');
    noteNameInput.type = 'text';
    noteNameInput.placeholder = 'Enter note name';
    noteNameInput.maxLength = 50;
    noteNameInput.className = 'title-of-note';

    // Create a solid line for visual separation
    let solidLine = document.createElement('hr');
    solidLine.className = 'solid-line';

    // Create textarea for note text
    let noteTextInput = document.createElement('textarea');
    noteTextInput.placeholder = 'Enter note text';
    noteTextInput.maxLength = 1000;
    noteTextInput.className = 'text-of-note';

    // Create a button for saving the note
    let saveButton = document.createElement('button');
    saveButton.className = 'save-button';

    let saveButtonText = document.createElement('p');
    saveButtonText.textContent = 'Save';

    saveButton.appendChild(saveButtonText);

    // Append all created elements to the right panel
    rightPanel.appendChild(noteNameInput);
    rightPanel.appendChild(solidLine);
    rightPanel.appendChild(noteTextInput);
    rightPanel.appendChild(saveButton);

    // Add event listener to the save button
    saveButton.addEventListener('click', function () {
        // Get values from input fields
        let noteName = noteNameInput.value;
        let noteText = noteTextInput.value;

        // Save the note
        let timestamp = saveNote(noteName, noteText);
        console.log('New note created with ID:', timestamp);

        // Clear input fields after saving the note
        noteNameInput.value = '';
        noteTextInput.value = '';
    });
}

// Function to save a new note
function saveNote(noteName, noteText) {
    // Check if any field is empty and don't save the note if name or text is empty
    if (!noteName || !noteText) {
        return; 
    } else {
        // Generate timestamp for note ID
        let timestamp = new Date().getTime();
        let newNote = { id: timestamp, name: noteName, content: noteText };

        // Get notes from local storage
        let existingNotes = JSON.parse(localStorage.getItem('notesData')) || [];

        // Push new note into notes field
        existingNotes.push(newNote);

        // Save updated notesData to localStorage
        localStorage.setItem('notesData', JSON.stringify(existingNotes));

        // Create a button for the new note and append it to the left panel
        let newNoteButton = createNoteButton(newNote);
        leftPanel.appendChild(newNoteButton);

        return timestamp;
    }
}

// Function to create a note button that will display in the container for notes
function createNoteButton(note) {
    let noteButton = document.createElement('button');
    noteButton.className = 'note-button';
    noteButton.textContent = note.name;
    noteButton.id = 'note-' + note.id;

    // Add event listener to the note button to display the note content
    noteButton.addEventListener('click', function () {
        displayNote(note); 
        console.log('Note button was clicked!');
    });

    // Create a delete button for the note
    let deleteButton = document.createElement('img');
    deleteButton.className = 'delete-button';
    deleteButton.src = 'Assets/Images/45372.png'; // Image path
    deleteButton.alt = 'Delete';

    // Add event listener to the delete button to delete the note
    deleteButton.addEventListener('click', function (e) {
        e.stopPropagation(); // Prevent the note button click event
        deleteNote(note.id);
    });

    // Append delete button to the note button
    noteButton.appendChild(deleteButton);

    return noteButton;
}

// Function to delete a note
function deleteNote(noteId) {
    // Get notes from local storage
    let existingNotes = JSON.parse(localStorage.getItem('notesData')) || [];

    // Filter out the note to be deleted
    let updatedNotes = existingNotes.filter(note => note.id !== noteId);

    // Save updated notesData to localStorage
    localStorage.setItem('notesData', JSON.stringify(updatedNotes));

    // Remove the note button from the left panel
    let noteButton = document.getElementById('note-' + noteId);
    noteButton.remove();

    // Clear the right panel if the displayed note is deleted
    if (rightPanel.firstChild && rightPanel.firstChild.id === 'note-' + noteId) {
        rightPanel.innerHTML = '';
    }

    console.log('Note deleted with ID:', noteId);
}

// Function to load notes
function loadNotes() {
    // Load notesData from localStorage
    let loadedNotesData = JSON.parse(localStorage.getItem('notesData')) || [];

    // Update the notesData array
    notesData.splice(0, notesData.length, ...loadedNotesData);

    // Create a button for each note
    for (let note of notesData) {
        let noteButton = createNoteButton(note);
        notesListContainer.appendChild(noteButton);
    }
}

// Function to display note content in the right panel
function displayNote(note) {
    // Clear the right panel first if there was something
    rightPanel.innerHTML = ''; 

    // Create elements to display note content
    let noteName = document.createElement('h2');
    noteName.textContent = note.name;
    noteName.className = 'note-title';
    noteName.id = 'note-' + note.id;

    let solidLine = document.createElement('hr');
    solidLine.className = 'solid-line';

    let noteContent = document.createElement('p');
    noteContent.textContent = note.content;
    noteContent.className = 'note-content';

    // Append elements to the right panel
    rightPanel.appendChild(noteName);
    rightPanel.appendChild(solidLine);
    rightPanel.appendChild(noteContent);
}

// Load notes when the window is loaded
window.onload = loadNotes;

// Add event listener to the create button to create a new note panel
createButton.addEventListener('click', function () {
    createNotePanel();
    console.log('Create button was clicked!');
});
