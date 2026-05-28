WebChat — Frontend-only demo

This workspace contains a minimal React + Vite frontend implementing:

- Register / Login (stored in localStorage)
- Home, Friends, Groups pages
- Private and Group chat UI (messages persisted to localStorage)
- Cross-tab message sync using BroadcastChannel

Run locally:

```bash
npm install
npm run dev
```

Notes:

- This is a frontend-only demo; no server is required. Messages and users are stored in `localStorage`.
- To test cross-tab chat, open the app in two browser tabs — BroadcastChannel will sync messages between them.
- You can later integrate a backend (socket.io or REST) by replacing `services/broadcast.js` with socket.io-client usage and persisting messages to a server.
