# TR Assessment

atm-backend/ – Node.js + Express API (login with PIN, sessions, deposit/withdraw/balance).

atm-frontend/ – React app (ATM UI with PIN screen, menu, hardware buttons, etc.)

Tested on Google Chrome. Can use keyboard for inputs (PIN, withdraw/deposit amounts, submitting/confirm etc.). Navigate by clicking the buttons on the side.

# Valid Test PINS:
  1111, 2222, 3333, 4444, 5555, 6666


# Prerequisites:

Node.js (v20+)
npm

# Running the backend:
- cd atm-backend
- npm install

start in dev mode:
- npm run dev

Backend runs by default at http://localhost:3000

# Running the front:
- cd atm-frontend
- npm install

start dev server:
- npm run dev

Frontend runs at http://localhost:5173

It expects the backend API URL in .env:
VITE_API_BASE=http://localhost:3000
