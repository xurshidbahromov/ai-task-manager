# 🌌 AETHER: The Next-Gen Life OS

> **Your personal AI companion for productivity and financial clarity.**  
> *Experience the power of an intelligent Task Manager fused with a seamless Finance Tracker, all wrapped in a premium Obsidian-Glass aesthetic.*

<div align="center">
  <img src="./frontend/public/favicon.png" width="120" height="120" />
  <br/>
  <br/>

  ![React](https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB)
  ![Vite](https://img.shields.io/badge/vite-%23646CFF.svg?style=for-the-badge&logo=vite&logoColor=white)
  ![Python](https://img.shields.io/badge/python-3670A0?style=for-the-badge&logo=python&logoColor=ffdd54)
  ![FastAPI](https://img.shields.io/badge/FastAPI-005571?style=for-the-badge&logo=fastapi)
  ![SQLite](https://img.shields.io/badge/sqlite-%2307405e.svg?style=for-the-badge&logo=sqlite&logoColor=white)
</div>

## ✨ Why this app is special?
This isn't just a To-Do list. It's a **Life Operating System** designed for high-performers. We've combined state-of-the-art AI with gamification and financial tracking to create an ecosystem where you don't just "do things" — you move forward.

### 🚀 Key Features

*   **🧠 AI-Powered Strategy**: Don't know where to start? Click the **Magic Wand** 🪄. Our AI breaks down complex goals (e.g., "Learn Python", "Move to New Apartment") into actionable, bite-sized subtasks automatically.
*   **💸 Integrated Finance Tracker**: Manage your wealth alongside your work. Log **Income** and **Expenses** directly in your feed.
    *   **Smart Categorization**: Type "Lunch with team" -> AI tags it as **Food** 🍔.
    *   **Unified Timeline**: See your money moves and life moves in one chronological stream.
*   **🔥 Gamification Engine**: Build momentum with our **Daily Streak System**. Keep the flame alive by completing tasks every day.
*   **🎨 Premium UX/UI**:
    *   **Glassmorphism Design**: Sleek, modern, and distraction-free.
    *   **Mobile-First**: Optimized for every screen size, from iPhone Mini to Ultrawide monitors.
    *   **Micro-interactions**: Satisfying animations for every check, click, and slide.
*   **🔐 Secure & Private**: JWT Authentication and strict data isolationensure your personal data stays yours.

---

## 🛠️ Tech Stack

*   **Frontend**: React (Vite), Framer Motion (Animations), Lucide React (Icons), CSS Modules.
*   **Backend**: FastAPI (Python), SQLAlchemy, Pydantic, Python-Jose (JWT).
*   **AI Engine**: Custom Rule-Based NLP & heuristics (Mock-LLM architecture ready for scaling).
*   **Database**: SQLite (Dev) / PostgreSQL (Prod ready).

---

## 📦 Installation

clone the repository and get started in minutes.

### 1. Backend Setup
```bash
cd backend
python -m venv venv
source venv/bin/activate  # on Windows: venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --reload
```

### 2. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

Visit `http://localhost:5173` to start your journey!

---

## 📜 Version History & Changelog

### **v1.5.0 - The Finance Revolution (Current)** 💵
*Released: January 21, 2026*

This major update transforms the app from a simple Task Manager into a comprehensive **Life OS**.
*   **New Feature: Finance Tracker**: Added dedicated modes for **Income** and **Expense**.
*   **New Feature: Unified Feed**: Transactions now appear in your main timeline alongside tasks, giving you a complete picture of your day.
*   **New Feature: AI Categorization**: The AI now understands financial context. "Uber" becomes *Transport*, "Salary" becomes *Income*.
*   **UX Upgrade**:
    *   **Custom Amount Spinners**: Fine-tune amounts with precision (±10,000 UZS steps).
    *   **Mobile Optimization**: Completely redesigned input forms for mobile devices to ensure full-width accessibility.
    *   **Clean UI**: Removed currency toggles to focus strictly on **UZS** (So'm) for a streamlined local experience.
*   **Profile Update**: Added a financial summary dashboard (Income vs Expense vs Net Balance) to the user profile.

### **v1.4.0 - The Mobile & Context Update** 📱
*   **Mobile Responsiveness**: Fixed header overlapping and input visibility issues on small screens.
*   **Contextual AI**: Enhanced decomposition logic to handle life categories (Gym, Shopping, Rest) more intelligently.
*   **Branding**: Added custom "Obsidian AI" favicon and branding elements.

### **v1.3.0 - The Gamification Update** 🔥
*   **Streak System**: Introduced the "Flame" counter to track consecutive days of productivity.
*   **Profile Modal**: New glass-morphic user profile showing active/completed task stats.

### **v1.2.0 - The Strategy Engine** 🪄
*   **AI Decomposition**: Introduced the "Magic Wand" feature to split tasks into sub-steps.
*   **Priority Intelligence**: Automatic priority tagging (High/Medium/Low) based on task keywords.

### **v1.1.0 - The Foundation** 🏗️
*   **Core Systems**: Secure Login/Signup with JWT.
*   **Database**: User and Task tables implemented.
*   **Basic UI**: Dark mode foundation and component architecture.

---

## 🔮 Roadmap
*   [ ] **Voice Input**: Add tasks by speaking.
*   [ ] **Financial Graphs**: Visual charts for monthly spending.
*   [ ] **Telegram Integration**: Add tasks via bot.
