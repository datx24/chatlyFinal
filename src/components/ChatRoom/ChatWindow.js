import React, { useContext, useState, useEffect } from 'react';
import { SelectedGroupContext } from './SelectedGroupContext';
import { HomeOutlined } from '@ant-design/icons';
import { Button } from 'antd';
import GroupInfo from '../Modals/GroupInfo';
import ChatRoom from './ChatRoom'
import { doc, onSnapshot, setDoc, arrayUnion, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../lib/firebaseConfig';
import '../ChatRoom/ChatRoom.css'
export default function ChatWindow({ groupData }) {
  const { selectedGroup } = useContext(SelectedGroupContext);
  const [isGroupInfoVisible, setIsGroupInfoVisible] = useState(false);
  const [messages, setMessages] = useState([]);

 

  const handleGroupInfoToggle = () => {
    setIsGroupInfoVisible(!isGroupInfoVisible);
  };

  return (
    <div className='chat-room' style={{ textAlign: 'right' }}>
      {/* {messages.map((message, index) => (
        <div key={index} className="chat-message">
          <div className="message-header">
            <span className="sender">{message.sender}</span>
            <span className="timestamp">
              {new Date(message.timestamp).toLocaleString()}
            </span>
          </div>
          <div className="message-content">{message.content}</div>
        </div>
      ))} */}
      {/* <h1>{selectedGroup.GroupId}</h1> */}
      {selectedGroup && <ChatRoom groupId={selectedGroup.GroupId} />}
    </div>
  );
}