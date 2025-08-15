import React, { useState, useEffect, useRef } from "react";
import {
  collection,
  query,
  where,
  orderBy,
  onSnapshot,
  addDoc,
  serverTimestamp,
} from "firebase/firestore";
import { auth, db } from "../../firebase";
import "./conversation.css";

export default function Conversation({ selectedUser }) {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const messagesEndRef = useRef(null);

  const scrollToBottom = () =>
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  useEffect(scrollToBottom, [messages]);

  // Listen to messages
  useEffect(() => {
    if (!selectedUser || !auth.currentUser) {
      setMessages([]);
      return;
    }

    const chatId = [auth.currentUser.uid, selectedUser.uid].sort().join("_");

    const q = query(
      collection(db, "messages"),
      where("chatId", "==", chatId),
      orderBy("clientCreatedAt", "asc")
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const msgs = snapshot.docs.map((doc) => ({
        id: doc.id,
        text: doc.data().text,
        sender: doc.data().sender,
        createdAt: doc.data().clientCreatedAt?.toDate() || new Date(),
        fade: false,
      }));
      setMessages(msgs);
    });

    return () => unsubscribe();
  }, [selectedUser]);

  // Remove messages from UI after 2 minutes with fade (check every 2 seconds)
  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      setMessages((prev) =>
        prev.map((msg) =>
          now - msg.createdAt >= 2 * 60 * 1000 ? { ...msg, fade: true } : msg
        )
      );
    }, 2000); // check every 2 seconds
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    // actually remove faded messages after 1s fade
    const timer = setTimeout(() => {
      setMessages((prev) => prev.filter((msg) => !msg.fade));
    }, 1000);
    return () => clearTimeout(timer);
  }, [messages]);

  const handleSend = async () => {
    if (!selectedUser || newMessage.trim() === "") return;

    const chatId = [auth.currentUser.uid, selectedUser.uid].sort().join("_");
    const text = newMessage;
    setNewMessage("");

    // Optimistically update UI
    setMessages((prev) => [
      ...prev,
      { id: Math.random(), text, sender: auth.currentUser.uid, createdAt: new Date(), fade: false },
    ]);

    try {
      const docRef = await addDoc(collection(db, "messages"), {
        text,
        sender: auth.currentUser.uid,
        chatId,
        clientCreatedAt: new Date(),
        createdAt: serverTimestamp(),
      });
      console.log("Message successfully saved in Firebase with ID:", docRef.id);
    } catch (error) {
      console.error("Error saving message to Firebase:", error);
    }
  };

  const formatTime = (date) => {
    const h = date.getHours().toString().padStart(2, "0");
    const m = date.getMinutes().toString().padStart(2, "0");
    return `${h}:${m}`;
  };

  if (!selectedUser)
    return <div className="conversation-placeholder">Select a user to start chatting</div>;

  return (
    <div className="conversation-container">
      <h3>Chat with {selectedUser.displayName || selectedUser.email}</h3>

      <div className="messages-container">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`message ${msg.sender === auth.currentUser.uid ? "sent" : "received"} ${msg.fade ? "fade-out" : ""}`}
          >
            <div>{msg.text}</div>
            <div className="timestamp">{formatTime(msg.createdAt)}</div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <div className="message-input-container">
        <input
          type="text"
          placeholder="Type a message..."
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
        />
        <button onClick={handleSend}>Send</button>
      </div>
    </div>
  );
}
