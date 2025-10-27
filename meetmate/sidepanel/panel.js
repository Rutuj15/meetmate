// MeetMate Side Panel Logic

// DOM Elements
const tabButtons = document.querySelectorAll('.tab-btn');
const tabPanes = document.querySelectorAll('.tab-pane');
const statusDot = document.getElementById('statusDot');
const statusText = document.getElementById('statusText');

// Notes Tab
const notesInput = document.getElementById('notesInput');
const analyzeNotesBtn = document.getElementById('analyzeNotes');
const actionItemsSection = document.getElementById('actionItemsSection');
const actionItemsList = document.getElementById('actionItemsList');

// Screenshots Tab
const captureBtn = document.getElementById('captureBtn');
const screenshotGallery = document.getElementById('screenshotGallery');
const screenshotHelp = document.getElementById('screenshotHelp');

// Summary Tab
const generateSummaryBtn = document.getElementById('generateSummary');
const summaryContent = document.getElementById('summaryContent');
const emailSection = document.getElementById('emailSection');
const draftEmailBtn = document.getElementById('draftEmail');
const emailContent = document.getElementById('emailContent');
const copyEmailBtn = document.getElementById('copyEmail');

// State
let meetingData = {
  notes: '',
  actionItems: [],
  screenshots: [],
  summary: '',
  email: ''
};

// Initialize
async function init() {
  updateStatus('Checking AI availability...', 'loading');

  // Check Chrome AI availability
  const aiAvailable = await checkAIAvailability();

  if (aiAvailable) {
    updateStatus('AI Ready', 'ready');
  } else {
    updateStatus('AI not available', 'error');
  }

  // Load saved data
  await loadMeetingData();

  // Set up event listeners
  setupEventListeners();
}

// Check if Chrome AI APIs are available
async function checkAIAvailability() {
  try {
    // Check for Prompt API
    if (typeof ai !== 'undefined' && ai.languageModel) {
      return true;
    }
    return false;
  } catch (error) {
    console.error('AI availability check failed:', error);
    return false;
  }
}

// Update status indicator
function updateStatus(message, state = 'loading') {
  statusText.textContent = message;
  statusDot.className = 'w-2 h-2 rounded-full status-dot';

  if (state === 'ready') {
    statusDot.classList.add('bg-green-500');
  } else if (state === 'error') {
    statusDot.classList.add('bg-red-500');
  } else {
    statusDot.classList.add('bg-gray-400');
  }
}

// Tab switching
function setupEventListeners() {
  // Tab navigation
  tabButtons.forEach(button => {
    button.addEventListener('click', () => {
      const targetTab = button.dataset.tab;
      switchTab(targetTab);
    });
  });

  // Notes
  notesInput.addEventListener('input', debounce(saveNotes, 500));
  analyzeNotesBtn.addEventListener('click', analyzeNotes);

  // Screenshots
  captureBtn.addEventListener('click', captureScreenshot);

  // Summary
  generateSummaryBtn.addEventListener('click', generateSummary);
  draftEmailBtn.addEventListener('click', draftEmail);
  copyEmailBtn.addEventListener('click', copyEmail);
}

// Switch between tabs
function switchTab(tabName) {
  // Update buttons
  tabButtons.forEach(btn => {
    if (btn.dataset.tab === tabName) {
      btn.className = 'tab-btn flex-1 px-4 py-3 text-sm font-medium text-purple-600 border-b-2 border-purple-600 -mb-0.5';
    } else {
      btn.className = 'tab-btn flex-1 px-4 py-3 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50';
    }
  });

  // Update panes
  tabPanes.forEach(pane => {
    if (pane.id === tabName) {
      pane.classList.remove('hidden');
    } else {
      pane.classList.add('hidden');
    }
  });
}

// Save notes to storage
async function saveNotes() {
  meetingData.notes = notesInput.value;
  await chrome.storage.local.set({ meetingData });
}

