# tr-atm
TR Assessment

Prerequisites:

Node.js (v20+)
npm

Running the backend:
cd atm-backend
npm install

# start in dev mode
npm run dev

PORT=3000

cd atm-frontend
npm install
# start dev server
npm run dev

Frontend runs at http://localhost:5173
It expects the backend API URL in .env:
VITE_API_BASE=http://localhost:3000
