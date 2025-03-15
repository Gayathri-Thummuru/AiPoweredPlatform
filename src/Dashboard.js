import React, { useState, useEffect } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "./firebaseConfig";
import { useNavigate } from "react-router-dom";
import { FaBell, FaUserCircle, FaSignOutAlt, FaTasks, FaComments, FaChartLine, FaCog } from "react-icons/fa";
import io from "socket.io-client"; // Import Socket.IO client

const socket = io("http://localhost:5000"); // Connect to your backend server

const Dashboard = () => {
  const [user] = useAuthState(auth);
  const navigate = useNavigate();
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);

  // Handle logout
  const handleLogout = async () => {
    await auth.signOut();
    navigate("/login");
  };

  // Listen for incoming messages
  useEffect(() => {
    socket.on("receiveMessage", (message) => {
      setMessages((prevMessages) => [...prevMessages, message]);
    });

    // Cleanup on unmount
    return () => {
      socket.off("receiveMessage");
    };
  }, []);

  // Send a message
  const sendMessage = () => {
    if (message.trim()) {
      const messageData = {
        text: message,
        sender: user?.displayName || user?.email,
        timestamp: new Date().toLocaleTimeString(),
      };
      socket.emit("sendMessage", messageData); // Send message to the server
      setMessage(""); // Clear the input field
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="bg-white w-64 p-4 shadow-md">
        <h2 className="text-xl font-bold mb-6">AI Collaboration</h2>
        <nav>
          <ul className="space-y-4">
            <li>
              <a href="#projects" className="flex items-center text-gray-700 hover:text-blue-500">
                <FaTasks className="mr-2" /> Projects
              </a>
            </li>
            <li>
              <a href="#chat" className="flex items-center text-gray-700 hover:text-blue-500">
                <FaComments className="mr-2" /> Chat
              </a>
            </li>
            <li>
              <a href="#analytics" className="flex items-center text-gray-700 hover:text-blue-500">
                <FaChartLine className="mr-2" /> Analytics
              </a>
            </li>
            <li>
              <a href="#settings" className="flex items-center text-gray-700 hover:text-blue-500">
                <FaCog className="mr-2" /> Settings
              </a>
            </li>
          </ul>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold">Welcome, {user?.displayName || user?.email}!</h1>
          <div className="flex items-center space-x-4">
            <button className="relative">
              <FaBell className="text-gray-700 text-xl" />
              <span className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full px-1">3</span>
            </button>
            <div className="flex items-center space-x-2">
              <FaUserCircle className="text-gray-700 text-2xl" />
              <button onClick={handleLogout} className="flex items-center text-gray-700 hover:text-red-500">
                <FaSignOutAlt className="mr-2" /> Logout
              </button>
            </div>
          </div>
        </div>

        {/* Team Collaboration - Real-Time Chat */}
        <div className="bg-white p-6 rounded-lg shadow-md mb-6">
          <h2 className="text-xl font-semibold mb-4">Team Chat</h2>
          <div className="h-48 overflow-y-auto border p-4 rounded-lg">
            {messages.map((msg, index) => (
              <div key={index} className="mb-2">
                <strong>{msg.sender}:</strong> {msg.text} <span className="text-gray-500 text-sm">{msg.timestamp}</span>
              </div>
            ))}
          </div>
          <div className="flex mt-4">
            <input
              type="text"
              placeholder="Type a message..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="w-full p-2 border rounded-lg"
            />
            <button onClick={sendMessage} className="ml-2 bg-blue-500 text-white px-4 py-2 rounded-lg">
              Send
            </button>
          </div>
        </div>

        {/* Other components (Projects, AI Features, Analytics) */}
      </div>
    </div>
  );
};

export default Dashboard;