// Load meeting data from storage
async function loadMeetingData() {
  const result = await chrome.storage.local.get('meetingData');
  if (result.meetingData) {
    meetingData = result.meetingData;
    notesInput.value = meetingData.notes || '';

    // Restore action items
    if (meetingData.actionItems?.length > 0) {
      displayActionItems(meetingData.actionItems);
    }

    // Restore screenshots
    if (meetingData.screenshots?.length > 0) {
      displayScreenshots(meetingData.screenshots);
    }

    // Restore summary
    if (meetingData.summary) {
      summaryContent.textContent = meetingData.summary;
      summaryContent.classList.remove('hidden');
      emailSection.classList.remove('hidden');
    }
  }
}

// Analyze notes for action items
async function analyzeNotes() {
  const notes = notesInput.value.trim();

  if (!notes) {
    alert('Please enter some notes first');
    return;
  }

  setButtonLoading(analyzeNotesBtn, true);
  updateStatus('Analyzing notes...', 'loading');

  try {
    // Send to background script for AI processing
    const response = await chrome.runtime.sendMessage({
      action: 'analyzeActionItems',
      notes: notes
    });

    if (response.success) {
      meetingData.actionItems = response.actionItems;
      await chrome.storage.local.set({ meetingData });
      displayActionItems(response.actionItems);
      updateStatus('AI Ready', 'ready');
    } else {
      throw new Error(response.error || 'Failed to analyze notes');
    }
  } catch (error) {
    console.error('Error analyzing notes:', error);
    alert('Failed to analyze notes. Please try again.');
    updateStatus('AI Ready', 'ready');
  } finally {
    setButtonLoading(analyzeNotesBtn, false);
  }
}

// Display action items
function displayActionItems(items) {
  if (!items || items.length === 0) {
    actionItemsSection.classList.add('hidden');
    return;
  }

  actionItemsSection.classList.remove('hidden');
  actionItemsList.innerHTML = items.map(item => `
    <div class="p-3 bg-gray-100 border-l-4 border-purple-600 rounded">
      <div class="font-medium text-gray-900">${escapeHtml(item.task)}</div>
      <div class="text-sm text-gray-600 mt-1">
        ${item.assignee ? `Assignee: ${escapeHtml(item.assignee)}` : ''}
        ${item.assignee && item.deadline ? ' • ' : ''}
        ${item.deadline ? `Due: ${escapeHtml(item.deadline)}` : ''}
      </div>
    </div>
  `).join('');
}

// Capture screenshot
async function captureScreenshot() {
  setButtonLoading(captureBtn, true);
  updateStatus('Capturing screenshot...', 'loading');

  try {
    const response = await chrome.runtime.sendMessage({
      action: 'captureScreenshot'
    });

    if (response.success) {
      const screenshot = {
        id: Date.now(),
        dataUrl: response.dataUrl,
        timestamp: new Date().toISOString(),
        analysis: response.analysis || null
      };

      meetingData.screenshots.push(screenshot);
      await chrome.storage.local.set({ meetingData });
      displayScreenshots(meetingData.screenshots);

      screenshotHelp.classList.add('hidden');
      updateStatus('AI Ready', 'ready');
    } else {
      throw new Error(response.error || 'Failed to capture screenshot');
    }
  } catch (error) {
    console.error('Error capturing screenshot:', error);
    alert('Failed to capture screenshot. Please try again.');
    updateStatus('AI Ready', 'ready');
  } finally {
    setButtonLoading(captureBtn, false);
  }
}

// Display screenshots
function displayScreenshots(screenshots) {
  if (!screenshots || screenshots.length === 0) {
    return;
  }

  screenshotGallery.innerHTML = screenshots.map((screenshot, index) => `
    <div class="cursor-pointer border-2 border-gray-300 rounded-lg overflow-hidden hover:border-purple-600 hover:shadow-lg transition-all" data-id="${screenshot.id}">
      <img src="${screenshot.dataUrl}" alt="Screenshot ${index + 1}" class="w-full h-auto">
      <div class="p-2 bg-gray-100 text-xs font-medium text-gray-700">
        Slide ${index + 1}
        ${screenshot.analysis ? '<span class="text-green-600">✓ Analyzed</span>' : '<span class="text-gray-400">⧗ Analyzing...</span>'}
      </div>
    </div>
  `).join('');

  // Add click listeners
  screenshotGallery.querySelectorAll('[data-id]').forEach(el => {
    el.addEventListener('click', () => {
      const id = parseInt(el.dataset.id);
      showScreenshotDetail(id);
    });
  });
}

