import React, { useState, useEffect } from 'react';
import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';
import { useUserStore } from '../lib/userStore';
import File from "../../images/Gửi file.png"
import Voice from "../../images/Gửi voice.png"
import Emoji from "../../images/Gửi emoji.png"
import Send from "../../images/Gửi tin nhắn.png"
import "../ChatRoom/ChatRoom.css"
// Initialize Firebase
const firebaseConfig = {
   apiKey: "AIzaSyC8fGaj2jFZjiMBq1rYBbHZjZjAbtmh-8M",
  authDomain: "login-e1c8b.firebaseapp.com",
  projectId: "login-e1c8b",
  storageBucket: "login-e1c8b.appspot.com",
  messagingSenderId: "55213842909",
  appId: "1:55213842909:web:36693cc182dd8bc5f0d634",
  measurementId: "G-8ZFLJB6PB1"
};

firebase.initializeApp(firebaseConfig);
const firestore = firebase.firestore();

function ChatRoom({ groupId }) {
  const { currentUser } = useUserStore();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');

  useEffect(() => {
    // Lắng nghe sự thay đổi của dữ liệu tin nhắn trong Firestore
    const unsubscribe = firestore
      .collection('Groups')
      .doc(groupId)
      .collection('messages')
      .orderBy('timestamp', 'asc')
      .onSnapshot((snapshot) => {
        const newMessages = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setMessages(newMessages);
      });

    // Dọn dẹp khi component bị unmount
    return unsubscribe;
  }, [groupId]);

  const handleSendMessage = async () => {
    if (newMessage.trim() !== '') {
      try {
        await firestore
          .collection('Groups')
          .doc(groupId)
          .collection('messages')
          .add({
            text: newMessage,
            sender: currentUser.displayName,
            senderPhotoURL: currentUser.photoURL, // Lưu URL ảnh đại diện của người dùng
            timestamp: firebase.firestore.FieldValue.serverTimestamp(),
          });
        setNewMessage('');
      } catch (error) {
        console.error('Error sending message:', error);
      }
    }
  };
  return (
    <div className="chat-container">
    <div className="chat-messages">
      {messages.map((message) => (
        <div key={message.id} className={`message ${message.sender === currentUser.displayName ? 'message-user' : 'message-other'}`}>
          <div className="message-container">
            <div className="message-user-container">
              <div className="message-header">
                
               
                {message.senderPhotoURL && (
                  <img
                    src={message.senderPhotoURL}
                    alt={message.sender}
                    className="message-avatar"
                  />
                )} 
                <div className="message-user">{message.sender}:</div>
              </div>
              <div className={`message-text ${message.sender === currentUser.displayName ? 'my-message' : ''}`}>{message.text}</div>
            </div>
          </div>
        </div>
      ))}
    </div>
    <div className="body-child-right-3" >
    <input type="file" id="file" style={{ display: "none" }}  />
    <img src={File}/>
    <img src={Voice} />
    {/* // Thêm sự kiện click vào label để kích hoạt input file */}
  </div>
    {/* <div className="chat-input"> */}
      {/* <input
        type="text"
        value={newMessage}
        onChange={(e) => setNewMessage(e.target.value)}
        onKeyPress={(e) => {
          if (e.key === 'Enter') {
            handleSendMessage();
          }
        }}
        className="chat-input-field"
      /> */}
      {/* <button className="chat-send-button">
        Send
      </button> */}
      
      <div className="body-child-right-4" style={{backgroundColor:'#fff'}}>
  <div className='input-wrapper'>
    <input type="file" id="file" style={{ display: "none" }}/>
    <input
        type="text"
        placeholder='Aa'
        value={newMessage}
        onChange={(e) => setNewMessage(e.target.value)}
        onKeyPress={(e) => {
          if (e.key === 'Enter') {
            handleSendMessage();
          }
        }}
        // className="chat-input-field"
      />
    <div className='emoji'>
      <img src={Emoji}
      />
      <div className='picker'>
       
      </div>
    </div>
    <img src={Send}
      onClick={handleSendMessage}
    />
  </div>
  </div>




      {/* //  onClick={handleSendMessage} */}
      
    </div>
  // </div>
  );
}


export default ChatRoom;