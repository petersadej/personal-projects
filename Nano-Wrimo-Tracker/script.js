// NaNoWriMo Progress Tracker JavaScript

class NanoWrimoTracker {
    constructor() {
        this.progressData = [];
        this.targetWords = 50000;
        this.startDate = new Date('2025-11-01');
        this.endDate = new Date('2025-11-30');

        this.init();
    }

    async init() {
        await this.loadProgressData();
        this.setupEventListeners();
        this.setTodaysDate();
        this.updateDisplay();
    }

    setupEventListeners() {
        const form = document.getElementById('progressForm');
        form.addEventListener('submit', (e) => this.handleFormSubmit(e));

        // Add input listener to show words written today
        const totalWordCountInput = document.getElementById('totalWordCount');
        const dateInput = document.getElementById('date');

        const updateWordsToday = () => {
            const selectedDate = dateInput.value;
            const totalWords = parseInt(totalWordCountInput.value) || 0;
            const previousTotal = this.getTotalWordsByDate(selectedDate);
            const wordsToday = totalWords - previousTotal;

            const wordsTodayElement = document.getElementById('wordsToday');
            if (totalWords > 0) {
                if (wordsToday >= 0) {
                    wordsTodayElement.textContent = `Words written today: ${wordsToday.toLocaleString()}`;
                    wordsTodayElement.style.color = '#558b2f';
                } else {
                    wordsTodayElement.textContent = `Warning: This is less than your previous total (${previousTotal.toLocaleString()})`;
                    wordsTodayElement.style.color = '#bf360c';
                }
            } else {
                wordsTodayElement.textContent = '';
            }
        };

        totalWordCountInput.addEventListener('input', updateWordsToday);
        dateInput.addEventListener('change', updateWordsToday);
    }

    getTotalWordsByDate(targetDate) {
        // Get the cumulative word count up to (but not including) the target date
        let total = 0;
        const sortedData = [...this.progressData].sort((a, b) => new Date(a.date) - new Date(b.date));

        for (const entry of sortedData) {
            if (entry.date < targetDate) {
                total += entry.wordCount;
            } else {
                break;
            }
        }

        return total;
    }

    setTodaysDate() {
        const today = new Date().toISOString().split('T')[0];
        document.getElementById('date').value = today;
    }

    async handleFormSubmit(e) {
        e.preventDefault();

        const formData = new FormData(e.target);
        const selectedDate = formData.get('date');
        const totalWordCount = parseInt(formData.get('totalWordCount'));
        const previousTotal = this.getTotalWordsByDate(selectedDate);
        const wordsWrittenToday = totalWordCount - previousTotal;

        if (wordsWrittenToday < 0) {
            this.showMessage('Error: Total word count cannot be less than previous total.', 'error');
            return;
        }

        const entry = {
            date: selectedDate,
            wordCount: wordsWrittenToday,
            notes: formData.get('notes') || ''
        };

        try {
            await this.addProgressEntry(entry);
            this.showMessage('Progress added successfully!', 'success');
            e.target.reset();
            this.setTodaysDate();
        } catch (error) {
            this.showMessage('Error adding progress: ' + error.message, 'error');
        }
    }

    async addProgressEntry(entry) {
        // Check if entry for this date already exists
        const existingIndex = this.progressData.findIndex(item => item.date === entry.date);

        if (existingIndex !== -1) {
            // Update existing entry
            this.progressData[existingIndex] = entry;
        } else {
            // Add new entry
            this.progressData.push(entry);
        }

        // Sort by date
        this.progressData.sort((a, b) => new Date(a.date) - new Date(b.date));

        await this.saveProgressData();
        this.updateDisplay();
    }

    async deleteProgressEntry(date) {
        if (confirm('Are you sure you want to delete this entry?')) {
            this.progressData = this.progressData.filter(item => item.date !== date);
            await this.saveProgressData();
            this.updateDisplay();
            this.showMessage('Entry deleted successfully!', 'success');
        }
    }

    calculateStats() {
        const totalWords = this.progressData.reduce((sum, entry) => sum + entry.wordCount, 0);
        const wordsRemaining = Math.max(0, this.targetWords - totalWords);
        const daysElapsed = this.calculateDaysElapsed();
        const averageDaily = daysElapsed > 0 ? Math.round(totalWords / daysElapsed) : 0;
        const progressPercentage = Math.min(100, (totalWords / this.targetWords) * 100);

        return {
            totalWords,
            wordsRemaining,
            daysElapsed,
            averageDaily,
            progressPercentage
        };
    }

    calculateDaysElapsed() {
        const today = new Date();
        const startDate = new Date(this.startDate);
        const diffTime = Math.abs(today - startDate);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return Math.min(diffDays, 30); // Cap at 30 days for November
    }