// Show screenshot detail (will implement modal later)
function showScreenshotDetail(id) {
  const screenshot = meetingData.screenshots.find(s => s.id === id);
  if (screenshot && screenshot.analysis) {
    alert(`Analysis:\n\n${screenshot.analysis}`);
  } else {
    alert('Analysis in progress...');
  }
}

// Generate meeting summary
async function generateSummary() {
  if (!meetingData.notes && meetingData.screenshots.length === 0) {
    alert('Please add notes or capture screenshots first');
    return;
  }

  setButtonLoading(generateSummaryBtn, true);
  updateStatus('Generating summary...', 'loading');

  try {
    const response = await chrome.runtime.sendMessage({
      action: 'generateSummary',
      notes: meetingData.notes,
      actionItems: meetingData.actionItems,
      screenshots: meetingData.screenshots
    });

    if (response.success) {
      meetingData.summary = response.summary;
      await chrome.storage.local.set({ meetingData });

      summaryContent.textContent = response.summary;
      summaryContent.classList.remove('hidden');
      emailSection.classList.remove('hidden');
      updateStatus('AI Ready', 'ready');
    } else {
      throw new Error(response.error || 'Failed to generate summary');
    }
  } catch (error) {
    console.error('Error generating summary:', error);
    alert('Failed to generate summary. Please try again.');
    updateStatus('AI Ready', 'ready');
  } finally {
    setButtonLoading(generateSummaryBtn, false);
  }
}

// Draft follow-up email
async function draftEmail() {
  if (!meetingData.summary) {
    alert('Please generate a summary first');
    return;
  }

  setButtonLoading(draftEmailBtn, true);
  updateStatus('Drafting email...', 'loading');

  try {
    const response = await chrome.runtime.sendMessage({
      action: 'draftEmail',
      summary: meetingData.summary,
      actionItems: meetingData.actionItems
    });

    if (response.success) {
      meetingData.email = response.email;
      await chrome.storage.local.set({ meetingData });

      emailContent.textContent = response.email;
      emailContent.classList.remove('hidden');
      copyEmailBtn.classList.remove('hidden');
      updateStatus('AI Ready', 'ready');
    } else {
      throw new Error(response.error || 'Failed to draft email');
    }
  } catch (error) {
    console.error('Error drafting email:', error);
    alert('Failed to draft email. Please try again.');
    updateStatus('AI Ready', 'ready');
  } finally {
    setButtonLoading(draftEmailBtn, false);
  }
}

// Copy email to clipboard
async function copyEmail() {
  try {
    await navigator.clipboard.writeText(meetingData.email);

    // Show success feedback
    const originalText = copyEmailBtn.textContent;
    copyEmailBtn.textContent = '✓ Copied!';
    copyEmailBtn.classList.add('bg-green-100', 'text-green-700');

    setTimeout(() => {
      copyEmailBtn.textContent = originalText;
      copyEmailBtn.classList.remove('bg-green-100', 'text-green-700');
    }, 2000);
  } catch (error) {
    console.error('Error copying to clipboard:', error);
    alert('Failed to copy to clipboard');
  }
}

// Utilities
function setButtonLoading(button, loading) {
  if (loading) {
    button.disabled = true;
    button.style.opacity = '0.6';
    button.style.cursor = 'not-allowed';
  } else {
    button.disabled = false;
    button.style.opacity = '1';
    button.style.cursor = 'pointer';
  }
}

function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

// Initialize on load
init();
