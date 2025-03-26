import express from "express"
import axios from "axios"
import * as dotenv from "dotenv"
import cors from "cors"
dotenv.config()
const app = express()
app.use(express.json())
app.use(cors())
const PORT = process.env.PORT || 5000
var corsOptions = {
    origin: process.env.FRONTEND_URL,
    optionsSuccessStatus: 200 
  }
   
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