import React, { useState, useEffect } from 'react';
import { db, auth } from '../lib/firebaseConfig';
import { getFirestore, collection, query, where, getDocs, getDoc } from 'firebase/firestore';
import OtherUser from './OtherUser/OtherUser';
import { ref } from 'firebase/storage';
import { get } from 'firebase/database';

const UserList = ({ currentUser }) => {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  useEffect(() => {
    // Truy vấn Firestore để lấy danh sách người dùng
    const fetchUsers = async () => {
        const usersRef = collection(db, 'users');
        const snapshot = await getDocs(usersRef);
        const users = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setUsers(users);
    };

    fetchUsers();
}, []);

  const handleUserClick = (user) => {
    setSelectedUser(user);
  };

  return (
    <div>
      <h2>Danh sách người dùng</h2>
      <ul>
        {users.map((user) => (
          <li key={user.id} onClick={() => handleUserClick(user)}>
            {user.displayName}
          </li>
        ))}
      </ul>
      {selectedUser && (
        <div>
          <OtherUser selectedUser={selectedUser}/>
        </div>
      )}
    </div>
  );
};

export default UserList;