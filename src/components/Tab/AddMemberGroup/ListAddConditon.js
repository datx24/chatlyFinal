import React, { useState, useEffect } from "react";
import styled from 'styled-components';
import { db } from "../../lib/firebaseConfig";
import { collection, getDocs, doc, getDoc } from 'firebase/firestore';

const ListAddStyled = styled.div`
    font-family: "Roboto", sans-serif;
    color: #324B50;
    font-size: 20px;
    p {
        display: flex;
        margin: 30px 0 0 0;
        font-weight: 600;
    }
    ul {
        padding: 0;
        margin: 0;
        height: 340px;
        overflow-y: auto;
    }
    ul li {
        list-style: none;
        display: flex;
        justify-content: space-between;
        height: 46px;
        margin: 10px 0;
        align-items: center;
    }
    .userImage img {
        height: 46px;
        border-radius: 100%;
        border: 2px solid #238C9F;
    }
    .userChoose {
        display: flex;
    }
    .userName {
        margin: 10px 13px;
    }
`;

function UserItem({ user }) {
    return (
        <div className="userChoose">
            <div className="userImage"><img src={user.photoURL} alt="" /></div>
            <span className="userName">{user.displayName}</span>
        </div>
    );
}

export default function ListAddConditon({ groupId, groupMembers, onSelectUsers }) {
    const [users, setUsers] = useState([]);
    const [selectedUsers, setSelectedUsers] = useState([]);
    // console.log('Members in Group: ',groupMembers);
    useEffect(() => {
        const fetchUsers = async () => {
            // Lấy danh sách người dùng từ nguồn dữ liệu của bạn
            const usersRef = collection(db, 'users');
            const querySnapshot = await getDocs(usersRef);
    
            const userList = [];
            querySnapshot.forEach((doc) => {
                
                userList.push({ id: doc.id, ...doc.data() });
            });
    
            
            var tmp = userList.filter((user) => {
                return !groupMembers.some((groupMember) => groupMember.id === user.id);
              });
                setUsers(tmp);
                 console.log('total person in system: ', users);
            }
           
        fetchUsers();
    }, [groupMembers]);

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

    return (
        <ListAddStyled>
            <p>Gợi ý</p>
            <ul>
                {users.length > 0 ? (
                    users.map(user => (
                        <li key={user.id}>
                            <UserItem
                                user={user}
                            />
                            <input
                                type="checkbox"
                                checked={selectedUsers.includes(user.id)}
                                onChange={() => toggleUserSelection(user.id)}
                            />
                        </li>
                    ))
                ) : (
                    <li>Không có người dùng</li>
                )}
            </ul>
        </ListAddStyled>
    );
}