// MeetMate - Background Service Worker

console.log('MeetMate: Service worker started');

// Listen for extension installation
chrome.runtime.onInstalled.addListener(() => {
  console.log('MeetMate: Extension installed');
});

// Handle messages from content scripts and side panel
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  console.log('MeetMate: Received message:', message.action);

  switch (message.action) {
    case 'contentScriptReady':
      handleContentScriptReady(sender);
      sendResponse({ success: true });
      break;

    case 'meetingStarted':
      handleMeetingStarted(message, sender);
      sendResponse({ success: true });
      break;

    case 'analyzeActionItems':
      handleAnalyzeActionItems(message, sendResponse);
      return true; // Keep channel open for async response

    case 'captureScreenshot':
      handleCaptureScreenshot(sender, sendResponse);
      return true; // Keep channel open for async response

    case 'generateSummary':
      handleGenerateSummary(message, sendResponse);
      return true; // Keep channel open for async response

    case 'draftEmail':
      handleDraftEmail(message, sendResponse);
      return true; // Keep channel open for async response

    case 'captionDetected':
      handleCaptionDetected(message, sendResponse);
      sendResponse({ success: true });
      break;

    default:
      sendResponse({ success: false, error: 'Unknown action' });
  }

  return false;
});

// Content script is ready
function handleContentScriptReady(sender) {
  console.log('MeetMate: Content script ready on tab', sender.tab.id);
}

// Meeting has started - open side panel
async function handleMeetingStarted(message, sender) {
  console.log('MeetMate: Meeting started', message);

  try {
    // Open side panel for this tab
    await chrome.sidePanel.open({ tabId: sender.tab.id });
    console.log('MeetMate: Side panel opened');
  } catch (error) {
    console.error('MeetMate: Error opening side panel:', error);
  }
}

// Analyze notes for action items using Chrome AI
async function handleAnalyzeActionItems(message, sendResponse) {
  console.log('MeetMate: Analyzing action items');

  try {
    const actionItems = await analyzeActionItemsWithAI(message.notes);
    sendResponse({ success: true, actionItems });
  } catch (error) {
    console.error('MeetMate: Error analyzing action items:', error);
    sendResponse({ success: false, error: error.message });
  }
}

// Capture screenshot and analyze with AI
async function handleCaptureScreenshot(sender, sendResponse) {
  console.log('MeetMate: Capturing screenshot');

  try {
    // Capture the visible tab
    const dataUrl = await chrome.tabs.captureVisibleTab(sender.tab.windowId, {
      format: 'png'
    });

    // Analyze the screenshot with AI (multimodal)
    let analysis = null;
    try {
      analysis = await analyzeScreenshotWithAI(dataUrl);
    } catch (error) {
      console.warn('MeetMate: Screenshot analysis failed:', error);
      // Continue without analysis - at least we have the screenshot
    }

    sendResponse({
      success: true,
      dataUrl,
      analysis
    });
  } catch (error) {
    console.error('MeetMate: Error capturing screenshot:', error);
    sendResponse({ success: false, error: error.message });
  }
}

// Generate meeting summary
async function handleGenerateSummary(message, sendResponse) {
  console.log('MeetMate: Generating summary');

  try {
    const summary = await generateSummaryWithAI(message);
    sendResponse({ success: true, summary });
  } catch (error) {
    console.error('MeetMate: Error generating summary:', error);
    sendResponse({ success: false, error: error.message });
  }
}

// Draft follow-up email
async function handleDraftEmail(message, sendResponse) {
  console.log('MeetMate: Drafting email');

  try {
    const email = await draftEmailWithAI(message);
    sendResponse({ success: true, email });
  } catch (error) {
    console.error('MeetMate: Error drafting email:', error);
    sendResponse({ success: false, error: error.message });
  }
}

// Handle caption detection (for future simplification feature)
function handleCaptionDetected(message, sendResponse) {
  // Placeholder for caption simplification feature
  console.debug('MeetMate: Caption detected:', message.text);
}

// ============================================================================
// Chrome AI Integration Functions
// ============================================================================

// Analyze action items from notes using Prompt API
async function analyzeActionItemsWithAI(notes) {
  try {
    // Check if AI is available
    if (typeof ai === 'undefined' || !ai.languageModel) {
      console.warn('MeetMate: Chrome AI not available, using fallback');
      return analyzeActionItemsFallback(notes);
    }

    const session = await ai.languageModel.create({
      systemPrompt: 'You are an AI assistant that extracts action items from meeting notes. Return only a JSON array of objects with "task", "assignee", and "deadline" fields. If assignee or deadline is not mentioned, use null.'
    });

    const prompt = `Extract all action items from these meeting notes:\n\n${notes}\n\nReturn ONLY valid JSON array format, nothing else.`;
    const result = await session.prompt(prompt);

    // Parse the response
    try {
      const actionItems = JSON.parse(result);
      return Array.isArray(actionItems) ? actionItems : [];
    } catch (parseError) {
      console.warn('MeetMate: Failed to parse AI response, using fallback');
      return analyzeActionItemsFallback(notes);
    }
  } catch (error) {
    console.error('MeetMate: AI analysis failed:', error);
    return analyzeActionItemsFallback(notes);
  }
}

