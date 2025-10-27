# Quick Installation Guide

## Step 1: Get Chrome Canary

You need Chrome Canary (or Chrome Dev) to use the Built-in AI APIs.

**Download:** https://www.google.com/chrome/canary/

## Step 2: Enable AI Flags

1. Open Chrome Canary
2. Go to `chrome://flags`
3. Search for and **Enable** these flags:
   - `optimization-guide-on-device-model` → **Enabled BypassPerfRequirement**
   - `prompt-api-for-gemini-nano` → **Enabled**
   - `summarization-api-for-gemini-nano` → **Enabled**
   - `writer-api-for-gemini-nano` → **Enabled**

4. Click **Relaunch** button at the bottom

## Step 3: Download AI Model

1. After Chrome restarts, press `F12` to open DevTools
2. Go to the **Console** tab
3. Type and run:
   ```javascript
   await ai.languageModel.create()
   ```
4. Wait for the model to download (this may take 5-10 minutes)
5. You should see: `LanguageModel {}`

## Step 4: Load Extension

1. Go to `chrome://extensions/`
2. Enable **Developer mode** (toggle in top-right corner)
3. Click **Load unpacked**
4. Navigate to and select the `meetmate` folder
5. The extension should now appear in your list

## Step 5: Test It

1. Go to https://meet.google.com
2. Start or join a meeting
3. The MeetMate side panel should open automatically
4. Try the features:
   - Type some notes in the Notes tab
   - Click "Capture Screenshot" in Screenshots tab
   - Generate a summary in Summary tab

## Troubleshooting

### "AI not available" in status bar

- Make sure you enabled all flags in Step 2
- Verify the model downloaded in Step 3
- Restart Chrome Canary completely
- Try running `await ai.languageModel.create()` again

### Extension won't load

- Make sure you're using Chrome Canary (not regular Chrome)
- Check for errors in `chrome://extensions` (click "Errors" button)
- Make sure you selected the `meetmate` folder, not a parent folder

### Side panel doesn't open

- You must be in an active Google Meet call
- Try manually opening it: Click the MeetMate extension icon
- Check the browser console (F12) for error messages

### Need More Help?

Check the main README.md file for detailed documentation.
