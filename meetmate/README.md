# MeetMate - AI Meeting Co-Pilot

An intelligent Chrome extension that provides real-time AI assistance during Google Meet meetings using Chrome's Built-in AI.

## Features

- **Smart Note-Taking**: Type notes and AI automatically detects action items
- **Screenshot Capture**: Capture and analyze slides with multimodal AI
- **Meeting Summaries**: Generate comprehensive summaries instantly
- **Follow-up Emails**: Auto-draft professional follow-up emails
- **Privacy-First**: All processing happens locally using Chrome Built-in AI

## Installation (Development)

### Prerequisites

1. **Chrome Canary or Dev Channel** (version 127+)
   - Download from: https://www.google.com/chrome/canary/

2. **Enable Chrome AI APIs**
   - Open `chrome://flags`
   - Search for and enable:
     - `#optimization-guide-on-device-model`
     - `#prompt-api-for-gemini-nano`
     - `#summarization-api-for-gemini-nano`
     - `#writer-api-for-gemini-nano`
   - Restart Chrome

3. **Download AI Model**
   - Open DevTools Console (F12)
   - Run: `await ai.languageModel.create()`
   - Wait for model to download (may take a few minutes)

### Load Extension

1. Clone or download this repository
2. Open Chrome and go to `chrome://extensions/`
3. Enable "Developer mode" (toggle in top right)
4. Click "Load unpacked"
5. Select the `meetmate` folder
6. Extension should now appear in your toolbar

## Usage

1. **Join a Google Meet**
   - Go to https://meet.google.com
   - Join or start a meeting
   - MeetMate side panel will open automatically

2. **Take Notes**
   - Switch to the "Notes" tab
   - Type your meeting notes
   - Click "Detect Action Items" to extract tasks

3. **Capture Screenshots**
   - Switch to "Screenshots" tab
   - Click "Capture Screenshot" when important slides appear
   - AI will analyze and extract key points

4. **Generate Summary**
   - Switch to "Summary" tab
   - Click "Generate Summary" to create meeting recap
   - Click "Draft Email" for follow-up email template
   - Click "Copy to Clipboard" to use the email

## Project Structure

```
meetmate/
├── manifest.json                 # Extension configuration
├── content-scripts/
│   └── meet-injector.js         # Google Meet page detection
├── background/
│   └── service-worker.js        # Chrome AI integration
├── sidepanel/
│   ├── panel.html               # Side panel UI
│   ├── panel.css                # Styles (+ Tailwind CSS)
│   └── panel.js                 # Side panel logic
└── assets/
    └── icons/
        └── icon.svg             # Extension icon
```

## Chrome AI APIs Used

- **Prompt API** (text) - Action item detection
- **Prompt API** (multimodal) - Screenshot analysis
- **Summarizer API** - Meeting summaries
- **Writer API** - Email generation
- **Rewriter API** - Caption simplification (planned)

## Development Status

✅ **Completed (Day 1)**
- Extension scaffold
- Side panel UI with Tailwind CSS
- Content script for Google Meet detection
- Background service worker
- Chrome AI integration
- Basic functionality

🚧 **Next Steps (Day 2-3)**
- Test all Chrome AI APIs
- Implement screenshot analysis (multimodal)
- Polish UI/UX
- Add error handling
- Performance optimization

## Troubleshooting

### "AI not available" error

- Make sure you're using Chrome Canary/Dev (127+)
- Check that all flags are enabled in `chrome://flags`
- Verify AI model is downloaded: `await ai.languageModel.create()`
- Restart Chrome after enabling flags

### Side panel doesn't open

- Make sure you're on meet.google.com
- Join an active meeting (not just the home page)
- Check browser console for errors (F12)

### Screenshots not working

- Grant screen capture permissions when prompted
- Make sure you're sharing your screen in the meeting
- Check chrome://extensions for permission errors

## License

MIT License - See LICENSE file for details

## Credits

Built for the Google Chrome Built-in AI Challenge 2025

Powered by Chrome Built-in AI APIs
