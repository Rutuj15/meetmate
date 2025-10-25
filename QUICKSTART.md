# MeetMate - Quick Start Guide

## 🚀 When You Come Back, Start Here

### First Thing: Tell Claude
```
"I'm working on MeetMate for the Chrome AI Challenge.
Read PROJECT_BRIEF.md and help me continue from where I left off."
```

---

## ✅ What We've Decided

- **Project:** MeetMate - AI Meeting Co-Pilot Chrome Extension
- **Target:** Google Chrome Built-in AI Challenge 2025
- **Deadline:** October 31, 2025 (6 days)
- **Prize Categories:** Most Helpful ($14k), Best Multimodal ($9k), Best Hybrid ($9k)

---

## 🎯 Core Features to Build

1. **Screenshot Capture** - Capture slides during meetings (MULTIMODAL SHOWCASE)
2. **Action Item Detector** - AI finds tasks from notes
3. **Meeting Summary** - AI generates summary
4. **Email Drafter** - AI writes follow-up email
5. **Caption Simplifier** - Accessibility feature (BONUS)
6. **Hybrid Mode** - Local vs Cloud toggle (BONUS)

---

## 📋 Day 1 Tasks (Start Here)

### 1. Create Project Structure
```bash
cd C:\Users\USER\chrome-ai
mkdir meetmate
cd meetmate
mkdir -p content-scripts background sidepanel utils assets/icons
```

### 2. Ask Claude to Generate:
- [ ] `manifest.json` (Manifest V3)
- [ ] Basic `sidepanel/panel.html`
- [ ] Basic `sidepanel/panel.css`
- [ ] `content-scripts/meet-injector.js`
- [ ] `background/service-worker.js`

### 3. Test Extension Loads
- Load unpacked extension in Chrome
- Navigate to meet.google.com
- Verify side panel opens

---

## 🔑 Chrome AI APIs We're Using

1. **Prompt API (text)** - Action items, analysis
2. **Prompt API (multimodal)** - Screenshot analysis ⭐ KEY FEATURE
3. **Summarizer API** - Meeting summaries
4. **Writer API** - Email drafts, formatting
5. **Rewriter API** - Caption simplification
6. **Translator API** - Optional translations

---

## 🎬 Priority Order (MVP First)

### MUST HAVE (Days 1-4):
1. Screenshot capture + AI analysis (multimodal)
2. Action item detection
3. Meeting summary
4. Basic side panel UI

### NICE TO HAVE (Days 5-6):
5. Email draft
6. Caption simplifier
7. Hybrid mode
8. Demo video

---

## 📖 Key Files to Reference

- `PROJECT_BRIEF.md` - Full specification (read this!)
- `QUICKSTART.md` - This file
- Chrome AI Docs: https://developer.chrome.com/docs/ai/built-in

---

## 💡 Quick Commands for Claude

### Get Started:
```
"Help me create the manifest.json for MeetMate following Manifest V3"
```

### When Stuck:
```
"I'm on Day X of the MeetMate roadmap. What should I work on next?"
```

### For Code:
```
"Generate the content script that detects Google Meet pages and injects the side panel"
```

### For Testing:
```
"How do I test the Prompt API multimodal with a screenshot in Chrome?"
```

---

## ⏰ Timeline Reminder

- **Today (Day 1):** Extension scaffold
- **Day 2:** Chrome AI text features
- **Day 3:** Screenshot + multimodal ⭐
- **Day 4:** Writer API, email drafts
- **Day 5:** Hybrid mode + polish
- **Day 6:** Demo video + submit

---

## 🎯 Success Metrics

**Minimum to Submit:**
- ✅ Loads on Google Meet
- ✅ Can capture screenshots
- ✅ AI analyzes images (Prompt API multimodal)
- ✅ Detects action items from text
- ✅ Generates summary
- ✅ Demo video showing it work

**This alone can win Best Multimodal ($9k)!**

---

## 🆘 If You Need Help

Read the detailed sections in PROJECT_BRIEF.md:
- Technical Architecture (page 8)
- 6-Day Implementation Roadmap (page 10)
- Potential Challenges & Solutions (page 16)

---

**Ready to build? Let's go! 🚀**
