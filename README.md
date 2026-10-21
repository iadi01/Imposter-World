# Imposter World 🕵️‍♂️ — Classroom Detective Multiplayer

A high-performance real-time multiplayer party word game built for cross-platform web, mobile browsers, and local pass-and-play.

## 🛠️ Technology Stack & Architecture

- **Frontend:** React 19, TanStack Start, TypeScript, Tailwind CSS v4, Lucide Icons.
- **Backend Server:** Node.js, Express 5, TypeScript (`tsx`).
- **Real-Time Relays:** Socket.IO with optional Redis pub/sub clustering for high concurrency.
- **Database:** MongoDB Atlas (Mongoose ORM) with indexed schemas for sub-5ms query resolution.
- **Authentication:** Google OAuth 2.0 (PKCE authorization code exchange) & Guest Session JWTs.
- **Security & Shielding:** Constant-time cryptographic auth checks, NoSQL query sanitization, XSS entity escaping, IP-based sliding-window rate limiters, and CSRF origin verification.

## 🚀 Getting Started

### Prerequisites
- Node.js v20+ or v22+
- npm or pnpm

### Installation
```bash
npm install
```

### Environment Setup
Create a `.env` file in the project root:
```env
MONGODB_URI=your_mongodb_connection_string
GOOGLE_CLIENT_ID=your_google_oauth_client_id
GOOGLE_CLIENT_SECRET=your_google_oauth_client_secret
GOOGLE_REDIRECT_URI=http://localhost:8080/api/auth/google/callback
PORT=4001
VITE_SERVER_URL=http://localhost:4001
VITE_SOCKET_URL=http://localhost:4001
JWT_SECRET=your_secure_jwt_secret
SESSION_SECRET=your_secure_session_secret
ADMIN_EMAIL=your_authorized_admin_email
NODE_ENV=development
```

### Running Locally
1. Start the backend server:
```bash
npm run server
```
2. In a separate terminal, start the frontend dev server:
```bash
npm run dev
```

The application will be live at `http://localhost:8080`.

## 📦 Features
- **Online Multiplayer:** Create private or public rooms with custom code invites.
- **Instant Matchmaking:** 1-click lobby queuing for instant games.
- **Local Pass & Play:** Single-device mode for group party gameplay with secret role reveals and private voting.
- **Rich Word Bank:** 4,800+ categorised bilingual (English & Hindi) word pairs.
- **Live Leaderboards:** Global, Country, State, and City rankings with instant @username handles.
- **Tournament Desk:** Live champions feed tracking top detectives.

## 🛡️ License
Private proprietary software. All rights reserved.
