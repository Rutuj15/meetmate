# MeetMate - Technical Reference Guide

## 🔧 Chrome Built-in AI APIs - Code Examples

This document contains code snippets and examples for implementing Chrome AI features.

---

## 1. Checking API Availability

Always check if Chrome AI APIs are available before using them.

```javascript
// background/service-worker.js or chrome-ai-handler.js

async function checkAIAvailability() {
  const availability = {
    promptAPI: false,
    summarizer: false,
    writer: false,
    rewriter: false,
    translator: false
  };

  try {
    // Check Prompt API (text)
    if ('ai' in self && 'languageModel' in self.ai) {
      const canCreate = await self.ai.languageModel.capabilities();
      availability.promptAPI = canCreate.available === 'readily';
    }

    // Check Summarizer API
    if ('ai' in self && 'summarizer' in self.ai) {
      const canSummarize = await self.ai.summarizer.capabilities();
      availability.summarizer = canSummarize.available === 'readily';
    }

    // Check Writer API
    if ('ai' in self && 'writer' in self.ai) {
      const canWrite = await self.ai.writer.capabilities();
      availability.writer = canWrite.available === 'readily';
    }

    // Check Rewriter API
    if ('ai' in self && 'rewriter' in self.ai) {
      const canRewrite = await self.ai.rewriter.capabilities();
      availability.rewriter = canRewrite.available === 'readily';
    }

    // Check Translator API
    if ('ai' in self && 'translator' in self.ai) {
      const canTranslate = await self.ai.translator.capabilities();
      availability.translator = canTranslate.available === 'readily';
    }

  } catch (error) {
    console.error('Error checking AI availability:', error);
  }

  return availability;
}
```

---

## 2. Prompt API (Text Mode) - Action Item Detection

```javascript
// background/chrome-ai-handler.js

async function detectActionItems(notesText) {
  try {
    // Create a session
    const session = await self.ai.languageModel.create({
      systemPrompt: `You are an AI assistant that extracts action items from meeting notes.
      For each action item found, identify:
      - The task description
      - Who it's assigned to (if mentioned)
      - When it's due (if mentioned)

      Format your response as JSON array:
      [
        {
          "task": "Send proposal",
          "assignee": "John",
          "deadline": "Friday"
        }
      ]`
    });

    // Send the notes
    const result = await session.prompt(`Extract action items from these meeting notes:

${notesText}

Return only the JSON array, no other text.`);

    // Parse the response
    const actionItems = JSON.parse(result);

    // Clean up
    session.destroy();

    return actionItems;

  } catch (error) {
    console.error('Error detecting action items:', error);
    return [];
  }
}

// Usage
const notes = `
Meeting with Sarah and John about Q3 planning.
John needs to send the proposal by Friday.
Sarah will schedule a follow-up meeting next week.
We need to review the budget by end of month.
`;

const actionItems = await detectActionItems(notes);
console.log(actionItems);
```

---

## 3. Prompt API (Multimodal) - Screenshot Analysis ⭐

```javascript
// background/chrome-ai-handler.js

async function analyzeScreenshot(imageBlob) {
  try {
    // Create a session with multimodal support
    const session = await self.ai.languageModel.create({
      systemPrompt: `You are an AI assistant that analyzes meeting slides and presentations.
      Extract:
      - Title or main topic
      - Key points or bullet points
      - Any numbers, dates, or important data
      - Action items if visible

      Format as structured text.`
    });

    // Convert blob to appropriate format if needed
    const result = await session.prompt('Analyze this slide and extract all important information.', {
      image: imageBlob
    });

    session.destroy();

    return result;

  } catch (error) {
    console.error('Error analyzing screenshot:', error);
    return 'Unable to analyze image';
  }
}

// Usage with screenshot
async function captureAndAnalyze() {
  // Capture screenshot (see section 7)
  const imageBlob = await captureScreenshot();

  // Analyze with AI
  const analysis = await analyzeScreenshot(imageBlob);

  return {
    image: imageBlob,
    analysis: analysis,
    timestamp: Date.now()
  };
}
```

---

## 4. Summarizer API - Meeting Summary

```javascript
// background/chrome-ai-handler.js

async function generateMeetingSummary(allNotes, capturedSlides) {
  try {
    // Create summarizer
    const summarizer = await self.ai.summarizer.create({
      type: 'key-points', // or 'tl;dr' or 'teaser' or 'headline'
      format: 'markdown',
      length: 'medium' // or 'short' or 'long'
    });

    // Combine all content
    let fullContent = `Meeting Notes:\n${allNotes}\n\n`;

    if (capturedSlides.length > 0) {
      fullContent += `Captured Slides Analysis:\n`;
      capturedSlides.forEach((slide, index) => {
        fullContent += `\nSlide ${index + 1}:\n${slide.analysis}\n`;
      });
    }

    // Generate summary
    const summary = await summarizer.summarize(fullContent);

    summarizer.destroy();

    return summary;

  } catch (error) {
    console.error('Error generating summary:', error);
    return 'Unable to generate summary';
  }
}

// Usage
const summary = await generateMeetingSummary(
  userNotes,
  capturedSlides
);
```

