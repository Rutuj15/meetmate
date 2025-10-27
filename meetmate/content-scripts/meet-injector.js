// MeetMate - Google Meet Content Script

console.log('MeetMate: Content script loaded');

// Check if we're in a Google Meet call
function isInMeeting() {
  // Check for various indicators that we're in an active meeting
  const meetingIndicators = [
    '[data-meeting-id]',
    '[data-participant-id]',
    '[aria-label*="meeting"]',
    '.u6vdEc', // Meet video container
    '[jsname="BOHaEe"]' // Meet controls
  ];

  return meetingIndicators.some(selector => document.querySelector(selector) !== null);
}

// Detect when user joins a meeting
function detectMeetingJoin() {
  const observer = new MutationObserver((mutations) => {
    if (isInMeeting()) {
      console.log('MeetMate: Meeting detected!');
      notifyBackgroundMeetingStarted();
      observer.disconnect(); // Stop observing once detected
    }
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true
  });

  // Also check immediately
  if (isInMeeting()) {
    console.log('MeetMate: Meeting already in progress');
    notifyBackgroundMeetingStarted();
  }
}

// Notify background script that meeting has started
function notifyBackgroundMeetingStarted() {
  chrome.runtime.sendMessage({
    action: 'meetingStarted',
    url: window.location.href,
    timestamp: new Date().toISOString()
  }).catch(error => {
    console.error('MeetMate: Error notifying background:', error);
  });
}

// Monitor for captions (for future caption simplification feature)
function monitorCaptions() {
  // Google Meet captions container selector
  const captionsSelector = '[jsname="tgaKEf"]';

  const observer = new MutationObserver((mutations) => {
    const captionsElement = document.querySelector(captionsSelector);
    if (captionsElement) {
      const captionText = captionsElement.textContent;
      if (captionText) {
        // Send to background for processing
        chrome.runtime.sendMessage({
          action: 'captionDetected',
          text: captionText,
          timestamp: new Date().toISOString()
        }).catch(error => {
          // Silently fail - captions are optional feature
          console.debug('MeetMate: Caption processing skipped');
        });
      }
    }
  });

  // Start observing for captions
  const startObserving = () => {
    const target = document.querySelector(captionsSelector);
    if (target) {
      observer.observe(target, {
        childList: true,
        subtree: true,
        characterData: true
      });
      console.log('MeetMate: Caption monitoring started');
    }
  };

  // Try to start observing, or wait for captions to appear
  setTimeout(startObserving, 2000);
}

// Listen for messages from background script
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === 'getMeetingInfo') {
    sendResponse({
      success: true,
      inMeeting: isInMeeting(),
      url: window.location.href,
      title: document.title
    });
  }
  return true;
});

// Initialize
function init() {
  console.log('MeetMate: Initializing on Google Meet');

  // Detect meeting join
  detectMeetingJoin();

  // Start caption monitoring (for accessibility feature)
  monitorCaptions();

  // Notify background that content script is ready
  chrome.runtime.sendMessage({
    action: 'contentScriptReady',
    url: window.location.href
  }).catch(error => {
    console.error('MeetMate: Error notifying background:', error);
  });
}

// Start when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
