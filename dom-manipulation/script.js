document.addEventListener('DOMContentLoaded', function() {
  
    // Array to store quote objects (text and category)
    let quotes = [
      { text: "Life is what happens when you're busy making other plans.", category: "Life" },
      { text: "Do or do not, there is no try.", category: "Motivation" },
      { text: "The only way to do great work is to love what you do.", category: "Work" }
    ];
  
    // DOM elements
    const quoteDisplay = document.getElementById('quoteDisplay');
    const newQuoteButton = document.getElementById('newQuote');
  
    // Function to show a random quote
    function showRandomQuote() {
      const randomIndex = Math.floor(Math.random() * quotes.length);
      const randomQuote = quotes[randomIndex];
  
      // Use innerHTML to display the quote with some styling
      quoteDisplay.innerHTML = `<p>"${randomQuote.text}"</p><small>Category: ${randomQuote.category}</small>`;
    }
  
    // Function to add a new quote
    function addQuote() {
      const quoteText = document.getElementById('newQuoteText').value.trim();
      const quoteCategory = document.getElementById('newQuoteCategory').value.trim();
      
      if (quoteText === "" || quoteCategory === "") {
        alert("Please enter both a quote and a category.");
        return;
      }
  
      // Add the new quote to the array
      const newQuote = { text: quoteText, category: quoteCategory };
      quotes.push(newQuote);
  
      // Clear the input fields after adding
      document.getElementById('newQuoteText').value = '';
      document.getElementById('newQuoteCategory').value = '';
  
      // Display a success message using innerHTML
      quoteDisplay.innerHTML = `<p>New quote added successfully: <br> "${newQuote.text}"</p><small>Category: ${newQuote.category}</small>`;
    }
  
    // Function to create the "Add Quote" form dynamically
    function createAddQuoteForm() {
      const formContainer = document.createElement('div');
      formContainer.id = 'formContainer';
  
      // Create input for new quote text
      const inputQuote = document.createElement('input');
      inputQuote.id = 'newQuoteText';
      inputQuote.type = 'text';
      inputQuote.placeholder = 'Enter a new quote';
  
      // Create input for new quote category
      const inputCategory = document.createElement('input');
      inputCategory.id = 'newQuoteCategory';
      inputCategory.type = 'text';
      inputCategory.placeholder = 'Enter quote category';
  
      // Create the "Add Quote" button
      const addQuoteBtn = document.createElement('button');
      addQuoteBtn.id = 'addQuoteBtn';
      addQuoteBtn.textContent = 'Add Quote';
      addQuoteBtn.addEventListener('click', addQuote);
  
      // Append inputs and button to form container
      formContainer.appendChild(inputQuote);
      formContainer.appendChild(inputCategory);
      formContainer.appendChild(addQuoteBtn);
  
      // Append form container to the body or any other place in the DOM
      document.body.appendChild(formContainer);
    }
  
    // Call the function to create the form when the page loads
    createAddQuoteForm();
  
    // Add event listener to the "Show New Quote" button
    newQuoteButton.addEventListener('click', showRandomQuote);
  
  });
  
  // Function to save quotes to local storage
function saveQuotes() {
    localStorage.setItem('quotes', JSON.stringify(quotes));
  }
  
  // Function to load quotes from local storage on page load
  function loadQuotes() {
    const storedQuotes = JSON.parse(localStorage.getItem('quotes'));
    if (storedQuotes && storedQuotes.length > 0) {
      quotes = storedQuotes;
    }
  }
  
  // Call loadQuotes when the page is loaded
  document.addEventListener('DOMContentLoaded', function() {
    loadQuotes();
    createAddQuoteForm(); // Create form for adding quotes
  });

  // Function to save the last viewed quote in session storage
function saveLastViewedQuote(quoteText) {
    sessionStorage.setItem('lastQuote', quoteText);
  }
  
  // Load the last viewed quote on page load (from session storage)
  function loadLastViewedQuote() {
    const lastQuote = sessionStorage.getItem('lastQuote');
    if (lastQuote) {
      quoteDisplay.innerHTML = `<p>${lastQuote}</p>`;
    }
  }
  
  // Modify showRandomQuote to save the last displayed quote
  function showRandomQuote() {
    const randomIndex = Math.floor(Math.random() * quotes.length);
    const randomQuote = quotes[randomIndex];
    quoteDisplay.innerHTML = `<p>"${randomQuote.text}"</p><small>Category: ${randomQuote.category}</small>`;
    saveLastViewedQuote(randomQuote.text); // Save to session storage
  }

  // Function to export quotes as a JSON file
