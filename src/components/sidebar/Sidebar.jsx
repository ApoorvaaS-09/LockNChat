import React, { useState, useEffect } from "react";
import { collection, onSnapshot, query, where, orderBy } from "firebase/firestore";
import { auth, db } from "../../firebase";
import "./Sidebar.css";

export default function Sidebar({ onSelectUser }) {
  const [users, setUsers] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [selectedUserId, setSelectedUserId] = useState(null);

  // Get current logged-in user
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) setCurrentUser(user);
      else setCurrentUser(null);
    });
    return () => unsubscribe();
  }, []);

  // Fetch other users
  useEffect(() => {
    if (!currentUser) return;

    const q = query(
      collection(db, "users"),
      where("uid", "!=", currentUser.uid),
      orderBy("uid")
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const fetchedUsers = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setUsers(fetchedUsers);
    });

    return () => unsubscribe();
  }, [currentUser]);

  const handleLogout = () => {
    auth.signOut();
  };

  const handleUserClick = (user) => {
    setSelectedUserId(user.uid);
    onSelectUser(user);
  };

  return (
    <div className="sidebar">
      {currentUser && (
        <div className="sidebar-header">
          <span>{currentUser.displayName || currentUser.email}</span>
          <button onClick={handleLogout}>Logout</button>
        </div>
      )}

      <h3>Users</h3>
      <ul>
        {users.length === 0 ? (
          <li>No other users available</li>
        ) : (
          users.map((user) => (
            <li
              key={user.id}
              onClick={() => handleUserClick(user)}
              className={selectedUserId === user.uid ? "selected" : ""}
            >
              <span className="avatar">
                {user.displayName
                  ? user.displayName.charAt(0).toUpperCase()
                  : user.email.charAt(0).toUpperCase()}
              </span>
              {user.displayName || user.email}
            </li>
          ))
        )}
      </ul>
    </div>
  );
}
