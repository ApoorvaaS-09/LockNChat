import React, { useState } from "react";
import Navbar from "./components/navbar/Navbar";
import Sidebar from "./components/sidebar/Sidebar";
import Conversation from "./components/conversation/Conversation";

import "./App.css";

export default function App() {
  const [selectedUser, setSelectedUser] = useState(null);

  return (
    <div className="app-container">
      {/* Top Navbar */}
      <Navbar />

      <div className="main-content">
        {/* Sidebar */}
        <div className="sidebar-container">
          <Sidebar onSelectUser={setSelectedUser} />
        </div>

        {/* Chat Area */}
        <div className="chat-screen">
          <Conversation selectedUser={selectedUser} />
        </div>
      </div>
    </div>
  );
}
