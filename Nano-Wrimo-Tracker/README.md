# 📝 NaNoWriMo Progress Tracker

A simple local website to track your daily writing progress during National Novel Writing Month (NaNoWriMo). Track your word count, view your progress toward the 50,000-word goal, and store all data in a CSV file.

## ✨ Features

- **Daily Progress Tracking**: Add your daily word count with optional notes
- **Visual Progress Bar**: See your progress toward the 50,000-word goal
- **Statistics Dashboard**: View total words, remaining words, days elapsed, and average daily count
- **Progress History**: See all your entries in a sortable table
- **CSV Data Storage**: All data is stored locally in a CSV file
- **Responsive Design**: Works on desktop and mobile devices

## 🚀 Quick Start

1. **Start the Server**:
   ```cmd
   python server.py
   ```

2. **Open Your Browser**:
   Go to `http://localhost:8000`

3. **Start Tracking**:
   - Fill in today's word count
   - Add optional notes about your writing session
   - Click "Add Progress" to save

## 📁 Files Structure

```
Nano-Wrimo-Tracker/
├── index.html          # Main webpage
├── styles.css          # Styling and layout
├── script.js           # Frontend JavaScript
├── server.py           # Python backend server
├── progress.csv        # CSV data storage
└── README.md           # This file
```

## 🛠️ Requirements

- Python 3.6 or higher (comes with built-in HTTP server)
- Modern web browser (Chrome, Firefox, Safari, Edge)

## 💡 Usage Tips

### Adding Daily Progress
- The form automatically sets today's date
- Enter the number of words you wrote today (not your total count)
- Notes are optional but can help you remember what you wrote about

### Viewing Statistics
- **Total Words**: Your cumulative word count
- **Words Remaining**: How many more words to reach 50,000
- **Days Elapsed**: Days since November 1st
- **Average Daily**: Your average words per day

### Managing Data
- Entries are automatically sorted by date
- You can delete entries using the "Delete" button
- Data is saved in `progress.csv` and persists between sessions

## 🔧 Customization

### Changing the Target Word Count
Edit `script.js` and modify the `targetWords` property:
```javascript
this.targetWords = 50000; // Change this to your target
```

### Changing the Date Range
Edit `script.js` and modify the date properties:
```javascript
this.startDate = new Date('2025-11-01'); // NaNoWriMo start
this.endDate = new Date('2025-11-30');   // NaNoWriMo end
```

### Using a Different Port
```cmd
python server.py 8080  # Use port 8080 instead of 8000
```

## 📊 CSV Format

The progress data is stored in `progress.csv` with the following format:
```csv
date,wordCount,notes
2025-11-01,1667,"Great start to NaNoWriMo!"
2025-11-02,1500,"Slower day but made progress"
```

## 🎯 NaNoWriMo Goals

- **Target**: 50,000 words in 30 days
- **Daily Goal**: ~1,667 words per day
- **Time Period**: November 1-30

## 🚨 Troubleshooting

### Server Won't Start
- **Port in use**: Try `python server.py 8001`
- **Python not found**: Make sure Python is installed and in your PATH

### Data Not Saving
- Check that the server is running
- Ensure you have write permissions in the directory
- Check the console for error messages

### Browser Issues
- Try refreshing the page (Ctrl+F5 or Cmd+Shift+R)
- Clear browser cache
- Try a different browser

## 🤝 Contributing

Feel free to customize this tracker for your needs! Some ideas:
- Add charts/graphs for progress visualization
- Include writing session timer
- Add goal setting for different word targets
- Export progress to other formats

## 📜 License

This project is open source and available under the MIT License.

---

**Good luck with NaNoWriMo! 🚀**

Remember: The goal is progress, not perfection. Every word counts!
