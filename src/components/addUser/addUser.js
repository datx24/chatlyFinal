import './addUser.css';
import { collection, query, where, serverTimestamp, doc, setDoc, updateDoc, arrayUnion, getDocs,getDoc } from 'firebase/firestore';
import { db } from '../lib/firebaseConfig';
import { useState } from 'react';
import { useUserStore } from '../lib/userStore';

const AddUser = ({ updateChats }) => {
  const [users, setUsers] = useState([]);
  const [addedUserIds, setAddedUserIds] = useState(new Set());
  const { currentUser } = useUserStore();

  const handleSearch = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const displayName = formData.get('displayName');

    try {
      const userRef = collection(db, 'users');
      const q = query(userRef, where('displayName', '==', displayName));
      const querySnapshot = await getDocs(q);

      const foundUsers = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setUsers(foundUsers);
    } catch (err) {
      console.log(err);
    }
  };

  const handleAdd = async (user) => {
    if (!user || !currentUser) {
      console.error('User or current user is not available');
      return;
    }
  
    const chatRef = collection(db, 'chats');
    const currentUserChatsRef = doc(db, 'usersChat', currentUser.id);
    const addedUserChatsRef = doc(db, 'usersChat', user.id);
  
    try {
      const currentUserChatsDoc = await getDoc(currentUserChatsRef);
      const addedUserChatsDoc = await getDoc(addedUserChatsRef);
  
      let existingChatId = null;
  
      // Check if an existing chat between the two users exists
      if (currentUserChatsDoc.exists()) {
        const currentUserChats = currentUserChatsDoc.data().chats || [];
        const existingChat = currentUserChats.find(chat => chat.receiverId === user.id);
        if (existingChat) {
          existingChatId = existingChat.chatId;
        }
      }
  
      if (!existingChatId && addedUserChatsDoc.exists()) {
        const addedUserChats = addedUserChatsDoc.data().chats || [];
        const existingChat = addedUserChats.find(chat => chat.receiverId === currentUser.id);
        if (existingChat) {
          existingChatId = existingChat.chatId;
        }
      }
  
      let chatDocRef;
      if (existingChatId) {
        chatDocRef = doc(db, 'chats', existingChatId);
        await updateDoc(chatDocRef, {
          updatedAt: serverTimestamp(),
        });
      } else {
        chatDocRef = doc(chatRef); // Create a reference to a new document with a unique ID
        await setDoc(chatDocRef, {
          createdAt: serverTimestamp(),
          messages: [],
        });
      }
  
      const currentTimestamp = new Date();
  
      // Ensure currentUser's chats document exists and update it
      if (!currentUserChatsDoc.exists()) {
        await setDoc(currentUserChatsRef, { chats: [] });
      }
      const currentUserChats = currentUserChatsDoc.exists() ? currentUserChatsDoc.data().chats || [] : [];
      if (!currentUserChats.some(chat => chat.chatId === chatDocRef.id)) {
        await updateDoc(currentUserChatsRef, {
          chats: arrayUnion({
            chatId: chatDocRef.id,
            lastMessage: '',
            receiverId: user.id,
            updatedAt: currentTimestamp,
          }),
        });
      }
  
      // Ensure addedUser's chats document exists and update it
      if (!addedUserChatsDoc.exists()) {
        await setDoc(addedUserChatsRef, { chats: [] });
      }
      const addedUserChats = addedUserChatsDoc.exists() ? addedUserChatsDoc.data().chats || [] : [];
      if (!addedUserChats.some(chat => chat.chatId === chatDocRef.id)) {
        await updateDoc(addedUserChatsRef, {
          chats: arrayUnion({
            chatId: chatDocRef.id,
            lastMessage: '',
            receiverId: currentUser.id,
            updatedAt: currentTimestamp,
          }),
        });
      }
  
      setAddedUserIds((prevIds) => new Set(prevIds).add(user.id));
  
      updateChats({
        chatId: chatDocRef.id,
        lastMessage: '',
        receiverId: user.id,
        updatedAt: currentTimestamp,
        user: user,
      });
    } catch (err) {
      console.log(err);
    }
  };
  
  

  return (
    <div className="addUser">
      <form onSubmit={handleSearch}>
        <input type="text" placeholder="Nhập tên người dùng" name="displayName" />
        <button>Search</button>
      </form>
      {users.length > 0 && (
        <div className="users">
          {users.map((user) => (
            <div className="user" key={user.id}>
              <div className="detail">
                <img src={user.photoURL} alt="User Avatar" />
                <span>{user.displayName}</span>
                <span>{user.email}</span>
              </div>
              <button onClick={() => handleAdd(user)}>Thêm</button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AddUser;