    updateDisplay() {
        const stats = this.calculateStats();

        // Update stat cards
        document.getElementById('totalWords').textContent = stats.totalWords.toLocaleString();
        document.getElementById('wordsRemaining').textContent = stats.wordsRemaining.toLocaleString();
        document.getElementById('daysElapsed').textContent = stats.daysElapsed;
        document.getElementById('averageDaily').textContent = stats.averageDaily.toLocaleString();

        // Update progress bar
        const progressFill = document.getElementById('progressFill');
        const progressText = document.getElementById('progressText');
        progressFill.style.width = `${stats.progressPercentage}%`;
        progressText.textContent = `${stats.progressPercentage.toFixed(1)}% Complete`;

        // Update progress table
        this.updateProgressTable();
    }

    updateProgressTable() {
        const tbody = document.getElementById('progressTableBody');
        tbody.innerHTML = '';

        let runningTotal = 0;

        this.progressData.forEach(entry => {
            runningTotal += entry.wordCount;

            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${this.formatDate(entry.date)}</td>
                <td>${entry.wordCount.toLocaleString()}</td>
                <td>${runningTotal.toLocaleString()}</td>
                <td>${entry.notes}</td>
                <td>
                    <button class="delete-btn" onclick="tracker.deleteProgressEntry('${entry.date}')">
                        Delete
                    </button>
                </td>
            `;
            tbody.appendChild(row);
        });

        if (this.progressData.length === 0) {
            const row = document.createElement('tr');
            row.innerHTML = '<td colspan="5" style="text-align: center; color: #6c757d;">No progress entries yet. Add your first entry above!</td>';
            tbody.appendChild(row);
        }
    }

    formatDate(dateString) {
        // Parse date string as local date to avoid timezone issues
        const [year, month, day] = dateString.split('-').map(num => parseInt(num, 10));
        const date = new Date(year, month - 1, day); // month is 0-indexed
        return date.toLocaleDateString('en-US', {
            weekday: 'short',
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    }

    showMessage(message, type) {
        // Remove existing messages
        const existingMessage = document.querySelector('.success-message, .error-message');
        if (existingMessage) {
            existingMessage.remove();
        }

        // Create new message
        const messageDiv = document.createElement('div');
        messageDiv.className = `${type}-message`;
        messageDiv.textContent = message;

        // Insert message before the form
        const form = document.getElementById('progressForm');
        form.parentNode.insertBefore(messageDiv, form);

        // Remove message after 5 seconds
        setTimeout(() => {
            messageDiv.remove();
        }, 5000);
    }

    async loadProgressData() {
        try {
            const response = await fetch('/api/load');
            if (response.ok) {
                const data = await response.text();
                console.log('Loaded CSV data:', data);
                this.progressData = this.parseCSV(data);
                console.log('Parsed progress data:', this.progressData);
            }
        } catch (error) {
            console.log('Could not load existing data, starting fresh:', error);
            this.progressData = [];
        }
    }

    async saveProgressData() {
        try {
            const csvData = this.generateCSV();
            const response = await fetch('/api/save', {
                method: 'POST',
                headers: {
                    'Content-Type': 'text/plain',
                },
                body: csvData
            });

            if (!response.ok) {
                throw new Error('Failed to save data');
            }
        } catch (error) {
            console.error('Error saving data:', error);
            // Fallback to localStorage for demo purposes
            localStorage.setItem('nanoWrimoProgress', JSON.stringify(this.progressData));
        }
    }

    parseCSV(csvText) {
        if (!csvText.trim()) return [];

        const lines = csvText.trim().split('\n');
        const data = [];

        // Skip header row if it exists
        const startIndex = lines[0].includes('date') || lines[0].includes('wordCount') ? 1 : 0;

        for (let i = startIndex; i < lines.length; i++) {
            const line = lines[i].trim();
            if (!line) continue;

            // Simple CSV parser that handles quoted fields
            const parts = [];
            let current = '';
            let inQuotes = false;

            for (let j = 0; j < line.length; j++) {
                const char = line[j];
                if (char === '"') {
                    inQuotes = !inQuotes;
                } else if (char === ',' && !inQuotes) {
                    parts.push(current);
                    current = '';
                } else {
                    current += char;
                }
            }
            parts.push(current);

            const [date, wordCount, notes] = parts;
            if (date && wordCount) {
                data.push({
                    date: date.trim(),
                    wordCount: parseInt(wordCount.trim()),
                    notes: notes ? notes.trim().replace(/^"|"$/g, '') : ''
                });
            }
        }

        return data;
    }    generateCSV() {
        let csv = 'date,wordCount,notes\n';
        this.progressData.forEach(entry => {
            const notes = entry.notes.replace(/"/g, '""'); // Escape quotes
            csv += `${entry.date},${entry.wordCount},"${notes}"\n`;
        });
        return csv;
    }

    // Fallback methods for demo without backend
    async loadProgressDataLocal() {
        const saved = localStorage.getItem('nanoWrimoProgress');
        if (saved) {
            this.progressData = JSON.parse(saved);
        }
    }

    async saveProgressDataLocal() {
        localStorage.setItem('nanoWrimoProgress', JSON.stringify(this.progressData));
    }
}

// Initialize the tracker when the page loads
let tracker;
document.addEventListener('DOMContentLoaded', () => {
    tracker = new NanoWrimoTracker();
});