function exportQuotes() {
    const dataStr = JSON.stringify(quotes, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
  
    // Create a temporary download link and click it
    const downloadLink = document.createElement('a');
    downloadLink.href = url;
    downloadLink.download = 'quotes.json';
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
  }
  
  // Button to trigger export
  const exportButton = document.createElement('button');
  exportButton.textContent = 'Export Quotes';
  exportButton.addEventListener('click', exportQuotes);
  document.body.appendChild(exportButton);

  // Function to import quotes from a JSON file
function importFromJsonFile(event) {
    const fileReader = new FileReader();
    fileReader.onload = function(event) {
      try {
        const importedQuotes = JSON.parse(event.target.result);
        if (Array.isArray(importedQuotes)) {
          quotes.push(...importedQuotes);
          saveQuotes(); // Save to local storage
          alert('Quotes imported successfully!');
        } else {
          alert('Invalid JSON format');
        }
      } catch (error) {
        alert('Error reading the file');
      }
    };
    fileReader.readAsText(event.target.files[0]);
  }
  
  // Create the file input for importing quotes
  const importInput = document.createElement('input');
  importInput.type = 'file';
  importInput.accept = '.json';
  importInput.addEventListener('change', importFromJsonFile);
  document.body.appendChild(importInput);

  function populateCategories() {
    const categoryFilter = document.getElementById('categoryFilter');
    const uniqueCategories = [...new Set(quotes.map(quote => quote.category))];

    // Clear existing options and add default 'all' option
    categoryFilter.innerHTML = `<option value="all">All Categories</option>`;

    uniqueCategories.forEach(category => {
        const option = document.createElement('option');
        option.value = category;
        option.textContent = category;
        categoryFilter.appendChild(option);
    });
}

function filterQuotes() {
    const selectedCategory = document.getElementById('categoryFilter').value;
    const quoteDisplay = document.getElementById('quoteDisplay');

    // Filter the quotes based on the selected category
    const filteredQuotes = selectedCategory === 'all'
        ? quotes
        : quotes.filter(quote => quote.category === selectedCategory);

    // Display the filtered quotes
    quoteDisplay.innerHTML = filteredQuotes.length
        ? filteredQuotes.map(quote => `<p>${quote.text} - <em>${quote.category}</em></p>`).join('')
        : `<p>No quotes found for category "${selectedCategory}"</p>`;
}

function saveSelectedCategory() {
    const selectedCategory = document.getElementById('categoryFilter').value;
    localStorage.setItem('selectedCategory', selectedCategory);
}

function loadSelectedCategory() {
    const savedCategory = localStorage.getItem('selectedCategory');
    if (savedCategory) {
        document.getElementById('categoryFilter').value = savedCategory;
        filterQuotes(); // Apply the filter when the page loads
    }
}

document.getElementById('categoryFilter').addEventListener('change', saveSelectedCategory);

function addQuote() {
    const newQuoteText = document.getElementById('newQuoteText').value;
    const newQuoteCategory = document.getElementById('newQuoteCategory').value;

    if (newQuoteText && newQuoteCategory) {
        // Add the new quote to the array
        const newQuote = { text: newQuoteText, category: newQuoteCategory };
        quotes.push(newQuote);

        // Save to local storage
        saveQuotes();

        // Refresh category list and filter display
        populateCategories();
        filterQuotes();

        // Clear input fields
        document.getElementById('newQuoteText').value = '';
        document.getElementById('newQuoteCategory').value = '';
    } else {
        alert('Please enter both a quote and a category.');
    }
}

// Fetch data from a simulated server (e.g., JSONPlaceholder)
async function fetchQuotesFromServer() {
    try {
        const response = await fetch('https://jsonplaceholder.typicode.com/posts'); // Simulating quote data
        const serverQuotes = await response.json();

        // Add server data to local storage if it doesn't already exist
        const localQuotes = JSON.parse(localStorage.getItem('quotes') || '[]');
        const updatedQuotes = mergeQuotes(localQuotes, serverQuotes);
        localStorage.setItem('quotes', JSON.stringify(updatedQuotes));
        
        // Update the UI after sync
        filterQuotes();
    } catch (error) {
        console.error("Failed to fetch quotes from server:", error);
    }
}

// Check for new quotes from the server every 5 minutes
setInterval(fetchQuotesFromServer, 300000); // 300,000 ms = 5 minutes

document.addEventListener('DOMContentLoaded', () => {
    fetchQuotesFromServer(); // Sync data when page loads
    loadSelectedCategory();  // Restore user filter
    populateCategories();    // Populate categories
    filterQuotes();          // Filter displayed quotes
});

function mergeQuotes(localQuotes, serverQuotes) {
    const mergedQuotes = [...localQuotes]; // Start with local data

    // Add server quotes if they don't exist locally
    serverQuotes.forEach(serverQuote => {
        const exists = localQuotes.some(localQuote => localQuote.id === serverQuote.id);
        if (!exists) {
            mergedQuotes.push(serverQuote); // Add the server quote
        }
    });

    return mergedQuotes;
}

function resolveConflict(localQuote, serverQuote) {
    // Basic conflict resolution: overwrite local data
    if (localQuote.updatedAt < serverQuote.updatedAt) {
        return serverQuote; // Server data takes precedence
    }
    return localQuote;
}

function notifyUser(message) {
    const notification = document.createElement('div');
    notification.textContent = message;
    notification.style.backgroundColor = '#ffc107';
    document.body.appendChild(notification);

    setTimeout(() => {
        notification.remove();
    }, 3000);
}

async function postQuoteToServer(quote) {
    try {
        const response = await fetch('https://jsonplaceholder.typicode.com/posts', {
            method: 'POST', // Using POST to send data
            headers: {
                'Content-Type': 'application/json' // Specifies that the data is in JSON format
            },
            body: JSON.stringify(quote) // The data you are sending (converted to a JSON string)
        });

        const responseData = await response.json(); // Parse the JSON response from the server
        console.log('Quote added to server:', responseData);
        
        // Optionally, notify the user or update the local state/UI
        notifyUser('Quote successfully added to server!');
    } catch (error) {
        console.error('Error adding quote to server:', error);
        notifyUser('Failed to add quote to server.');
    }
}

// Example of calling the function to post a new quote
const newQuote = {
    text: "This is a new quote",
    category: "Motivation",
    author: "Unknown"
};

postQuoteToServer(newQuote);

function addQuote() {
    const quoteText = document.getElementById('newQuoteText').value;
    const quoteCategory = document.getElementById('newQuoteCategory').value;

    if (quoteText && quoteCategory) {
        const newQuote = {
            text: quoteText,
            category: quoteCategory
        };

        quotes.push(newQuote); // Add to the local array
        localStorage.setItem('quotes', JSON.stringify(quotes)); // Save to local storage

        // Post the new quote to the server
        postQuoteToServer(newQuote);

        // Optionally update the UI
        populateCategories();
        filterQuotes();

        document.getElementById('newQuoteText').value = '';
        document.getElementById('newQuoteCategory').value = '';
    } else {
        alert('Please fill in both fields');
    }
}


async function syncQuotes() {
    try {
        const serverResponse = await fetch('https://jsonplaceholder.typicode.com/posts');
        const serverQuotes = await serverResponse.json();
        const localQuotes = JSON.parse(localStorage.getItem('quotes')) || [];

        const mergedQuotes = [...localQuotes];

        serverQuotes.forEach(serverQuote => {
            const existsLocally = localQuotes.some(localQuote => localQuote.id === serverQuote.id);
            if (!existsLocally) {
                mergedQuotes.push({
                    id: serverQuote.id,
                    text: serverQuote.title,  // assuming title is the quote text
                    category: 'general'       // default category for server quotes
                });
            }
        });

        localStorage.setItem('quotes', JSON.stringify(mergedQuotes));

        // Notify user that quotes have been synced
        notifyUser('Quotes synced with the server!');
        filterQuotes(); // Refresh displayed quotes

    } catch (error) {
        console.error('Error syncing quotes:', error);
        notifyUser('Failed to sync quotes. Please try again.');
    }
}

// Function to display user notifications
function notifyUser(message) {
    const notification = document.createElement('div');
    notification.classList.add('notification');
    notification.innerHTML = message;

    // Append the notification to the body (or a specific container)
    document.body.appendChild(notification);

    // Remove the notification after a few seconds
    setTimeout(() => {
        notification.remove();
    }, 3000); // Duration in milliseconds (3 seconds)
}

async function syncQuotes() {
    try {
        const serverResponse = await fetch('https://jsonplaceholder.typicode.com/posts');
        const serverQuotes = await serverResponse.json();
        const localQuotes = JSON.parse(localStorage.getItem('quotes')) || [];

        const mergedQuotes = [...localQuotes];

        serverQuotes.forEach(serverQuote => {
            const existsLocally = localQuotes.some(localQuote => localQuote.id === serverQuote.id);
            if (!existsLocally) {
                mergedQuotes.push({
                    id: serverQuote.id,
                    text: serverQuote.title,  // assuming title is the quote text
                    category: 'general'       // default category for server quotes
                });
            }
        });

        localStorage.setItem('quotes', JSON.stringify(mergedQuotes));

        // Notify user that quotes have been synced
        notifyUser('Quotes synced with server!');
        filterQuotes(); // Refresh displayed quotes

    } catch (error) {
        console.error('Error syncing quotes:', error);
        notifyUser('Failed to sync quotes. Please try again.');
    }
}