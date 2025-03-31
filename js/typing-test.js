class TypingTest {
    constructor() {
        // DOM elements
        this.textDisplay = document.getElementById('text-display');
        this.typingInput = document.getElementById('typing-input');
        this.timerElement = document.getElementById('timer');
        this.wpmElement = document.getElementById('wpm');
        this.cpmElement = document.getElementById('cpm');
        this.accuracyElement = document.getElementById('accuracy');
        this.restartButton = document.getElementById('restart-test');
        
        // Test state
        this.testActive = false;
        this.testCompleted = false;
        this.startTime = 0;
        this.endTime = 0;
        this.timer = null;
        this.timeLimit = 30; // default time in seconds
        this.timeRemaining = this.timeLimit;
        this.currentIndex = 0;
        this.correctChars = 0;
        this.incorrectChars = 0;
        this.totalChars = 0;
        this.totalWords = 0;
        this.testMode = 'words'; // default mode
        this.difficulty = 'medium'; // default difficulty
        this.testText = '';
        this.testWords = [];
        this.typedHistory = [];
        this.errorMap = {};
        
        // Options
        this.includePunctuation = false;
        this.includeNumbers = false;
        this.caseSensitive = true;
        
        // Bind event listeners
        this.bindEventListeners();
    }
    
    bindEventListeners() {
        // Mode selection
        document.querySelectorAll('[data-mode]').forEach(button => {
            button.addEventListener('click', () => {
                document.querySelectorAll('[data-mode]').forEach(btn => btn.classList.remove('active'));
                button.classList.add('active');
                this.testMode = button.getAttribute('data-mode');
            });
        });
        
        // Time selection
        document.querySelectorAll('[data-time]').forEach(button => {
            button.addEventListener('click', () => {
                document.querySelectorAll('[data-time]').forEach(btn => btn.classList.remove('active'));
                button.classList.add('active');
                this.timeLimit = parseInt(button.getAttribute('data-time'));
                this.timeRemaining = this.timeLimit;
                this.timerElement.textContent = this.timeLimit;
            });
        });
        
        // Difficulty selection
        document.querySelectorAll('[data-difficulty]').forEach(button => {
            button.addEventListener('click', () => {
                document.querySelectorAll('[data-difficulty]').forEach(btn => btn.classList.remove('active'));
                button.classList.add('active');
                this.difficulty = button.getAttribute('data-difficulty');
            });
        });
        
        // Custom options
        document.getElementById('punctuation-toggle').addEventListener('change', (e) => {
            this.includePunctuation = e.target.checked;
        });
        
        document.getElementById('numbers-toggle').addEventListener('change', (e) => {
            this.includeNumbers = e.target.checked;
        });
        
        document.getElementById('case-sensitive').addEventListener('change', (e) => {
            this.caseSensitive = e.target.checked;
        });
        
        // Start test button
        document.getElementById('start-test-btn').addEventListener('click', () => {
            this.startTest();
        });
        
        // Restart test button
        this.restartButton.addEventListener('click', () => {
            this.restartTest();
        });
        
        // Typing input
        this.typingInput.addEventListener('input', (e) => {
            if (!this.testActive && !this.testCompleted) {
                this.startTest();
            }
            
            if (this.testActive) {
                this.handleTyping(e);
            }
        });
        
        // Results actions
        document.getElementById('retry-btn').addEventListener('click', () => {
            document.getElementById('results').classList.add('hidden');
            document.getElementById('test-options').classList.remove('hidden');
            document.getElementById('test-start').classList.remove('hidden');
            this.resetTest();
        });
        
        document.getElementById('save-btn').addEventListener('click', () => {
            this.saveResults();
        });
        
        document.getElementById('share-btn').addEventListener('click', () => {
            this.shareResults();
        });
    }
    
    startTest() {
        // Hide options and start button, show test
        document.getElementById('test-options').classList.add('hidden');
        document.getElementById('test-start').classList.add('hidden');
        document.getElementById('typing-test').classList.remove('hidden');
        
        // Generate test content
        this.generateTestContent();
        
        // Reset test state
        this.testActive = true;
        this.testCompleted = false;
        this.startTime = Date.now();
        this.currentIndex = 0;
        this.correctChars = 0;
        this.incorrectChars = 0;
        this.totalChars = this.testText.length;
        this.totalWords = this.testWords.length;
        this.typedHistory = [];
        this.errorMap = {};
        
        // Focus input
        this.typingInput.value = '';
        this.typingInput.focus();
        
        // Start timer
        this.startTimer();
        
        // Render initial text display
        this.renderText();
    }
    
    generateTestContent() {
        if (this.testMode === 'words') {
            this.generateRandomWords();
        } else if (this.testMode === 'sentences') {
            this.generateSentences();
        } else if (this.testMode === 'paragraphs') {
            this.generateParagraphs();
        } else if (this.testMode === 'code') {
            this.generateCode();
        }
    }
    
    generateRandomWords() {
        // Make sure wordLists is defined and accessible
        if (typeof wordLists === 'undefined' || !wordLists[this.difficulty]) {
            // Fallback word list if the external one isn't loaded
            const fallbackWords = [
                "the", "be", "to", "of", "and", "a", "in", "that", "have", "I", 
                "it", "for", "not", "on", "with", "he", "as", "you", "do", "at", 
                "this", "but", "his", "by", "from", "they", "we", "say", "her", "she"
            ];
            this.testWords = fallbackWords.sort(() => Math.random() - 0.5).slice(0, 20);
            this.testText = this.testWords.join(' ');
            return;
        }
        
        let wordList = [...wordLists[this.difficulty]];
        
        // Add punctuation if enabled
        if (this.includePunctuation) {
            wordList = wordList.map(word => {
                // 20% chance to add punctuation
                if (Math.random() < 0.2) {
                    const punctuation = [".", ",", "!", "?", ";", ":"];
                    const randomPunctuation = punctuation[Math.floor(Math.random() * punctuation.length)];
                    return word + randomPunctuation;
                }
                return word;
            });
        }
        
        // Add numbers if enabled
        if (this.includeNumbers) {
            // Add some number words to the mix
            const numberWords = ['one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten'];
            wordList = wordList.concat(numberWords);
            
            // Add some actual numbers
            for (let i = 0; i < 10; i++) {
                wordList.push(String(Math.floor(Math.random() * 1000)));
            }
        }
        
        // Shuffle the word list
        wordList.sort(() => Math.random() - 0.5);
        
        // Take a subset of words based on difficulty and time
        const wordCount = Math.min(
            wordList.length,
            this.timeLimit * (this.difficulty === 'easy' ? 3 : this.difficulty === 'medium' ? 4 : this.difficulty === 'hard' ? 5 : 6)
        );
        
        this.testWords = wordList.slice(0, wordCount);
        this.testText = this.testWords.join(' ');
    }
    
    generateSentences() {
        // Make sure sentenceLists is defined and accessible
        if (typeof sentenceLists === 'undefined' || !sentenceLists[this.difficulty]) {
            // Fallback sentences if the external ones aren't loaded
            const fallbackSentences = [
                "The quick brown fox jumps over the lazy dog.",
                "She sells seashells by the seashore.",
                "How much wood would a woodchuck chuck if a woodchuck could chuck wood?"
            ];
            const randomIndex = Math.floor(Math.random() * fallbackSentences.length);
            this.testText = fallbackSentences[randomIndex];
            this.testWords = this.testText.split(' ');
            return;
        }
        
        const sentenceList = sentenceLists[this.difficulty];
        // Shuffle the sentences
        const shuffledSentences = [...sentenceList].sort(() => Math.random() - 0.5);
        
        // Select sentences based on time limit
        const sentenceCount = Math.max(1, Math.min(
            shuffledSentences.length,
            Math.ceil(this.timeLimit / 15)
        ));
        
        this.testText = shuffledSentences.slice(0, sentenceCount).join(' ');
        this.testWords = this.testText.split(' ');
    }
    
    generateParagraphs() {
        // Make sure paragraphLists is defined and accessible
        if (typeof paragraphLists === 'undefined' || !paragraphLists[this.difficulty]) {
            // Fallback paragraph if the external ones aren't loaded
            this.testText = "The sun was setting behind the mountains, casting a golden glow over the valley. Birds were returning to their nests, singing their evening songs. A gentle breeze rustled the leaves of the tall oak trees.";
            this.testWords = this.testText.split(' ');
            return;
        }
        
        const paragraphList = paragraphLists[this.difficulty];
        // Select a random paragraph
        const randomIndex = Math.floor(Math.random() * paragraphList.length);
        
        this.testText = paragraphList[randomIndex];
        this.testWords = this.testText.split(' ');
    }
    
    generateCode() {
        // Make sure sentenceLists.code is defined and accessible
        if (typeof sentenceLists === 'undefined' || !sentenceLists.code) {
            // Fallback code snippet if the external ones aren't loaded
            this.testText = "function calculateSum(a, b) { return a + b; }";
            this.testWords = this.testText.split(/\s+/);
            return;
        }
        
        const codeList = sentenceLists.code;
        // Shuffle the code snippets
        const shuffledCode = [...codeList].sort(() => Math.random() - 0.5);
        
        // Select code snippets based on time limit
        const codeCount = Math.max(1, Math.min(
            shuffledCode.length,
            Math.ceil(this.timeLimit / 20)
        ));
        
        this.testText = shuffledCode.slice(0, codeCount).join('\n\n');
        this.testWords = this.testText.split(/\s+/);
    }
    
    renderText() {
        this.textDisplay.innerHTML = '';
        
        for (let i = 0; i < this.testText.length; i++) {
            const char = this.testText[i];
            const span = document.createElement('span');
            span.textContent = char;
            span.className = 'character';
            
            if (i === this.currentIndex) {
                span.classList.add('current');
            } else if (i < this.currentIndex) {
                const typedChar = this.typedHistory[i];
                if (this.isCorrectChar(this.testText[i], typedChar)) {
                    span.classList.add('correct');
                } else {
                    span.classList.add('incorrect');
                }
            }
            
            this.textDisplay.appendChild(span);
        }
        
        // Scroll to current position
        if (this.currentIndex > 0) {
            const currentChar = this.textDisplay.querySelector('.current');
            if (currentChar) {
                currentChar.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
        }
    }
    
    isCorrectChar(expected, actual) {
        if (!this.caseSensitive) {
            expected = expected.toLowerCase();
            actual = actual.toLowerCase();
        }
        return expected === actual;
    }
    
    handleTyping(e) {
        const inputText = this.typingInput.value;
        const lastTypedChar = inputText.charAt(inputText.length - 1);
        
        // Store typed character
        this.typedHistory[this.currentIndex] = lastTypedChar;
        
        // Check if character is correct
        if (this.isCorrectChar(this.testText[this.currentIndex], lastTypedChar)) {
            this.correctChars++;
        } else {
            this.incorrectChars++;
            
            // Track error for analysis
            const expectedChar = this.testText[this.currentIndex];
            if (!this.errorMap[expectedChar]) {
                this.errorMap[expectedChar] = { count: 0, mistakes: {} };
            }
            this.errorMap[expectedChar].count++;
            
            if (!this.errorMap[expectedChar].mistakes[lastTypedChar]) {
                this.errorMap[expectedChar].mistakes[lastTypedChar] = 0;
            }
            this.errorMap[expectedChar].mistakes[lastTypedChar]++;
        }
        
        // Move to next character
        this.currentIndex++;
        
        // Clear input for next character
        this.typingInput.value = '';
        
        // Update stats
        this.updateStats();
        
        // Render updated text
        this.renderText();
        
        // Check if test is complete (reached end of text)
        if (this.currentIndex >= this.testText.length) {
            this.completeTest();
        }
    }
    
    startTimer() {
        this.timeRemaining = this.timeLimit;
        this.timerElement.textContent = this.timeRemaining;
        
        this.timer = setInterval(() => {
            this.timeRemaining--;
            this.timerElement.textContent = this.timeRemaining;
            
            // Update stats as time passes
            this.updateStats();
            
            if (this.timeRemaining <= 0) {
                this.completeTest();
            }
        }, 1000);
    }
    
    updateStats() {
        if (!this.testActive) return;
        
        const elapsedTime = (Date.now() - this.startTime) / 1000; // in seconds
        const elapsedTimeInMinutes = elapsedTime / 60;
        
        // Calculate WPM: (characters typed / 5) / time in minutes
        const rawWpm = Math.round((this.currentIndex / 5) / elapsedTimeInMinutes);
        const netWpm = Math.max(0, Math.round(((this.currentIndex / 5) - this.incorrectChars) / elapsedTimeInMinutes));
        
        // Calculate CPM: characters typed / time in minutes
        const cpm = Math.round(this.currentIndex / elapsedTimeInMinutes);
        
        // Calculate accuracy
        const accuracy = this.currentIndex > 0 
            ? Math.round((this.correctChars / this.currentIndex) * 100) 
            : 100;
        
        // Update display
        this.wpmElement.textContent = netWpm;
        this.cpmElement.textContent = cpm;
        this.accuracyElement.textContent = `${accuracy}%`;
    }
    
    completeTest() {
        clearInterval(this.timer);
        this.testActive = false;
        this.testCompleted = true;
        this.endTime = Date.now();
        
        // Show restart button
        this.restartButton.classList.remove('hidden');
        
        // Calculate final stats
        const testDuration = (this.endTime - this.startTime) / 1000; // in seconds
        const testDurationMinutes = testDuration / 60;
        
        const rawWpm = Math.round((this.currentIndex / 5) / testDurationMinutes);
        const netWpm = Math.max(0, Math.round(((this.currentIndex / 5) - this.incorrectChars) / testDurationMinutes));
        const cpm = Math.round(this.currentIndex / testDurationMinutes);
        const accuracy = this.currentIndex > 0 
            ? Math.round((this.correctChars / this.currentIndex) * 100) 
            : 100;
        
        // Store results
        const testResult = {
            date: new Date(),
            wpm: netWpm,
            cpm: cpm,
            accuracy: accuracy,
            duration: testDuration,
            mode: this.testMode,
            difficulty: this.difficulty,
            charsTyped: this.currentIndex,
            correctChars: this.correctChars,
            incorrectChars: this.incorrectChars,
            errorMap: this.errorMap
        };
        
        // Save to history
        this.saveTestHistory(testResult);
        
        // Show results
        this.displayResults(testResult);
    }
    
    displayResults(result) {
        // Hide typing test, show results
        document.getElementById('typing-test').classList.add('hidden');
        document.getElementById('results').classList.remove('hidden');
        
        // Update result values
        document.getElementById('result-wpm').textContent = result.wpm;
        document.getElementById('result-cpm').textContent = result.cpm;
        document.getElementById('result-accuracy').textContent = `${result.accuracy}%`;
        
        // Generate error analysis
        this.generateErrorAnalysis(result.errorMap);
        
        // Generate keyboard heatmap
        if (typeof heatmapGenerator !== 'undefined') {
            heatmapGenerator.generateHeatmap(result.errorMap);
        }
    }
    
    generateErrorAnalysis(errorMap) {
        const errorDetails = document.getElementById('error-details');
        errorDetails.innerHTML = '';
        
        // Sort errors by frequency
        const sortedErrors = Object.entries(errorMap)
            .sort((a, b) => b[1].count - a[1].count)
            .slice(0, 5); // Top 5 errors
        
        if (sortedErrors.length === 0) {
            errorDetails.innerHTML = '<p>No errors! Perfect typing!</p>';
            return;
        }
        
        const errorList = document.createElement('ul');
        errorList.className = 'error-list';
        
        sortedErrors.forEach(([char, data]) => {
            const errorItem = document.createElement('li');
            errorItem.className = 'error-item';
            
            // Format the character for display (handle spaces, newlines, etc.)
            let displayChar = char;
            if (char === ' ') displayChar = '␣ (space)';
            if (char === '\n') displayChar = '↵ (enter)';
            if (char === '\t') displayChar = '→ (tab)';
            
            // Get the most common mistake for this character
            const mostCommonMistake = Object.entries(data.mistakes)
                .sort((a, b) => b[1] - a[1])[0];
            
            let mistakeDisplay = mostCommonMistake ? mostCommonMistake[0] : '';
            if (mistakeDisplay === ' ') mistakeDisplay = '␣ (space)';
            if (mistakeDisplay === '\n') mistakeDisplay = '↵ (enter)';
            if (mistakeDisplay === '\t') mistakeDisplay = '→ (tab)';
            if (mistakeDisplay === '') mistakeDisplay = '(missed)';
            
            errorItem.innerHTML = `
                <span class="error-char">"${displayChar}"</span>
                <span class="error-count">${data.count} errors</span>
                <span class="error-common">Most typed: "${mistakeDisplay}"</span>
            `;
            
            errorList.appendChild(errorItem);
        });
        
        errorDetails.appendChild(errorList);
        
        // Add improvement suggestions
        const suggestions = document.createElement('div');
        suggestions.className = 'improvement-suggestions';
        suggestions.innerHTML = '<h4>Suggestions for Improvement</h4>';
        
        const suggestionList = document.createElement('ul');
        
        // Analyze error patterns and provide targeted suggestions
        if (sortedErrors.some(([char]) => char.match(/[A-Z]/))) {
            suggestionList.innerHTML += '<li>Practice capital letters more carefully</li>';
        }
        
        if (sortedErrors.some(([char]) => char.match(/[0-9]/))) {
            suggestionList.innerHTML += '<li>Work on number key accuracy</li>';
        }
        
        if (sortedErrors.some(([char]) => char.match(/[.,;:'"!?()[\]{}]/))) {
            suggestionList.innerHTML += '<li>Pay attention to punctuation marks</li>';
        }
        
        if (sortedErrors.some(([char]) => char === ' ')) {
            suggestionList.innerHTML += '<li>Focus on consistent spacing</li>';
        }
        
        // Add general suggestions
        suggestionList.innerHTML += '<li>Slow down to build accuracy before speed</li>';
        suggestionList.innerHTML += '<li>Practice problem characters specifically</li>';
        
        suggestions.appendChild(suggestionList);
        errorDetails.appendChild(suggestions);
    }
    
    saveTestHistory(result) {
        let testHistory = JSON.parse(localStorage.getItem('typingTestHistory')) || [];
        testHistory.push(result);
        localStorage.setItem('typingTestHistory', JSON.stringify(testHistory));
        
        // Update profile stats
        this.updateProfileStats();
    }
    
    updateProfileStats() {
        const testHistory = JSON.parse(localStorage.getItem('typingTestHistory')) || [];
        
        if (testHistory.length === 0) return;
        
        // Calculate average WPM
        const totalWpm = testHistory.reduce((sum, test) => sum + test.wpm, 0);
        const avgWpm = Math.round(totalWpm / testHistory.length);
        
        // Find max WPM
        const maxWpm = Math.max(...testHistory.map(test => test.wpm));
        
        // Count tests taken
        const testsTaken = testHistory.length;
        
        // Calculate total time spent typing
        const totalSeconds = testHistory.reduce((sum, test) => sum + test.duration, 0);
        const totalMinutes = Math.round(totalSeconds / 60);
        
        // Update profile display
        document.getElementById('avg-wpm').textContent = avgWpm;
        document.getElementById('max-wpm').textContent = maxWpm;
        document.getElementById('tests-taken').textContent = testsTaken;
        document.getElementById('total-time').textContent = `${totalMinutes}m`;
        
        // Update progress chart
        this.updateProgressChart(testHistory);
        
        // Check for achievements
        this.checkAchievements(testHistory);
    }
    
    updateProgressChart(testHistory) {
        // Get the last 10 tests (or fewer if not available)
        const recentTests = testHistory.slice(-10);
        
        // Prepare data for chart
        const labels = recentTests.map((_, index) => `Test ${index + 1}`);
        const wpmData = recentTests.map(test => test.wpm);
        const accuracyData = recentTests.map(test => test.accuracy);
        
        // Get the canvas element
        const ctx = document.getElementById('progress-chart').getContext('2d');
        
        // Check if Chart is defined
        if (typeof Chart === 'undefined') {
            console.error('Chart.js is not loaded');
            return;
        }
        
        // Destroy previous chart if it exists
        if (window.progressChart) {
            window.progressChart.destroy();
        }
        
        // Create new chart
        window.progressChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: labels,
                datasets: [
                    {
                        label: 'WPM',
                        data: wpmData,
                        borderColor: 'rgb(52, 152, 219)',
                        backgroundColor: 'rgba(52, 152, 219, 0.1)',
                        tension: 0.3,
                        yAxisID: 'y'
                    },
                    {
                        label: 'Accuracy (%)',
                        data: accuracyData,
                        borderColor: 'rgb(46, 204, 113)',
                        backgroundColor: 'rgba(46, 204, 113, 0.1)',
                        tension: 0.3,
                        yAxisID: 'y1'
                    }
                ]
            },
            options: {
                responsive: true,
                interaction: {
                    mode: 'index',
                    intersect: false,
                },
                scales: {
                    y: {
                        type: 'linear',
                        display: true,
                        position: 'left',
                        title: {
                            display: true,
                            text: 'WPM'
                        }
                    },
                    y1: {
                        type: 'linear',
                        display: true,
                        position: 'right',
                        title: {
                            display: true,
                            text: 'Accuracy (%)'
                        },
                        min: 0,
                        max: 100,
                        grid: {
                            drawOnChartArea: false,
                        }
                    }
                }
            }
        });
    }
    
    checkAchievements(testHistory) {
        const achievements = [
            {
                id: 'first-test',
                name: 'First Steps',
                description: 'Complete your first typing test',
                icon: 'fa-flag-checkered',
                condition: () => testHistory.length >= 1
            },
            {
                id: 'speed-demon',
                name: 'Speed Demon',
                description: 'Achieve 50+ WPM',
                icon: 'fa-bolt',
                condition: () => testHistory.some(test => test.wpm >= 50)
            },
            {
                id: 'accuracy-master',
                name: 'Accuracy Master',
                description: 'Complete a test with 100% accuracy',
                icon: 'fa-bullseye',
                condition: () => testHistory.some(test => test.accuracy === 100)
            },
            {
                id: 'persistent',
                name: 'Persistent',
                description: 'Complete 10 typing tests',
                icon: 'fa-medal',
                condition: () => testHistory.length >= 10
            },
            {
                id: 'expert-typist',
                name: 'Expert Typist',
                description: 'Achieve 80+ WPM',
                icon: 'fa-trophy',
                condition: () => testHistory.some(test => test.wpm >= 80)
            },
            {
                id: 'code-ninja',
                name: 'Code Ninja',
                description: 'Complete a code typing test with 90%+ accuracy',
                icon: 'fa-code',
                condition: () => testHistory.some(test => test.mode === 'code' && test.accuracy >= 90)
            },
            {
                id: 'marathon-runner',
                name: 'Marathon Runner',
                description: 'Complete a 5-minute typing test',
                icon: 'fa-stopwatch',
                condition: () => testHistory.some(test => test.duration >= 300)
            },
            {
                id: 'dedication',
                name: 'Dedication',
                description: 'Spend over 30 minutes typing',
                icon: 'fa-clock',
                condition: () => {
                    const totalSeconds = testHistory.reduce((sum, test) => sum + test.duration, 0);
                    return totalSeconds >= 1800;
                }
            },
            {
                id: 'improvement',
                name: 'Improvement',
                description: 'Improve your WPM by 10+ from your first test',
                icon: 'fa-chart-line',
                condition: () => {
                    if (testHistory.length < 2) return false;
                    const firstTest = testHistory[0];
                    const latestTests = testHistory.slice(-5);
                    const avgRecentWpm = latestTests.reduce((sum, test) => sum + test.wpm, 0) / latestTests.length;
                    return avgRecentWpm >= (firstTest.wpm + 10);
                }
            }
        ];
        
        // Get unlocked achievements from localStorage
        let unlockedAchievements = JSON.parse(localStorage.getItem('unlockedAchievements')) || [];
        
        // Check each achievement
        achievements.forEach(achievement => {
            if (!unlockedAchievements.includes(achievement.id) && achievement.condition()) {
                // Unlock new achievement
                unlockedAchievements.push(achievement.id);
                
                // Show notification (could be enhanced with a toast notification)
                console.log(`Achievement unlocked: ${achievement.name}`);
            }
        });
        
        // Save updated achievements
        localStorage.setItem('unlockedAchievements', JSON.stringify(unlockedAchievements));
        
        // Update achievements display
        this.displayAchievements(achievements, unlockedAchievements);
    }
    
    displayAchievements(achievements, unlockedAchievements) {
        const container = document.getElementById('achievements-container');
        if (!container) return;
        
        container.innerHTML = '';
        
        achievements.forEach(achievement => {
            const isUnlocked = unlockedAchievements.includes(achievement.id);
            
            const achievementElement = document.createElement('div');
            achievementElement.className = `achievement ${isUnlocked ? 'unlocked' : ''}`;
            
            achievementElement.innerHTML = `
                <div class="achievement-icon">
                    <i class="fas ${achievement.icon}"></i>
                </div>
                <div class="achievement-name">${achievement.name}</div>
                <div class="achievement-description">${achievement.description}</div>
            `;
            
            container.appendChild(achievementElement);
        });
    }
    
    restartTest() {
        clearInterval(this.timer);
        this.resetTest();
        this.startTest();
    }
    
    resetTest() {
        this.testActive = false;
        this.testCompleted = false;
        this.currentIndex = 0;
        this.correctChars = 0;
        this.incorrectChars = 0;
        this.typedHistory = [];
        this.errorMap = {};
        this.typingInput.value = '';
        this.restartButton.classList.add('hidden');
    }
    
    saveResults() {
        // Already saved in test history, just show confirmation
        alert('Your results have been saved to your profile!');
    }
    
    shareResults() {
        // Get the latest test result
        const testHistory = JSON.parse(localStorage.getItem('typingTestHistory')) || [];
        if (testHistory.length === 0) return;
        
        const latestTest = testHistory[testHistory.length - 1];
        
        // Create share text
        const shareText = `I just scored ${latestTest.wpm} WPM with ${latestTest.accuracy}% accuracy on TypeMaster! Can you beat me? #TypingChallenge`;
        
        // Create a temporary input to copy the text
        const input = document.createElement('textarea');
        input.value = shareText;
        document.body.appendChild(input);
        input.select();
        document.execCommand('copy');
        document.body.removeChild(input);
        
        alert('Result copied to clipboard! Share it with your friends.');
    }
}
