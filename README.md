# 🚀 MCP Tester  
**A full-stack application for testing MCP servers, specifically for the Smithery AI app.**  

## 📌 Overview  
MCP Tester is a full-stack application designed to **test and validate MCP server responses** for the Smithery AI app. It provides an easy-to-use interface for sending requests and analyzing API responses.  

## 🌟 Features  
✅ **MCP Server Testing** – Send requests and analyze API responses  
✅ **Error Handling** – Robust error handling with Axios  
✅ **Optimized API Handling** – Efficient API calls with structured responses  
✅ **Environment Variables** – Properly managed in both client and server  
✅ **Deployment Ready** – Backend on **Render**, Frontend on **Vercel**  

## 🛠️ Tech Stack  
- **Frontend:** Vite + React  
- **Backend:** Express.js  
- **API Handling:** Axios  
- **Deployment:** Vercel (Frontend) & Render (Backend)  

## 🚀 Setup, Installation & Deployment (One Go)  

```bash
# 1️⃣ Clone the Repository
git clone https://github.com/helloayan14/mcp-tester.git
cd mcp-tester

# 2️⃣ Install frontend dependencies & start the client
cd mcp-client
npm install

# Create .env file inside client/
VITE_BACKEND_URL=

npm run dev

# 3️⃣ Open a new terminal, go to backend & install dependencies
cd mcp-server
npm install

# Create .env file inside server/
PORT=
FRONTEND_URL=

# Start backend server
npm start

#start frontend in dev mode
npm run dev

#deployement
🔹 Frontend: https://mcp-tester.vercel.app/
🔹 Backend: https://mcp-tester.onrender.com


