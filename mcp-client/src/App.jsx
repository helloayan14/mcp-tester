
import { useState } from "react";
import axios from "axios";
import React from "react";

export default function App() {
  const [installationCode, setInstallationCode] = useState("");
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState("");
  const [testResults, setTestResults] = useState({});
  const [configValues, setConfigValues] = useState({});
  const [testingConnection, setTestingConnection] = useState(false);

  const fetchMCPServer = async () => {
    if (!installationCode.trim()) return;
    setLoading(true);
    setError(null);
    setData(null);
    setTestResults({});

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}`,
        { installationCode },
        { headers: { "Content-Type": "application/json" } }
      );

      if (response.data.success) {
        setData(response.data.data);
        setMessage(response.data.message);

        const initialConfigs = {};
        response.data.data.connections.forEach((conn, index) => {
          if (conn.configSchema?.properties) {
            initialConfigs[index] = {};
            Object.keys(conn.configSchema.properties).forEach(propKey => {
              initialConfigs[index][propKey] = "";
            });
          }
        });
        setConfigValues(initialConfigs);
        
      } else {
        setError("Invalid installation code or server not found.");
      }
    } catch (err) {
      setError("Failed to fetch server details. Please check the installation code.");
    } finally {
      setLoading(false);
    }
  };

  const handleConfigChange = (connIndex, propKey, value) => {
    setConfigValues(prev => ({
      ...prev,
      [connIndex]: {
        ...prev[connIndex],
        [propKey]: value
      }
    }));
  };

  const testConnection = async (connection, index) => {
    setTestingConnection(true);
    
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/test-connection`,
        { 
          connection,
          config: configValues[index] 
        },
        { headers: { "Content-Type": "application/json" } }
      );
      
      setTestResults(prev => ({
        ...prev,
        [index]: response.data
      }));
      
    } catch (err) {
      setTestResults(prev => ({
        ...prev,
        [index]: {
          success: false,
          message: "Test request failed",
          details: err.message
        }
      }));
    } finally {
      setTestingConnection(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-blue-200 p-6">
      <div className="w-full max-w-2xl bg-white dark:bg-gray-800 shadow-lg shadow-gray-500 rounded-lg p-6">
        <h1 className="text-2xl font-bold text-center text-white mb-4">MCP Server Tester</h1>

        {/* Input Section */}
        <div className="flex space-x-2">
          <input
            type="text"
            placeholder="Enter Installation Code"
            className="w-full p-2 border rounded-lg text-white dark:bg-gray-700 dark:border-gray-600"
            value={installationCode}
            onChange={(e) => setInstallationCode(e.target.value)}
          />
          <button
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition cursor-pointer"
            onClick={fetchMCPServer}
            disabled={loading}
          >
            {loading ? "Checking..." : "Test"}
          </button>
        </div>

        {/* Loading State */}
        {loading && <p className="mt-4 text-center text-gray-600">Checking MCP server...</p>}

        {/* Error State */}
        {error && <p className="mt-4 text-red-500">{error}</p>}

        {/* Server Details Display */}
        {data && (
          <div className="mt-6 p-4 bg-gray-200 rounded-lg">
            <h2 className="text-lg font-semibold">Server Details</h2>
            <p className="text-green-700"><strong className="text-black">Status of server:</strong> {message}</p>
            <p><strong>Name:</strong> {data.displayName}</p>
            <p><strong>Qualified Name:</strong> {data.qualifiedName}</p>
            <p><strong>Remote:</strong> {data.remote ? "Yes" : "No"}</p>

            <h3 className="mt-4 text-md font-semibold">Connections</h3>
            <ul className="mt-2 space-y-4">
            {data.connections.map((conn, index) => (
  <li key={index} className="p-3 bg-white rounded-lg shadow">
    <p><strong>Type:</strong> {conn.type}</p>
    
    {/* For WebSocket connections */}
    {conn.type === "ws" && conn.deploymentUrl && (
      <>
        <p>
          <strong>URL:</strong> 
          <span className="text-blue-500 ml-1">{conn.deploymentUrl}</span>
        </p>
        <div className="mt-3">
          <button
            className="bg-green-600 text-white px-3 py-1 text-sm rounded hover:bg-green-700 transition"
            onClick={() => testConnection(conn, index)}
            disabled={testingConnection}
          >
            {testingConnection ? "Testing..." : "Test Connection"}
          </button>
        </div>
      </>
    )}
    
    {/* For stdio connections */}
    {conn.type === "stdio" && conn.stdioFunction && (
      <>
        <p><strong>Command:</strong></p>
        <pre className="bg-gray-100 p-2 rounded text-sm overflow-auto">
          {conn.stdioFunction.includes('npx') 
            ? 'npx -y @modelcontextprotocol/server-sequential-thinking'
            : 'docker run --rm -i mcp/sequentialthinking'}
        </pre>
        <p className="mt-2 text-sm text-gray-600">
          <i>Note: stdio connections can only be tested by running the command locally</i>
        </p>
      </>
    )}
{/* 
{conn.type === "http" && conn.deploymentUrl && (
      <>
        <p><strong>Command:</strong></p>
        <pre className="bg-gray-100 p-2 rounded text-sm overflow-auto">
          {conn.stdioFunction.includes('npx') 
            ? 'npx -y @modelcontextprotocol/server-sequential-thinking'
            : 'docker run --rm -i mcp/sequentialthinking'}
        </pre>
        <p className="mt-2 text-sm text-gray-600">
          <i>Note: stdio connections can only be tested by running the command locally</i>
        </p>
      </>
    )} */}
    
    {/* Test Results (as before) */}
    {testResults[index] && (
      <div className={`mt-2 p-2 rounded text-sm ${testResults[index].success ? 'bg-green-100' : 'bg-red-100'}`}>
        <p className={testResults[index].success ? 'text-green-700' : 'text-red-700'}>
          <strong>Status:</strong> {testResults[index].message}
        </p>
        {testResults[index].details && (
          <p className="mt-1 text-xs overflow-auto max-h-20">
            <strong>Details:</strong> {JSON.stringify(testResults[index].details, null, 2)}
          </p>
        )}
      </div>
    )}
  </li>
))}
            </ul>

            {/* JSON Response */}
            <div className="mt-4 p-2 bg-gray-100 rounded-lg text-sm">
              <h3 className="font-semibold">Full JSON Response:</h3>
              <pre className="overflow-auto max-h-40 p-2 bg-gray-300 rounded">{JSON.stringify(data, null, 2)}</pre>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}