---

## 5. Writer API - Email Draft

```javascript
// background/chrome-ai-handler.js

async function generateFollowUpEmail(summary, actionItems, attendees) {
  try {
    // Create writer
    const writer = await self.ai.writer.create({
      tone: 'formal', // or 'neutral' or 'casual'
      format: 'plain-text', // or 'markdown'
      length: 'medium'
    });

    const prompt = `Write a professional follow-up email for a meeting with the following details:

Attendees: ${attendees.join(', ')}

Meeting Summary:
${summary}

Action Items:
${actionItems.map(item => `- ${item.task} (${item.assignee}) - Due: ${item.deadline}`).join('\n')}

Include:
- Greeting
- Thank you for attending
- Brief summary
- Action items clearly listed
- Professional closing`;

    const emailDraft = await writer.write(prompt);

    writer.destroy();

    return emailDraft;

  } catch (error) {
    console.error('Error generating email:', error);
    return null;
  }
}

// Usage
const email = await generateFollowUpEmail(
  meetingSummary,
  actionItemsList,
  ['Sarah', 'John', 'Mike']
);
```

---

## 6. Rewriter API - Caption Simplification

```javascript
// content-scripts/meet-injector.js or background handler

async function simplifyCaptions(captionText) {
  try {
    // Create rewriter
    const rewriter = await self.ai.rewriter.create({
      tone: 'more-casual',
      format: 'plain-text',
      length: 'as-is'
    });

    const simplified = await rewriter.rewrite(captionText, {
      context: 'Simplify this to make it easier to understand. Remove jargon and use plain language.'
    });

    rewriter.destroy();

    return simplified;

  } catch (error) {
    console.error('Error simplifying caption:', error);
    return captionText; // Return original if error
  }
}

// Monitor captions in real-time
function observeCaptions() {
  const captionContainer = document.querySelector('[class*="caption"]'); // Adjust selector

  if (!captionContainer) return;

  const observer = new MutationObserver(async (mutations) => {
    for (const mutation of mutations) {
      if (mutation.type === 'childList' || mutation.type === 'characterData') {
        const captionText = captionContainer.textContent;
        if (captionText.length > 10) {
          const simplified = await simplifyCaptions(captionText);
          // Send to side panel to display
          chrome.runtime.sendMessage({
            type: 'SIMPLIFIED_CAPTION',
            original: captionText,
            simplified: simplified
          });
        }
      }
    }
  });

  observer.observe(captionContainer, {
    childList: true,
    subtree: true,
    characterData: true
  });
}
```

---

## 7. Screenshot Capture

```javascript
// utils/screenshot-capture.js

async function captureScreenshot() {
  return new Promise((resolve, reject) => {
    chrome.tabs.captureVisibleTab(
      null,
      { format: 'png', quality: 90 },
      (dataUrl) => {
        if (chrome.runtime.lastError) {
          reject(chrome.runtime.lastError);
          return;
        }

        // Convert data URL to Blob
        fetch(dataUrl)
          .then(res => res.blob())
          .then(blob => resolve(blob))
          .catch(reject);
      }
    );
  });
}

// Compress image before sending to AI
async function compressImage(blob, maxWidth = 1920) {
  return new Promise((resolve) => {
    const img = new Image();
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    img.onload = () => {
      const scale = maxWidth / img.width;
      canvas.width = maxWidth;
      canvas.height = img.height * scale;

      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

      canvas.toBlob((compressedBlob) => {
        resolve(compressedBlob);
      }, 'image/jpeg', 0.8);
    };

    img.src = URL.createObjectURL(blob);
  });
}

// Full capture workflow
async function captureAndCompress() {
  const screenshot = await captureScreenshot();
  const compressed = await compressImage(screenshot);
  return compressed;
}
```

---

## 8. Message Passing (Content Script ↔ Background)

