import express from "express"
import axios from "axios"
import * as dotenv from "dotenv"
import cors from "cors"
import {spawn} from "child_process"
import WebSocket from 'ws';
dotenv.config()
const app = express()
app.use(express.json())
app.use(cors())
const PORT = process.env.PORT || 5000
var corsOptions = {
    origin: process.env.FRONTEND_URL,
    optionsSuccessStatus: 200 
  }


 

app.post("/test-connection", cors(corsOptions), async (req, res) => {
  const { connection, config } = req.body;
  
  if (!connection) {
    return res.status(400).json({ error: "Connection details required" });
  }

  try {
    const connectionType = connection.type;
    const deploymentUrl = connection.deploymentUrl;
    const stdioFunction = connection.stdioFunction
    
    // Test based on connection type
    if (connectionType === "ws") {
      // Test WebSocket connection
      const testResult = await testWebSocketConnection(deploymentUrl, config);
      return res.json({
        success: testResult.success,
        message: testResult.message,
        details: testResult.details
      });
    } 


    // else if (connectionType === "http" || connectionType === "https") {
    //   // Test HTTP/HTTPS connection
    //   const testResult = await testHttpConnection(deploymentUrl, config);
    //   return res.json({
    //     success: testResult.success,
    //     message: testResult.message,
    //     details: testResult.details
    //   });
    // }
    else if (connectionType==="stdio"){
      const testResult = await testStdioConnection(stdioFunction)
      return res.json({
        success:testResult.success,
        message:testResult.message,
        details:testResult.details

      })
    }
    
    else {
      return res.json({
        success: false,
        message: `Unsupported connection type: ${connectionType}`,
        details: null
      });
    }
  } catch (error) {
    console.error("Connection test error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to test connection",
      details: error.message
    });
  }
});

// Helper function to test WebSocket connections
async function testWebSocketConnection(url, config) {
  return new Promise((resolve) => {
    try {
      // Add timeout for connection attempts
      const timeout = setTimeout(() => {
        resolve({
          success: false,
          message: "Connection timed out",
          details: "WebSocket connection attempt exceeded timeout period"
        });
      }, 5000); // 5 second timeout
      
      const ws = new WebSocket(url);
      
      ws.on('open', () => {
        clearTimeout(timeout);
        // Send a simple ping message if needed
        try {
          if (config) {
            ws.send(JSON.stringify({ type: "ping", config }));
          } else {
            ws.send(JSON.stringify({ type: "ping" }));
          }
        } catch (err) {
          // It's ok if we can't send - at least we connected
        }
        
        ws.close();
        resolve({
          success: true,
          message: "WebSocket connection successful",
          details: { url, status: "Connected" }
        });
      });
      
      ws.on('error', (error) => {
        clearTimeout(timeout);
        resolve({
          success: false,
          message: "WebSocket connection failed",
          details: error.message
        });
      });
    } catch (error) {
      resolve({
        success: false,
        message: "WebSocket connection failed",
        details: error.message
      });
    }
  });
}



async function testStdioConnection(stdioFunction) {
  return new Promise((resolve) => {
    try {
      // Call the stdio function to get the actual command and args
      const result = stdioFunction({});
      const { command, args } = result;

      if (!command || !args || !Array.isArray(args)) {
        resolve({
          success: false,
          message: "Invalid stdioFunction return value",
          details: result
        });
        return;
      }

      // Execute the command
      const childProcess = spawn(command, args);
      let dataReceived = false;

      const timeout = setTimeout(() => {
        childProcess.kill();
        resolve({
          success: dataReceived,
          message: dataReceived ? "Process started but timed out" : "Process failed to start",
          details: "Command execution exceeded timeout period"
        });
      }, 5000);

      childProcess.stdout.on('data', (data) => {
        dataReceived = true;
        clearTimeout(timeout);
        childProcess.kill();
        resolve({
          success: true,
          message: "Process started successfully",
          details: `Output: ${data.toString().substring(0, 100)}...`
        });
      });

      childProcess.on('error', (error) => {
        clearTimeout(timeout);
        resolve({
          success: false,
          message: "Failed to start process",
          details: error.message
        });
      });

    } catch (error) {
      resolve({
        success: false,
        message: "Failed to test stdio connection",
        details: error.message
      });
    }
  });
}

// Helper function to test HTTP connections
// async function testHttpConnection(url, config) {
//   try {
//     // Add headers if provided in config
//     const headers = config?.headers || {};
    
//     const response = await axios.get(url, { 
//       headers,
//       timeout: 5000 // 5 second timeout
//     });
    
//     return {
//       success: true,
//       message: "HTTP connection successful",
//       details: {
//         status: response.status,
//         statusText: response.statusText,
//         headers: response.headers
//       }
//     };
//   } catch (error) {
//     return {
//       success: false,
//       message: "HTTP connection failed",
//       details: error.response?.data || error.message
//     };
//   }
// }


   
app.post("/",cors(corsOptions),async (req,res) => {
    const {installationCode} = req.body
    if(!installationCode){
        return res.status(400).json({error:"Installation code is Required"})

    }

    try {
        const MCP_URL = `https://registry.smithery.ai/servers/${installationCode}`;
        const response = await axios.get(MCP_URL, { headers: { Accept: "application/json" } });

    
        console.log("Full API Response:", response.data); // Debugging
    
        res.json({
            success: true,
            message: "MCP Server is reachable",
            data: response.data, 
        });
    } catch (error) {
        console.error("Error details:", error.response?.data || error.message);
    
        res.status(500).json({
            success: false,
            error: "Failed to connect to MCP server",
            details: error.response?.data || error.message,
        });
    }
    
})

app.listen(PORT,()=>console.log(`Server is running on ${PORT}`))