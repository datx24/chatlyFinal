import React, { useState, useEffect, useRef, useContext } from 'react';
import { doc, getDoc, onSnapshot, updateDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../lib/firebaseConfig';
import { useUserStore } from '../../lib/userStore';
import { useChatStore } from '../../lib/chatStore';
import { formatDistanceToNow, differenceInSeconds } from 'date-fns';
import vi from 'date-fns/locale/vi';
import '../chatList/chatList.css';
import { useSearch } from '../../lib/searchContext'; // Import SearchContext
import Chat from '../../chat/chat';
import RoomList from '../../ChatRoom/RoomList'
import { IsUserContext } from '../../lib/IsUserContext';
export const isChatVisible = true; 
export const toggleChatVisibility = () => {};
// Export hàm unblockUser để sử dụng bên ngoài
export const unblockUser = async (userId) => {
  try {
    // Thực hiện các thao tác cần thiết để gỡ chặn người dùng
    console.log(`User ${userId} has been unblocked.`);
  } catch (error) {
    console.error('Error unblocking user:', error);
    throw error; // Ném ra lỗi nếu có lỗi xảy ra trong quá trình gỡ chặn người dùng
  }
};
const ChatList = () => {
  const {  setIsUser} = useContext(IsUserContext);
  const { filteredUsers } = useSearch(); // Use SearchContext
  const [selectedUser, setSelectedUser] = useState(null);
  const [isBackdropVisible, setIsBackdropVisible] = useState(false);
  const { currentUser, isLoading } = useUserStore();
  const { changeChat } = useChatStore();
  const backdropRef = useRef(null);
  const [isPageVisible, setIsPageVisible] = useState(true);
  const [chats, setChats] = useState([]);
  const [isChatVisible, setIsChatVisible] = useState(true);
  // Define isUserBlocked state and handleUnblockUser function
  const [isUserBlocked, setIsUserBlocked] = useState(false);
  const [showBlockMessage, setShowBlockMessage] = useState(false);
  const {blockUser, unblockUser, listenBlockedUsers } = useChatStore(); // Destructure the required functions from useChatStore

  const toggleChatVisibility = () => {
    setIsChatVisible((prev) => !prev);
  };

  useEffect(() => {
    if (isLoading || !currentUser?.id) return;

    const unSub = onSnapshot(doc(db, 'usersChat', currentUser.id), async (res) => {
      const items = res.data().chats;

      const promises = items.map(async (item) => {
        const receiverId = item.receiverId === currentUser.id ? item.chatId.split('_')[0] : item.receiverId;
        const userDocRef = doc(db, 'users', receiverId);
        const userDocSnap = await getDoc(userDocRef);
        const user = userDocSnap.data();

        if (user) {
          return { ...item, user };
        } else {
          console.error('User data is not available for chat', item);
          return null;
        }
      });

      const chatData = await Promise.all(promises);

      const uniqueReceiverIds = new Set();
      const filteredChats = chatData.filter(chat => {
        if (uniqueReceiverIds.has(chat.user.id)) {
          return false;
        } else {
          uniqueReceiverIds.add(chat.user.id);
          return true;
        }
      });

      setChats(filteredChats);
    });

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        setIsPageVisible(true);
      } else {
        setIsPageVisible(false);
        if (currentUser) {
          updateLastActive(currentUser.id, false); // Cập nhật trạng thái offline
        }
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      unSub();
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [currentUser, isLoading]);

  const calculateTimeAgo = (timestamp) => {
    if (timestamp && typeof timestamp.toDate === 'function') {
      const now = new Date();
      const difference = differenceInSeconds(now, new Date(timestamp.toDate())); 
      if (difference < 60) {
        return `${difference} giây trước`;
      } else {
        const timeAgo = formatDistanceToNow(new Date(timestamp.toDate()), { locale: vi, addSuffix: true });
        return timeAgo;
      }
    } else {
      console.error('Thời gian không hợp lệ:', timestamp);
      return 'Thời gian không hợp lệ';
    }
  };

  const handleAvatarClick = async (chat) => {
    setIsUser(false);
    if (chat && chat.user) {
      setSelectedUser(chat.user);
      changeChat(chat.chatId, chat.user);
      setIsBackdropVisible(true);
      await updateLastActive(chat.user.id); // Sử dụng await để đợi hàm updateLastActive hoàn thành
    } else {
      console.error('User data is not available for chat', chat);
    }
  };

  const updateLastActive = async (userId, isActive = true) => {
    const userDocRef = doc(db, 'users', userId);
    try {
      await updateDoc(userDocRef, {
        lastActive: serverTimestamp(),
        isActive: isActive
      });
      console.log(`Đã cập nhật lastActive và trạng thái hoạt động cho người dùng ${userId}`);
    } catch (error) {
      console.error('Lỗi khi cập nhật lastActive và trạng thái hoạt động:', error);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (backdropRef.current && !backdropRef.current.contains(event.target)) {
        setIsBackdropVisible(false);
      }
    };

    if (isBackdropVisible) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isBackdropVisible]);

  const handleBlockUser = async (userId) => {
    try {
      // Cập nhật trạng thái chặn trong cơ sở dữ liệu
      await blockUser(userId);
      // Cập nhật trạng thái chặn ngay lập tức trên giao diện người dùng
      setIsUserBlocked(true);
      setShowBlockMessage(true);
      setIsBackdropVisible(false);
    } catch (error) {
      console.error('Error blocking user:', error);
    }
  };
  
  const handleUnblockUser = async (userId) => {
    try {
      // Gỡ chặn người dùng trong cơ sở dữ liệu
      await unblockUser(userId);
      // Cập nhật trạng thái gỡ chặn ngay lập tức trên giao diện người dùng
      setIsUserBlocked(false);
      setIsBackdropVisible(false);
    } catch (error) {
      console.error('Error unblocking user:', error);
    }
  };
  

  const checkIfUserBlocked = (userId) => {
    try {
      const chatStoreState = useChatStore.getState();
      if (chatStoreState && chatStoreState.blockedUsers && Array.isArray(chatStoreState.blockedUsers)) {
        const userIsBlocked = chatStoreState.blockedUsers.includes(userId);
        setIsUserBlocked(userIsBlocked);
      } else {
        setIsUserBlocked(false);
      }
    } catch (error) {
      console.error('Error checking if user is blocked:', error);
    }
  };
  
  
  

  // Gọi hàm kiểm tra khi component được tải lên
  useEffect(() => {
    checkIfUserBlocked(selectedUser?.id);
  }, [selectedUser]);


  useEffect(() => {
    if (selectedUser && selectedUser.id) {
      checkIfUserBlocked(selectedUser.id);
    }
  }, [selectedUser]);
  
  useEffect(() => {
    const unSubBlockedUsers = useChatStore.getState().listenBlockedUsers();
  
    return () => unSubBlockedUsers();
  }, []);
  
  useEffect(() => {
    if (!currentUser?.id) return;
  
    const unSubBlockedUser = onSnapshot(doc(db, 'users', currentUser.id), (doc) => {
      const userData = doc.data();
      if (userData && userData.blocked) {
        setIsUserBlocked(userData.blocked.includes(selectedUser?.id));
      }
    });
  
    return unSubBlockedUser;
  }, [currentUser, selectedUser]);
  

  return (
    <div className='chatList'>
      <RoomList/>
      {filteredUsers.map((chat) => (
        <div key={chat.chatId}>
          {chat.user ? (
            <div className='body2-child-1' onClick={() => handleAvatarClick(chat)}>
              <div className='body2-child-1-left1'>
                <div className='logo-body2'>
                  <img src={chat.user.photoURL} alt="User Avatar" />
                  <div className={`dot ${chat.user.isActive && isPageVisible ? 'red' : 'green'}`}></div>
                </div>
              </div>
              <div className='body2-child-1-left2'>
                <span>{chat.user.displayName}</span><br />
                <p>{chat.lastMessage} - {calculateTimeAgo(chat.createdAt)}</p>
              </div>
            </div>
          ) : null}
        </div>
      ))}
      {isBackdropVisible && selectedUser && (
  <div className="moon-backdrop" ref={backdropRef}>
    <div className="moon-content">
    {!isUserBlocked && (
  <button onClick={() => handleBlockUser(selectedUser.id)}>Chặn</button>
)}
{isUserBlocked && (
  <button onClick={() => handleUnblockUser(selectedUser.id)}>Gỡ chặn</button>
)}
    </div>
  </div>
)}
     
    </div>
  );
};

export default ChatList;
