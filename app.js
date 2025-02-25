function appTextAnalyzer(containerId, params) {
    const container = document.getElementById(containerId);
    if (!container) {
        console.error(`Container with id "${containerId}" not found.`);
        return;
    }

    // Maximum text length set to 10,000 characters and session limit set to 300 seconds
    const maxTextLength = params.maxTextLength || 10000;
    const sessionLimit = params.sessionTime || 300;

    let sessionActive = true; // Flag for session activity

    // Create wrapper element
    const wrapper = document.createElement('div');
    wrapper.className = 'text-analyzer-wrapper';
    container.appendChild(wrapper);

    // Header
    const heading = document.createElement('h2');
    heading.textContent = 'ENTER TEXT HERE';
    wrapper.appendChild(heading);

    // Input field label
    const inputLabel = document.createElement('p');
    inputLabel.textContent = 'Enter text to analyze the number of words and characters';
    wrapper.appendChild(inputLabel);

    // Text input field
    const inputField = document.createElement('textarea');
    wrapper.appendChild(inputField);

    // Warning message block
    const warningBlock = document.createElement('div');
    warningBlock.className = 'warning-block';
    warningBlock.textContent = 'WARNING! (Text exceeds character limit)';
    wrapper.appendChild(warningBlock);
    warningBlock.style.display = 'none';

    // Count words and characters button
    const countButton = document.createElement('button');
    countButton.textContent = 'COUNT WORDS AND SYMBOLS';
    countButton.className = 'count-button';
    wrapper.appendChild(countButton);

    // Clear text field button
    const clearButton = document.createElement('button');
    clearButton.textContent = 'CLEAR';
    clearButton.className = 'clear-button';
    wrapper.appendChild(clearButton);

    // Result display block
    const resultBlock = document.createElement('div');
    resultBlock.className = 'result-block';
    resultBlock.textContent = 'RESULT (word and character count will be displayed here)';
    wrapper.appendChild(resultBlock);

    // Table for last 3 queries
    const historyTitle = document.createElement('div');
    historyTitle.className = 'history-title';
    historyTitle.textContent = 'Recent Text Analysis';
    wrapper.appendChild(historyTitle);

    const historyTable = document.createElement('table');
    historyTable.className = 'history-table';
    historyTable.innerHTML = `
        <thead>
            <tr>
                <th>Text</th>
                <th>Words</th>
                <th>Characters</th>
            </tr>
        </thead>
        <tbody></tbody>
    `;
    wrapper.appendChild(historyTable);
    
    const historyBody = historyTable.querySelector('tbody');

    // Timer display block
    const timerBlock = document.createElement('div');
    timerBlock.className = 'timer-block';
    timerBlock.innerHTML = `TIMER: <span>0</span> sec`;
    wrapper.appendChild(timerBlock);
    
    const timerSpan = timerBlock.querySelector('span');

    // ---------------------
    // Functions
    // ---------------------

    // Validate text length
    function validateTextLength(text) {
        if (text.length > maxTextLength) {
            warningBlock.style.display = 'block';
            warningBlock.textContent = `WARNING! Text exceeds ${maxTextLength} characters. Please shorten your input.`;
            return false;
        } else {
            warningBlock.style.display = 'none';
            return true;
        }
    }

    // Count words
    function countWords(text) {
        const words = text.trim().split(/\s+/);
        return text.trim() === '' ? 0 : words.length;
    }

    // Count characters
    function countCharacters(text) {
        return text.length;
    }

    // Save last 3 queries to localStorage
    function saveToLocalStorage(text, words, characters) {
        let history = JSON.parse(localStorage.getItem('textAnalyzerHistory')) || [];

        // Add new entry to the beginning
        history.unshift({ text, words, characters });

        // Keep only last 3 records
        history = history.slice(0, 3);

        // Save back to localStorage
        localStorage.setItem('textAnalyzerHistory', JSON.stringify(history));

        // Update table
        updateHistoryTable();
    }

    // Load last 3 queries from localStorage
    function updateHistoryTable() {
        let history = JSON.parse(localStorage.getItem('textAnalyzerHistory')) || [];

        // Clear table
        historyBody.innerHTML = '';

        // Populate table with history
        history.forEach(entry => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${entry.text.length > 50 ? entry.text.substring(0, 50) + '...' : entry.text}</td>
                <td>${entry.words}</td>
                <td>${entry.characters}</td>
            `;
            historyBody.appendChild(row);
        });
    }

    // Load history on startup
    updateHistoryTable();

    // Clear input field
    function clearInput() {
        inputField.value = '';
        warningBlock.style.display = 'none';
        resultBlock.textContent = 'RESULT (word and character count will be displayed here)';
    }

    // ---------------------
    // Event Listeners
    // ---------------------

    // On clicking "COUNT WORDS AND SYMBOLS"
    countButton.addEventListener('click', () => {
        if (!sessionActive) return; // Do nothing if session is inactive

        const text = inputField.value;

        // Check text length
        if (!validateTextLength(text)) {
            resultBlock.textContent = 'RESULT: Calculation is not possible. Text is too long!';
            return;
        }

        const words = countWords(text);
        const characters = countCharacters(text);
        resultBlock.textContent = `RESULT: Words = ${words}, Characters = ${characters}`;

        // Save to localStorage
        saveToLocalStorage(text, words, characters);
    });

    // On clicking "CLEAR"
    clearButton.addEventListener('click', clearInput);

    // ---------------------
    // Timer with session extension prompt
    // ---------------------
    let seconds = 0;
    const timerInterval = setInterval(() => {
        if (!sessionActive) return;

        seconds++;
        timerSpan.textContent = seconds;
        timerSpan.classList.add('grow');
        setTimeout(() => timerSpan.classList.remove('grow'), 200);

        // When session reaches 300 seconds (5 minutes)
        if (seconds >= sessionLimit) {
            clearInterval(timerInterval); // Stop the timer
            sessionActive = false; // Deactivate session

            // Ask user if they want to continue
            const continueSession = confirm("Session time has expired! Do you want to continue?");
            if (continueSession) {
                sessionActive = true;
                seconds = 0; // Reset timer
                timerSpan.textContent = seconds;
                setInterval(() => {
                    if (!sessionActive) return;
                    seconds++;
                    timerSpan.textContent = seconds;
                    timerSpan.classList.add('grow');
                    setTimeout(() => timerSpan.classList.remove('grow'), 200);
                }, 1000);
            } else {
                inputField.disabled = true;
                countButton.disabled = true;
                clearButton.disabled = true;
                timerBlock.textContent = "Session ended!";
            }
        }
    }, 1000);

    // Create a container for the clear history button
    const clearHistoryContainer = document.createElement('div');
    clearHistoryContainer.className = 'clear-history-container';
    wrapper.appendChild(clearHistoryContainer);

   // Create the "Clear History" button
   const clearHistoryButton = document.createElement('button');
   clearHistoryButton.textContent = 'CLEAR HISTORY';
   clearHistoryButton.className = 'clear-history-button';
   clearHistoryContainer.appendChild(clearHistoryButton);

   // Function to clear history from localStorage and update table
   function clearHistory() {
        localStorage.removeItem('textAnalyzerHistory'); // Remove history from localStorage
        updateHistoryTable(); // Refresh the table to reflect changes
    }

   // Attach event listener to "Clear History" button
   clearHistoryButton.addEventListener('click', clearHistory);

   // Append the timer block AFTER the clear history button
   wrapper.appendChild(timerBlock);
}