// Fallback action item detection (simple pattern matching)
function analyzeActionItemsFallback(notes) {
  const actionItems = [];
  const lines = notes.split('\n');

  // Simple patterns to detect action items
  const actionPatterns = [
    /(?:need to|should|must|will|todo|action item:?)\s+(.+)/i,
    /\[[ x]\]\s*(.+)/i, // Markdown checkboxes
    /-\s*(.+(?:by|before|due).+)/i // List items with deadlines
  ];

  lines.forEach(line => {
    for (const pattern of actionPatterns) {
      const match = line.match(pattern);
      if (match) {
        const task = match[1].trim();

        // Try to extract assignee
        const assigneeMatch = task.match(/(?:for|@|assignee:?)\s*([a-zA-Z]+)/i);
        const assignee = assigneeMatch ? assigneeMatch[1] : null;

        // Try to extract deadline
        const deadlineMatch = task.match(/(?:by|before|due|deadline:?)\s*([a-zA-Z0-9\s,]+)/i);
        const deadline = deadlineMatch ? deadlineMatch[1].trim() : null;

        actionItems.push({ task, assignee, deadline });
        break;
      }
    }
  });

  return actionItems;
}

// Analyze screenshot using Prompt API (multimodal)
async function analyzeScreenshotWithAI(dataUrl) {
  try {
    // Check if multimodal AI is available
    if (typeof ai === 'undefined' || !ai.languageModel) {
      throw new Error('Chrome AI not available');
    }

    // Create a session for image analysis
    const session = await ai.languageModel.create({
      systemPrompt: 'You are an AI assistant that analyzes presentation slides and meeting screenshots. Extract key points, text, and important information.'
    });

    // Convert data URL to blob for the API
    const response = await fetch(dataUrl);
    const blob = await response.blob();

    // Use prompt with image
    const prompt = 'Analyze this meeting slide/screenshot. Extract:\n1. Main title or heading\n2. Key points and bullet points\n3. Any action items or important information\n\nBe concise and structured.';

    // Note: This assumes multimodal support - may need adjustment based on actual API
    const result = await session.prompt(prompt, { image: blob });

    return result;
  } catch (error) {
    console.error('MeetMate: Screenshot analysis failed:', error);
    // Return null - screenshot will be saved without analysis
    return null;
  }
}

// Generate meeting summary using Summarizer API
async function generateSummaryWithAI(data) {
  try {
    // Combine all content
    let contentToSummarize = '';

    if (data.notes) {
      contentToSummarize += `Meeting Notes:\n${data.notes}\n\n`;
    }

    if (data.actionItems && data.actionItems.length > 0) {
      contentToSummarize += `Action Items:\n`;
      data.actionItems.forEach(item => {
        contentToSummarize += `- ${item.task}`;
        if (item.assignee) contentToSummarize += ` (${item.assignee})`;
        if (item.deadline) contentToSummarize += ` - Due: ${item.deadline}`;
        contentToSummarize += '\n';
      });
      contentToSummarize += '\n';
    }

    if (data.screenshots && data.screenshots.length > 0) {
      contentToSummarize += `Captured ${data.screenshots.length} slide(s)\n`;
      data.screenshots.forEach((screenshot, index) => {
        if (screenshot.analysis) {
          contentToSummarize += `\nSlide ${index + 1}:\n${screenshot.analysis}\n`;
        }
      });
    }

    // Check if Summarizer API is available
    if (typeof ai !== 'undefined' && ai.summarizer) {
      const summarizer = await ai.summarizer.create({
        type: 'key-points',
        format: 'markdown',
        length: 'medium'
      });

      const summary = await summarizer.summarize(contentToSummarize);
      return summary;
    } else {
      // Fallback: use Prompt API
      const session = await ai.languageModel.create({
        systemPrompt: 'You are an AI assistant that creates concise meeting summaries.'
      });

      const prompt = `Create a concise meeting summary from this content:\n\n${contentToSummarize}`;
      const summary = await session.prompt(prompt);
      return summary;
    }
  } catch (error) {
    console.error('MeetMate: Summary generation failed:', error);
    throw new Error('Failed to generate summary. Please try again.');
  }
}

// Draft email using Writer API
async function draftEmailWithAI(data) {
  try {
    // Build email context
    const context = {
      summary: data.summary,
      actionItems: data.actionItems || []
    };

    // Check if Writer API is available
    if (typeof ai !== 'undefined' && ai.writer) {
      const writer = await ai.writer.create({
        tone: 'professional',
        format: 'email',
        length: 'medium'
      });

      const prompt = `Draft a professional follow-up email for a meeting with this summary:\n\n${context.summary}\n\nAction Items:\n${context.actionItems.map(item => `- ${item.task}`).join('\n')}`;

      const email = await writer.write(prompt);
      return email;
    } else {
      // Fallback: use Prompt API
      const session = await ai.languageModel.create({
        systemPrompt: 'You are an AI assistant that drafts professional follow-up emails for meetings.'
      });

      const prompt = `Draft a professional follow-up email for a meeting.\n\nSummary:\n${context.summary}\n\nAction Items:\n${context.actionItems.map(item => `- ${item.task}`).join('\n')}\n\nInclude a greeting, summary, action items, and closing.`;

      const email = await session.prompt(prompt);
      return email;
    }
  } catch (error) {
    console.error('MeetMate: Email drafting failed:', error);
    throw new Error('Failed to draft email. Please try again.');
  }
}

console.log('MeetMate: Service worker ready');
