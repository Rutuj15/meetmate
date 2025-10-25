# MeetMate - Development Checklist

## 📅 Day 1: Foundation (Oct 26)

### Setup
- [ ] Create project folder structure
- [ ] Initialize git repository
- [ ] Create manifest.json (Manifest V3)

### Side Panel
- [ ] Create sidepanel/panel.html
- [ ] Create sidepanel/panel.css
- [ ] Create sidepanel/panel.js
- [ ] Basic UI layout

### Content Script
- [ ] Create content-scripts/meet-injector.js
- [ ] Detect Google Meet pages
- [ ] Inject side panel trigger

### Background
- [ ] Create background/service-worker.js
- [ ] Set up message passing
- [ ] Test extension loads in Chrome

**End of Day 1 Goal:** Extension loads, side panel opens on Meet

---

## 📅 Day 2: Chrome AI Text Features (Oct 27)

### Prompt API Setup
- [ ] Test Prompt API availability
- [ ] Create background/chrome-ai-handler.js
- [ ] Implement basic text prompting

### Note Taking
- [ ] Add note input field to side panel
- [ ] Save notes to chrome.storage.local
- [ ] Display notes in side panel

### Action Item Detection
- [ ] Send notes to Prompt API
- [ ] Parse AI response for action items
- [ ] Display action items in list
- [ ] Format: Task | Assignee | Deadline

### Summarizer API
- [ ] Integrate Summarizer API
- [ ] Generate meeting summary from notes
- [ ] Display summary in side panel

**End of Day 2 Goal:** Can type notes, AI finds action items, creates summary

---

## 📅 Day 3: Multimodal Screenshot Feature (Oct 28) ⭐

### Screenshot Capture
- [ ] Add "Capture" button to side panel
- [ ] Implement chrome.tabCapture
- [ ] Create utils/screenshot-capture.js
- [ ] Compress image before processing

### Image Processing
- [ ] Create utils/image-processor.js
- [ ] Convert screenshot to appropriate format
- [ ] Test image size limits

### Prompt API Multimodal
- [ ] Enable multimodal mode in Prompt API
- [ ] Send image to AI for analysis
- [ ] Prompt: "Extract key points and text from this slide"
- [ ] Parse AI response

### UI for Screenshots
- [ ] Create thumbnail gallery component
- [ ] Display captured screenshots
- [ ] Click thumbnail to see AI analysis
- [ ] Show extracted text/points

**End of Day 3 Goal:** Can capture slides, AI analyzes images (MULTIMODAL WORKING!)

---

## 📅 Day 4: Writer API & Smart Features (Oct 29)

### Writer API Integration
- [ ] Set up Writer API
- [ ] Test basic text generation

### Email Draft Generator
- [ ] Combine summary + action items
- [ ] Use Writer API to draft email
- [ ] Format email professionally
- [ ] "Copy to clipboard" button

### Rewriter API
- [ ] Set up Rewriter API
- [ ] Detect Google Meet captions div
- [ ] Simplify captions in real-time
- [ ] Display simplified version in side panel

### Post-Meeting View
- [ ] Create summary view component
- [ ] Show all captured slides
- [ ] Show all action items
- [ ] Show meeting summary
- [ ] Export buttons

**End of Day 4 Goal:** Complete meeting workflow with email generation

---

## 📅 Day 5: Hybrid Mode & Polish (Oct 30)

### Hybrid AI Mode
- [ ] Create background/hybrid-router.js
- [ ] Add Privacy/Power mode toggle UI
- [ ] Integrate Gemini API (cloud mode)
- [ ] Implement routing logic

### Privacy Dashboard
- [ ] Track local vs cloud processing count
- [ ] Calculate cost savings
- [ ] Display metrics in settings

### Settings Panel
- [ ] Create settings UI
- [ ] Privacy mode toggle
- [ ] Reading level selector
- [ ] Export preferences

### UI/UX Polish
- [ ] Improve visual design
- [ ] Add loading states
- [ ] Add success animations
- [ ] Error handling
- [ ] Responsive layout

