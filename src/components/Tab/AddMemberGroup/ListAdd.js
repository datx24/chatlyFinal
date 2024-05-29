import React from "react";
import styled from 'styled-components'
import { useState, useEffect } from "react";
import { db } from "../../lib/firebaseConfig";
import { getFirestore, collection, getDocs } from 'firebase/firestore';

const ListAddStyled = styled.div`
    font-family: "Roboto", sans-serif;
    color: #324B50;
    font-size: 20px;
    p{
        display: flex;
        margin: 15px 0 0 0;
        font-weight: 600;
    }
    ul{
        padding: 0;
        margin: 0;
        height: 340px;
        overflow-y: auto;
    }ul li{
        list-style: none;
        display: flex;
        justify-content: space-between;
        height: 46px;
        margin-bottom: 10px;
        align-items:center;
    }
    .userImage img{
        height: 46px;
        width: 46px;
        border-radius: 100%;
        border: 2px solid #238C9F;
    }
    .userChoose{
        display: flex;
    }
    .userName{
        margin: 10px 13px;
        font-family: "Roboto", sans-serif;
        color: #324B50;
        font-size: 20px;
    }
`

function UserItem({ user }){
    return(
        <ListAddStyled>
            <div className="userChoose">
                <div className="userImage"><img src={user.photoURL} alt=""/></div>
                <span className="userName">{user.displayName}</span>
            </div>
        </ListAddStyled>
    )
}

export default function ListAdd({ onSelectUsers }){
    const [users, setUsers] = useState([]);
    const [selectedUsers, setSelectedUsers] = useState([]);
    
    useEffect(() => {
        const fetchUsers = async () => {
            const usersRef = collection(db, 'users');
            const userSnapshot = await getDocs(usersRef);
            setUsers(userSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    };

    fetchUsers();
  }, []);

  const toggleUserSelection = (userId) => {
    setSelectedUsers((prev) =>
      prev.includes(userId)
        ? prev.filter(id => id !== userId)
        : [...prev, userId]
        
    );
    
  };

  useEffect(() => {
    if (onSelectUsers) {
      onSelectUsers(selectedUsers);
    }
  }, [selectedUsers, onSelectUsers]);
    return(
        <ListAddStyled >
            <p>Gợi ý</p>
            <ul>
                {users.map(user => (
                    <li key = {user.uid}>
                        <UserItem
                            user = {user}
                        />
                        <input 
                            type="checkbox"
                            checked={selectedUsers.includes(user.id)}
                            onChange={() => toggleUserSelection(user.id)}>
                     
                        </input>
                    </li>
                ))}
            </ul>
            
        </ListAddStyled>
            
    )
}