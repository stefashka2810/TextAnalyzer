# Text Analyzer Web App

# Overview
A simple yet elegant text analysis tool that counts words and characters, maintains a history of the last 3 queries, and saves user input. 
The app is designed in a soft pink aesthetic, is fully responsive, and works without external libraries or server-side scripts.

# Features
1. Real-time word and character counting  
2. LocalStorage support (saves the last 3 queries)  
3. Session timer (prompts to continue after 300 seconds)  
4. Soft pink aesthetic design with smooth animations 
5. "Clear History" button (removes stored queries)  
6. Supports multiple instances on the same page 
7. Prevents input above 10,000 characters 
8. History table updates dynamically

# How It Works
1. Enter text in the input box.
2. Click "COUNT WORDS AND SYMBOLS" to analyze the text.
3. The app displays word & character count in the results section.
4. The last 3 queries are stored in LocalStorage and displayed in a history table.
5. Click "CLEAR" to reset the input field.
6. Click "CLEAR HISTORY" to remove all saved queries.
7. Session timer tracks time spent after 300 seconds, a prompt asks if you want to continue.

# Project Structure
/text-analyzer
│── index.html           # Main HTML file (entry point)
│── app.js               # JavaScript logic
│── app.css              # Styling (soft pink aesthetic)
│── README.md            # Project documentation

# Technologies Used
1. HTML5
2. CSS3
3. JavaScript (No frameworks)
