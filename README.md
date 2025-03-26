# MCP Server Testing App

## Overview
The **MCP Server Testing App** allows users to verify the connectivity and functionality of an MCP (Model Context Protocol) server by providing an installation code. The application fetches server details from Smithery AI's registry and displays relevant information in a clean UI.

## Features
- Accepts MCP server installation code as input.
- Communicates with the Smithery AI registry to verify the server.
- Displays server details including name, type, and connection methods.
- Provides meaningful error messages if the installation code is invalid.
- Built with a **React frontend** and an **Express.js backend**.

## Approach

### 1. Understanding the Problem
The goal was to create an app that allows developers to test MCP servers before integration. The application needed to:
- Accept an **installation code**.
- Query the **Smithery AI registry**.
- Display **relevant details** from the API response.
- Handle **errors gracefully**.
- It has the ability to tell alll about the all mcp-server details from the smithery app

### 2. Backend Development (Express.js & Node.js)
- Created an **Express.js backend** to handle requests.
- Used `axios` to fetch MCP server details from:
  ```plaintext
  https://registry.smithery.ai/servers/{installationCode}
  ```
- Implemented **error handling** for invalid installation codes or failed API requests.
- Ensured that the **backend accepts a POST request** with JSON body input.

#### Backend Code (server.js)
```js
backend code in the  index.js file

### 3. Frontend Development (React + Tailwind CSS)
- Created a **React app** to interact with the backend.
- Used `useState` to manage input, loading states, and response data.
- Made an **API call to the backend** when the user enters an installation code.
- Styled the UI with **Tailwind CSS**.


   
```

## Installation & Setup

### Backend Setup
1. Clone the repository:
   ```sh
   git clone https://github.com/helloayan14/mcp-tester.git
   cd mcp-tester/mcp-server
   ```
2. Install dependencies:
   ```sh
   npm install
   ```
3. Start the backend server:
   ```sh
   npm run dev
   ```

### Frontend Setup
1. Navigate to the frontend directory:
   ```sh
   cd mcp-tester/mcp-client
   ```
2. Install dependencies:
   ```sh
   npm install
   ```
3. Start the frontend:
   ```sh
   npm run dev
   ```

## Deployment
- deployed on vercel 

## Conclusion
This project successfully provides a simple and effective way to test MCP servers. By leveraging **React for the frontend** and **Express.js for the backend**, the application ensures seamless communication with Smithery AI’s registry.

---

Let me know if you need any modifications! 🚀

