# MediRoute AI — Full-Stack AI Healthcare Triage

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

## 🚀 Deployment to Render

You can easily deploy MediRoute AI to Render using Render Blueprints. The project includes a pre-configured `render.yaml` that sets up both the Express backend and the Next.js frontend automatically.

[![Deploy to Render](https://render.com/images/deploy-to-render-button.svg)](https://render.com/deploy)

### Step-by-Step Instructions:
1. **Push to GitHub**: Push your local repository to a private or public GitHub repository.
2. **Deploy via Render**:
   - Go to the [Render Dashboard](https://dashboard.render.com).
   - Click **New** (top right) and select **Blueprint**.
   - Connect your GitHub repository.
   - Render will read the `render.yaml` and prompt you to enter the environment variables.
3. **Environment Variables**:
   - **`GROQ_API_KEY`**: Your Groq API key for clinical triage (Required).
   - **`NEXT_PUBLIC_BACKEND_URL`**: The public URL of your backend. By default, it is configured to reference `https://mediroute-api.onrender.com/api`. If you customize the backend service name, update this URL accordingly.
   - **`SUPABASE_URL` & `SUPABASE_ANON_KEY`** (Optional): Supabase credentials. If not set, the application will fallback to high-fidelity mock data.
   - **`GEMINI_API_KEY`** (Optional): Gemini API key for visual symptom analysis.
   - **`FIREBASE_SERVICE_ACCOUNT`** (Optional): Firebase Admin SDK credentials in JSON format. If not set, user authentication claims will be processed in local verification fallback mode.

---

## 🧪 Testing the App
1. **Low Urgency**: "I have a slight headache and a scratchy throat."
2. **Medium Urgency**: "My stomach has been hurting sharply for two days."
3. **Emergency**: "I am experiencing severe chest pain and left arm numbness."

---
Built with ❤️ for the Future of Healthcare.