```javascript
// content-scripts/meet-injector.js

// Send message from content script to background
function sendToBackground(message) {
  return new Promise((resolve, reject) => {
    chrome.runtime.sendMessage(message, (response) => {
      if (chrome.runtime.lastError) {
        reject(chrome.runtime.lastError);
      } else {
        resolve(response);
      }
    });
  });
}

// Example: Request action item detection
async function analyzeNotes(notes) {
  const response = await sendToBackground({
    type: 'DETECT_ACTION_ITEMS',
    data: { notes }
  });
  return response.actionItems;
}

// Example: Request screenshot analysis
async function analyzeScreenshot(imageBlob) {
  // Convert blob to data URL for message passing
  const reader = new FileReader();
  const dataUrl = await new Promise((resolve) => {
    reader.onload = () => resolve(reader.result);
    reader.readAsDataURL(imageBlob);
  });

  const response = await sendToBackground({
    type: 'ANALYZE_SCREENSHOT',
    data: { image: dataUrl }
  });

  return response.analysis;
}
```

```javascript
// background/service-worker.js

// Listen for messages from content script
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {

  // Handle asynchronously
  (async () => {
    try {
      switch (message.type) {

        case 'DETECT_ACTION_ITEMS':
          const actionItems = await detectActionItems(message.data.notes);
          sendResponse({ success: true, actionItems });
          break;

        case 'ANALYZE_SCREENSHOT':
          // Convert data URL back to blob
          const response = await fetch(message.data.image);
          const blob = await response.blob();
          const analysis = await analyzeScreenshot(blob);
          sendResponse({ success: true, analysis });
          break;

        case 'GENERATE_SUMMARY':
          const summary = await generateMeetingSummary(
            message.data.notes,
            message.data.slides
          );
          sendResponse({ success: true, summary });
          break;

        default:
          sendResponse({ success: false, error: 'Unknown message type' });
      }
    } catch (error) {
      console.error('Error handling message:', error);
      sendResponse({ success: false, error: error.message });
    }
  })();

  // Return true to indicate async response
  return true;
});
```

---

## 9. Storage Management

```javascript
// utils/storage-manager.js

const StorageManager = {

  // Save meeting data
  async saveMeeting(meetingData) {
    const meetingId = `meeting_${Date.now()}`;
    await chrome.storage.local.set({
      [meetingId]: meetingData,
      lastMeetingId: meetingId
    });
    return meetingId;
  },

  // Get current meeting
  async getCurrentMeeting() {
    const result = await chrome.storage.local.get('lastMeetingId');
    if (result.lastMeetingId) {
      const meeting = await chrome.storage.local.get(result.lastMeetingId);
      return meeting[result.lastMeetingId];
    }
    return null;
  },

  // Update meeting notes
  async updateNotes(meetingId, notes) {
    const meeting = await this.getMeeting(meetingId);
    meeting.notes = notes;
    meeting.lastUpdated = Date.now();
    await chrome.storage.local.set({ [meetingId]: meeting });
  },

  // Add captured slide
  async addSlide(meetingId, slideData) {
    const meeting = await this.getMeeting(meetingId);
    if (!meeting.slides) meeting.slides = [];
    meeting.slides.push(slideData);
    await chrome.storage.local.set({ [meetingId]: meeting });
  },

  // Get meeting by ID
  async getMeeting(meetingId) {
    const result = await chrome.storage.local.get(meetingId);
    return result[meetingId] || null;
  },

  // Get all meetings
  async getAllMeetings() {
    const all = await chrome.storage.local.get(null);
    return Object.keys(all)
      .filter(key => key.startsWith('meeting_'))
      .map(key => all[key]);
  }
};

// Meeting data structure
const meetingDataTemplate = {
  id: '',
  startTime: Date.now(),
  endTime: null,
  url: window.location.href,
  notes: '',
  slides: [],
  actionItems: [],
  summary: null,
  attendees: []
};
```

---

## 10. Side Panel Communication

```javascript
// sidepanel/panel.js

// Listen for updates from background
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  switch (message.type) {

    case 'ACTION_ITEMS_DETECTED':
      displayActionItems(message.data.actionItems);
      break;

    case 'SLIDE_CAPTURED':
      addSlideToGallery(message.data.slide);
      break;

    case 'SUMMARY_GENERATED':
      displaySummary(message.data.summary);
      break;

    case 'SIMPLIFIED_CAPTION':
      updateSimplifiedCaption(message.data.simplified);
      break;
  }
});

// Send action to background
async function requestAnalysis(notes) {
  const response = await chrome.runtime.sendMessage({
    type: 'DETECT_ACTION_ITEMS',
    data: { notes }
  });

  if (response.success) {
    displayActionItems(response.actionItems);
  }
}

// Capture screenshot button handler
document.getElementById('capture-btn').addEventListener('click', async () => {
  // Request screenshot from background
  const response = await chrome.runtime.sendMessage({
    type: 'CAPTURE_SCREENSHOT'
  });

  if (response.success) {
    addSlideToGallery(response.slide);
  }
});
```

