import React, { useEffect, useState } from "react";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "../../firebase";

export default function TestSidebar() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const unsub = onSnapshot(collection(db, "users"), (snapshot) => {
      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      console.log("All users in Firestore:", data);
      setUsers(data);
    });

    return () => unsub();
  }, []);

  return (
    <div className="sidebar">
      <h2>All Users (Test)</h2>
      {users.length === 0 ? (
        <p>No users found in Firestore</p>
      ) : (
        <ul>
          {users.map((user) => (
            <li key={user.id}>
              {user.displayName || user.email || "(no name)"} — UID: {user.uid}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
