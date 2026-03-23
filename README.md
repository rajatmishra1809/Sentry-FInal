# 🌍 Sentry Travel Intelligence

An AI-powered travel dashboard that provides personalized insights about any city using real-time data and intelligent processing.

---

## 🚀 Overview

Sentry Travel Intelligence is a modern web application that combines multiple APIs and AI to deliver a rich, interactive travel experience. Users can search for any city and receive detailed information including weather, cultural insights, images, and AI-generated recommendations.

---

## ✨ Features

* 🔍 **City Search** – Find any city worldwide
* 🌦️ **Real-time Weather Data**
* 📖 **Wikipedia Integration** – Quick city overview
* 🖼️ **Dynamic Image Fetching**
* 🤖 **AI-Powered Insights** – Recommendations, warnings, and cultural tips
* 👤 **User Personalization** – Based on user profile
* 📊 **Compatibility Score**
* 🎨 **Modern UI (Bento Grid Layout)**

---

## 🧠 Tech Stack

### Frontend

* React (with TypeScript)
* Vite
* Tailwind CSS
* Lucide Icons

### APIs & Services

* Weather API
* Wikipedia API
* Image API (Unsplash/Pexels)
* AI Integration (for intelligence generation)

### Storage

* LocalStorage (for user profile)

---

## ⚙️ How It Works

1. User completes onboarding (profile setup)
2. User searches for a city
3. Application fetches data using multiple APIs:

   * Weather data
   * Wikipedia summary
   * City images
4. AI processes the data and generates:

   * Travel recommendations
   * Warnings
   * Cultural insights
5. Data is displayed in an interactive dashboard

---

## 🧩 Project Structure

```
components/
│── About.tsx
│── BentoGrid.tsx
│── CommandCenter.tsx
│── Contact.tsx
│── IntelBriefing.tsx
│── IntelDrawer.tsx
│── Onboarding.tsx

services/
│── apiService.ts

App.tsx
index.tsx
types.ts
```

---

## 🔥 Key Concepts Used

* Component-based architecture
* Type safety using TypeScript
* Async API handling with `async/await`
* Parallel API calls using `Promise.all`
* State management using React Hooks (`useState`, `useEffect`)

---

## 📦 Installation

```bash
# Clone the repository
git clone https://github.com/your-username/sentry-travel-intelligence.git

# Navigate into project
cd sentry-travel-intelligence

# Install dependencies
npm install

# Run the app
npm run dev
```

---

## 🌐 Future Improvements

* 🌍 Map integration (Google Maps)
* 💬 AI chat assistant for travel queries
* ❤️ Save favorite destinations
* ☁️ Backend integration for persistent storage

---

## 👨‍💻 Author

**Rajat Mishra**

---

## 📄 License

This project is for educational purposes.
