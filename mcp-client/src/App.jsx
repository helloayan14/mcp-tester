import { useState } from "react";
import axios from "axios";
import React
 from "react";

export default function App() {
  const [installationCode, setInstallationCode] = useState("");
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [message,setMessage] = useState("")

  const fetchMCPServer = async () => {
    if (!installationCode.trim()) return;
    setLoading(true);                                                                                                                                                           
    setError(null);
    setData(null);

    try {
      const response = await axios.post(
      `${import.meta.env.VITE_BACKEND_URL}`, 
        { installationCode }, 
        { headers: { "Content-Type": "application/json" } }
      );

      if (response.data.success) {
        setData(response.data.data);
        setMessage(response.data.message)

      } else {
        setError("Invalid installation code or server not found.");
        
      }
    } catch (err) {
      setError("Failed to fetch server details. Please check the installation code.");
    } finally {
      setLoading(false);
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
          <div className="mt-6 p-4 bg-gray-200  rounded-lg">
            <h2 className="text-lg font-semibold">Server Details</h2>
            <p className="text-green-700"><strong className="text-black">Status of server:</strong> {message}</p>
            <p><strong>Name:</strong> {data.displayName}</p>
            <p><strong>Qualified Name:</strong> {data.qualifiedName}</p>
            <p><strong>Remote:</strong> {data.remote ? "Yes" : "No"}</p>

            <h3 className="mt-4 text-md font-semibold">Connections</h3>
            <ul className="mt-2 space-y-2 ">
              {data.connections.map((conn, index) => (
                <li key={index} className="p-2 bg-white rounded-lg shadow">
                  <p><strong>Type:</strong> {conn.type}</p>
                  {conn.deploymentUrl && <p><strong>URL:</strong> <a href={`https://smithery.ai/server/${installationCode}`} 
                  target="_blank"
                  className="text-blue-500 underline">{`https://smithery.ai/server/${installationCode}`} </a></p>}
                </li>
              ))}
            </ul>

            {/* JSON Response */}
            <div className="mt-4 p-2 bg-gray-100  rounded-lg text-sm">
              <h3 className="font-semibold">Full JSON Response:</h3>
              <pre className="overflow-auto max-h-40 p-2 bg-gray-300  rounded">{JSON.stringify(data, null, 2)}</pre>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}