### Testing & Optimization
- [ ] Test on fresh Chrome install
- [ ] Performance optimization
- [ ] Memory usage check
- [ ] Fix all bugs
- [ ] Test all features work together

**End of Day 5 Goal:** Production-ready extension with hybrid mode

---

## 📅 Day 6: Demo Video & Submission (Oct 31)

### GitHub Repository
- [ ] Create public GitHub repo
- [ ] Push all code
- [ ] Add MIT License
- [ ] Write comprehensive README.md
- [ ] Add installation instructions
- [ ] Add screenshots to README

### Demo Video (< 3 minutes)
- [ ] Script finalized (use PROJECT_BRIEF.md script)
- [ ] Record screen capture
- [ ] Show problem (meeting chaos)
- [ ] Show MeetMate in action:
  - [ ] Screenshot capture + AI analysis
  - [ ] Action item detection
  - [ ] Privacy mode toggle
  - [ ] Meeting summary
  - [ ] Email draft
- [ ] Add voiceover/text overlays
- [ ] Export video
- [ ] Upload to YouTube (public/unlisted)

### Devpost Submission
- [ ] Create Devpost account
- [ ] Fill out project details
- [ ] Write compelling description
- [ ] List all Chrome AI APIs used
- [ ] Add demo video URL
- [ ] Add GitHub repo URL
- [ ] Upload screenshots (4-5)
- [ ] Select categories:
  - [ ] Chrome Extension
  - [ ] Best Multimodal AI Application
  - [ ] Best Hybrid AI Application
  - [ ] Most Helpful
- [ ] Review submission
- [ ] **SUBMIT before 11:45pm PDT!**

**End of Day 6 Goal:** SUBMITTED! 🎉

---

## 🎯 Minimum Viable Submission

If running out of time, these are MUST HAVES:

### Core Features (Can't Submit Without):
- [x] Extension loads on Google Meet
- [x] Side panel appears
- [x] Screenshot capture button works
- [x] Prompt API (multimodal) analyzes images
- [x] Action item detection from notes
- [x] Basic meeting summary
- [x] Demo video showing it work
- [x] GitHub repo with README

### Nice to Have (But Optional):
- [ ] Email draft feature
- [ ] Caption simplification
- [ ] Hybrid mode
- [ ] Zoom support
- [ ] Export features

**Priority: Multimodal screenshot feature is THE differentiator!**

---

## 🚨 Pre-Submission Checklist

Before clicking submit:

### Testing
- [ ] Installed extension from scratch
- [ ] Tested on real Google Meet
- [ ] All Chrome AI APIs work
- [ ] No console errors
- [ ] Performance is acceptable

### Documentation
- [ ] README is comprehensive
- [ ] Installation steps are clear
- [ ] Screenshots are included
- [ ] Demo video link works

### Video
- [ ] Under 3 minutes ✓
- [ ] Shows all key features ✓
- [ ] Good audio/video quality ✓
- [ ] Publicly accessible on YouTube ✓

### Submission
- [ ] GitHub repo is public
- [ ] Has open source license
- [ ] All code is committed
- [ ] Devpost form is complete
- [ ] Submitted before deadline

---

## 💡 Tips

- **Day 3 is critical** - Screenshot + multimodal is the differentiator
- **Don't over-engineer** - MVP first, polish later
- **Test frequently** - Don't wait until Day 6
- **Keep scope tight** - Better to have 3 features working great than 10 features half-done
- **Demo video matters** - Spend quality time on this

---

## 🆘 If Behind Schedule

### Cut These First:
1. Zoom support (focus on Google Meet only)
2. Translation feature
3. Pre-meeting prep
4. Advanced export options
5. Team sharing features

### Keep These:
1. ✅ Screenshot + AI analysis (MULTIMODAL)
2. ✅ Action item detection
3. ✅ Meeting summary
4. ✅ Side panel UI
5. ✅ Demo video

---

**Track your progress. Ship something amazing. Good luck! 🚀**

---

**Last Updated:** October 26, 2025
