import React from "react";
import "./chatheads.css";

export default function ChatHeads({ items, setreceiver }) {
  console.log("Users list in ChatHeads:", items);

  if (!items || items.length === 0) {
    return <p style={{ padding: "10px" }}>No users available</p>;
  }

  return (
    <div className="chat-heads-container">
      <p className="sidebar-title">Users</p>

      {items.map((obj, i) => (
        <div
          key={i}
          className="chat-head-item"
          onClick={() => setreceiver(obj)}
        >
          <div className="user-profile-pic">
            <p className="user-profile-pic-text">
              {obj.email ? obj.email[0].toUpperCase() : "?"}
            </p>
          </div>
          <p className="username" title={obj.email}>{obj.email}</p>
        </div>
      ))}
    </div>
  );
}