---

## 11. Hybrid Mode - Local vs Cloud Routing

```javascript
// background/hybrid-router.js

class HybridRouter {
  constructor() {
    this.mode = 'privacy'; // 'privacy' or 'power'
    this.stats = {
      localProcessed: 0,
      cloudProcessed: 0,
      costSaved: 0
    };
  }

  setMode(mode) {
    this.mode = mode;
    chrome.storage.local.set({ hybridMode: mode });
  }

  async route(task, data) {
    // Privacy mode: always local
    if (this.mode === 'privacy') {
      return await this.processLocal(task, data);
    }

    // Power mode: use cloud for complex tasks
    if (this.mode === 'power') {
      if (this.isComplexTask(task, data)) {
        return await this.processCloud(task, data);
      } else {
        return await this.processLocal(task, data);
      }
    }
  }

  isComplexTask(task, data) {
    // Determine if task needs cloud processing
    if (task === 'ANALYZE_SCREENSHOT' && data.imageSize > 2000000) return true;
    if (task === 'GENERATE_SUMMARY' && data.notes.length > 10000) return true;
    return false;
  }

  async processLocal(task, data) {
    this.stats.localProcessed++;
    this.stats.costSaved += this.estimateCost(task);

    // Use Chrome AI APIs
    switch (task) {
      case 'DETECT_ACTION_ITEMS':
        return await detectActionItems(data.notes);
      case 'ANALYZE_SCREENSHOT':
        return await analyzeScreenshot(data.image);
      case 'GENERATE_SUMMARY':
        return await generateMeetingSummary(data.notes, data.slides);
    }
  }

  async processCloud(task, data) {
    this.stats.cloudProcessed++;

    // Use Gemini API (if implemented)
    // return await callGeminiAPI(task, data);

    // For now, fallback to local
    return await this.processLocal(task, data);
  }

  estimateCost(task) {
    // Estimate what cloud API would cost
    const rates = {
      'DETECT_ACTION_ITEMS': 0.02,
      'ANALYZE_SCREENSHOT': 0.05,
      'GENERATE_SUMMARY': 0.03
    };
    return rates[task] || 0.01;
  }

  getStats() {
    return this.stats;
  }
}

const router = new HybridRouter();
```

---

## 12. Manifest V3 Configuration

```json
{
  "manifest_version": 3,
  "name": "MeetMate - AI Meeting Co-Pilot",
  "version": "1.0.0",
  "description": "Never miss a detail, action item, or slide again. AI-powered meeting assistant using Chrome's built-in AI.",

  "permissions": [
    "activeTab",
    "sidePanel",
    "storage",
    "tabCapture"
  ],

  "host_permissions": [
    "https://meet.google.com/*",
    "https://*.zoom.us/*"
  ],

  "background": {
    "service_worker": "background/service-worker.js",
    "type": "module"
  },

  "content_scripts": [
    {
      "matches": ["https://meet.google.com/*"],
      "js": ["content-scripts/meet-injector.js"],
      "run_at": "document_end"
    }
  ],

  "side_panel": {
    "default_path": "sidepanel/panel.html"
  },

  "action": {
    "default_title": "MeetMate",
    "default_icon": {
      "16": "assets/icons/icon16.png",
      "48": "assets/icons/icon48.png",
      "128": "assets/icons/icon128.png"
    }
  },

  "icons": {
    "16": "assets/icons/icon16.png",
    "48": "assets/icons/icon48.png",
    "128": "assets/icons/icon128.png"
  }
}
```

---

## 🔗 Useful Resources

### Chrome AI APIs Documentation:
- Built-in AI Overview: https://developer.chrome.com/docs/ai/built-in
- Prompt API: https://developer.chrome.com/docs/ai/prompt-api
- Multimodal Guide: https://developer.chrome.com/blog/prompt-multimodal-origin-trial
- Summarizer API: https://developer.chrome.com/docs/ai/summarizer-api
- Writer/Rewriter: https://developer.chrome.com/docs/ai/writer-api

### Chrome Extension APIs:
- Side Panel: https://developer.chrome.com/docs/extensions/reference/sidePanel/
- Tab Capture: https://developer.chrome.com/docs/extensions/reference/tabCapture/
- Message Passing: https://developer.chrome.com/docs/extensions/mv3/messaging/

### Testing Chrome AI:
- Check API availability in DevTools Console:
```javascript
await ai.languageModel.capabilities()
await ai.summarizer.capabilities()
```

---

**This reference covers the main APIs you'll need. Refer back to this when implementing features!**
