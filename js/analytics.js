class TypingAnalytics {
    constructor() {
        this.sessionData = {
            startTime: Date.now(),
            testsTaken: 0,
            totalCharsTyped: 0,
            totalCorrectChars: 0,
            totalIncorrectChars: 0,
            totalTestTime: 0,
            wpmValues: [],
            accuracyValues: []
        };
        
        this.keyData = {};
        this.initializeKeyData();
    }
    
    initializeKeyData() {
        // Initialize data for all keys
        const allKeys = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789`-=[]\\;\',./~!@#$%^&*()_+{}|:"<>? '.split('');
        
        allKeys.forEach(key => {
            this.keyData[key] = {
                correct: 0,
                incorrect: 0,
                total: 0
            };
        });
    }
    
    recordTestResult(result) {
        // Update session data
        this.sessionData.testsTaken++;
        this.sessionData.totalCharsTyped += result.charsTyped;
        this.sessionData.totalCorrectChars += result.correctChars;
        this.sessionData.totalIncorrectChars += result.incorrectChars;
        this.sessionData.totalTestTime += result.duration;
        this.sessionData.wpmValues.push(result.wpm);
        this.sessionData.accuracyValues.push(result.accuracy);
        
        // Update key data from error map
        for (const [expectedChar, data] of Object.entries(result.errorMap)) {
            if (!this.keyData[expectedChar]) {
                this.keyData[expectedChar] = { correct: 0, incorrect: 0, total: 0 };
            }
            
            this.keyData[expectedChar].incorrect += data.count;
            this.keyData[expectedChar].total += data.count;
        }
        
        // Save to localStorage
        this.saveAnalytics();
    }
    
    saveAnalytics() {
        localStorage.setItem('typingAnalytics', JSON.stringify({
            sessionData: this.sessionData,
            keyData: this.keyData
        }));
    }
    
    loadAnalytics() {
        const savedData = JSON.parse(localStorage.getItem('typingAnalytics'));
        if (savedData) {
            this.sessionData = savedData.sessionData;
            this.keyData = savedData.keyData;
        }
    }
    
    getWeakestKeys(limit = 5) {
        // Get keys with at least 10 attempts
        const keysWithData = Object.entries(this.keyData)
            .filter(([_, data]) => data.total >= 10);
        
        // Sort by error rate (incorrect / total)
        const sortedKeys = keysWithData.sort((a, b) => {
            const aErrorRate = a[1].incorrect / a[1].total;
            const bErrorRate = b[1].incorrect / b[1].total;
            return bErrorRate - aErrorRate;
        });
        
        return sortedKeys.slice(0, limit);
    }
    
    getAverageWPM() {
        if (this.sessionData.wpmValues.length === 0) return 0;
        const sum = this.sessionData.wpmValues.reduce((a, b) => a + b, 0);
        return Math.round(sum / this.sessionData.wpmValues.length);
    }
    
    getAverageAccuracy() {
        if (this.sessionData.accuracyValues.length === 0) return 100;
        const sum = this.sessionData.accuracyValues.reduce((a, b) => a + b, 0);
        return Math.round(sum / this.sessionData.accuracyValues.length);
    }
    
    getTotalTypingTime() {
        return this.sessionData.totalTestTime;
    }
    
    getImprovementRate() {
        if (this.sessionData.wpmValues.length < 3) return 0;
        
        // Compare first test with average of last 3
        const firstWpm = this.sessionData.wpmValues[0];
        const recentTests = this.sessionData.wpmValues.slice(-3);
        const avgRecentWpm = recentTests.reduce((a, b) => a + b, 0) / recentTests.length;
        
        return Math.round(((avgRecentWpm - firstWpm) / firstWpm) * 100);
    }
    
    generateTypingReport() {
        return {
            testsTaken: this.sessionData.testsTaken,
            avgWpm: this.getAverageWPM(),
            avgAccuracy: this.getAverageAccuracy(),
            totalTime: Math.round(this.getTotalTypingTime() / 60), // in minutes
            improvementRate: this.getImprovementRate(),
            weakestKeys: this.getWeakestKeys()
        };
    }
}

// Initialize analytics
const typingAnalytics = new TypingAnalytics();
typingAnalytics.loadAnalytics();
