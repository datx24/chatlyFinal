import '../userInfo/userInfo.css';
import { useState, useEffect, useRef } from 'react';
import upload from '../../lib/upload';
import { useUserStore } from '../../lib/userStore';
import { signOut, onAuthStateChanged, getAuth, updateProfile } from 'firebase/auth';
import { auth } from '../../lib/firebaseConfig';
import AddUser from '../../addUser/addUser';
import Edit from '../userInfo/edit/edit';
import { doc, getDoc, onSnapshot } from 'firebase/firestore';
import { db } from '../../lib/firebaseConfig';
import { useSearch } from '../../lib/searchContext'; // Import SearchContext
import Bell from '../../../images/bxs-bell-ring.svg.png'
import Search from '../../../images/bx-search-alt.svg.png'

const UserInfo = ({ onInputChange }) => {
  const [userDisplayName, setUserDisplayName] = useState('');
  const [userImgUrl, setUserImgUrl] = useState('');
  const { currentUser } = useUserStore();
  const [addUserMode, setAddUserMode] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [chats, setChats] = useState([]);
  const addUserRef = useRef(null);
  const { searchQuery, setSearchQuery, setFilteredUsers } = useSearch(); // Use SearchContext
  const [addUserVisible, setAddUserVisible] = useState(false); // State để kiểm soát việc hiển thị giao diện AddUser

  const toggleAddUser = () => {
    setAddUserVisible(prev => !prev);
  };

  const updateChats = (newChat) => {
    setChats(prevChats => [...prevChats, newChat]);
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUserDisplayName(user.displayName || '');
        const photoURL = user.photoURL;
        setUserImgUrl(photoURL || '');
      } else {
        setUserDisplayName('');
        setUserImgUrl('');
      }
    });
    return () => {
      unsubscribe();
    };
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (addUserRef.current && !addUserRef.current.contains(event.target)) {
        setAddUserMode(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  useEffect(() => {
    if (currentUser?.id) {
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
        setFilteredUsers(filteredChats); // Initialize filtered users with all chats
      });

      return () => {
        unSub();
      };
    }
  }, [currentUser, setFilteredUsers]);

  const handleImageUpload = async (file) => {
    try {
      const url = await upload(file);
      setUserImgUrl(url);
      localStorage.setItem('userImageUrl', url);
      const auth = getAuth();
      if (auth.currentUser) {
        await updateProfile(auth.currentUser, { photoURL: url });
      }
    } catch (error) {
      console.error('Error uploading image:', error);
    }
  };

  const handleFileInputChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      handleImageUpload(file);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      localStorage.clear();
      window.location.reload();
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  const handleAddUserClick = () => {
    setAddUserMode(!addUserMode);
  };

  const handleEditClick = () => {
    setIsEditing(!isEditing);
  };

  const handleInputChange = (event) => {
    const value = event.target.value;
    setSearchQuery(value);
    filterUsers(value); // Directly call filterUsers to update the list
  };

  const filterUsers = (searchQuery) => {
    const filteredUsers = chats.filter((chat) =>
      chat.user.displayName.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredUsers(filteredUsers); // Update state with filtered users
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (addUserRef.current && !addUserRef.current.contains(event.target)) {
        setAddUserVisible(false); // Ẩn giao diện AddUser nếu click bên ngoài
      }
    };
  
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [addUserRef]);

  return (
    <div className='userInfo'>
      <div className='user-information'>
        <div className="user-information-1">
          <div className='user-image'>
            <input
              id="fileInput"
              type="file"
              accept="image/*"
              onChange={handleFileInputChange}
              style={{ display: 'none' }}
            />
            <div className='user-image child' onClick={() => document.getElementById('fileInput').click()} style={{ cursor: 'pointer' }}>
              {userImgUrl ? (
                <img src={userImgUrl} alt="Uploaded" />
              ) : (
                <span>Add Image</span>
              )}
              <div className='user-status'></div>
            </div>
          </div>
          <div className="user-name">
            <span>{userDisplayName}</span>
            <div className="user-icon">
              <img
                className='icon-bell'
                src={Bell}
                alt="Bell Icon"
              />
              <span onClick={handleEditClick}>...</span>
              {isEditing && <Edit />}
            </div>
          </div>
        </div>
        <div className='input-wrapper' ref={addUserRef}>
          <img
            src={Search}
            alt="Search Icon"
            onClick={toggleAddUser}
          />
          {/* Hiển thị giao diện AddUser nếu state addUserVisible là true */}
        {addUserVisible && <AddUser />}
          <input 
            type="text"
            placeholder="Tìm kiếm tên, nhóm..."
            value={searchQuery}
            onChange={handleInputChange}
          />
        </div>
      </div>
    </div>
  );
};

export default UserInfo;
