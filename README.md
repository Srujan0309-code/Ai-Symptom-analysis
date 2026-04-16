# 
This is under development i want to add some more feature for user clarity,
MediRoute AI — Full-Stack AI Healthcare Triage

MediRoute AI is a production-ready web application designed for intelligent symptom triage and clinical routing. Built with a premium "Glassmorphism" aesthetic, it combines real-time AI analysis with map-based hospital routing.

## 🚀 Features
- **🧠 AI Symptom Analyzer**: Natural language processing to determine urgency (Claude API).
- **🎤 Voice Input**: Hands-free symptom description with live waveform visualization.
- **🗺️ Smart Doctor Routing**: Automatically routes to the correct specialist at nearby clinics.
- **📊 Health Dashboard**: Tracks symptom history and risk trends using Recharts.
- **🚨 Emergency Mode**: High-priority UI triggers for life-threatening symptoms.
- **🌐 Multilingual Support**: English and Hindi support for broader accessibility.

## 🛠️ Tech Stack
- **Frontend**: Next.js 14, Tailwind CSS, Framer Motion, Lucide React, Recharts.
- **Backend**: Node.js, Express, @anthropic-ai/sdk.
- **Database**: Supabase (PostgreSQL) with mock fallbacks for instant testing.
- **AI**: Claude 3 (Anthropic) for clinical triage logic.

## 📦 Installation & Setup

### 1. Backend Setup
```bash
cd backend
npm install
cp .env.example .env
# Add your ANTHROPIC_API_KEY to .env
npm run dev # or node index.js
```

### 2. Frontend Setup
```bash
cd frontend
npm install
cp .env.local.example .env.local
# Add your config to .env.local
npm run dev
```

## 🧪 Testing the App
1. **Low Urgency**: "I have a slight headache and a scratchy throat."
2. **Medium Urgency**: "My stomach has been hurting sharply for two days."
