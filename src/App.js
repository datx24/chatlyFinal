import React, { useState, useEffect } from 'react';
import List from './components/list/list';
import Chat from './components/chat/chat';
import Header from './components/header/header';
import Login from './components/login/login';
import './App.css';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './components/lib/firebaseConfig';
import { useUserStore } from './components/lib/userStore';
import { useChatStore } from './components/lib/chatStore';
import MyInfor from './components/thongTinNhom-TrangCaNhan/MyInfor';
import UserList from './components/Tab/UserList';

const App = () => {
  const [isLoading, setIsLoading] = useState(true);
  const { currentUser, fetchUserInfo } = useUserStore();
  const { chatId } = useChatStore();
  const [showMyInfo, setShowMyInfo] = useState(false);

  const handleSignIn = () => {
    console.log('User signed in!');
  };

  useEffect(() => {
    const unSub = onAuthStateChanged(auth, (user) => {
      if (user) {
        fetchUserInfo(user.uid);
      } else {
        fetchUserInfo(null);
      }
      setIsLoading(false);
    });

    return () => {
      unSub();
    };
  }, [auth, fetchUserInfo]);

  if (isLoading) {
    return (
      <div className="loading-container">
        <div className="loading"></div>
      </div>
    );
  }

  const handleHideMyInfo = () => {
    setShowMyInfo(false);
  };

  const handleShowMyInfo = () => {
    setShowMyInfo(true);
  };

  if (!currentUser) {
    return (
      <div className="container">
        <Login onSignIn={handleSignIn} /> {/* Removed setUser */}
      </div>
    );
  }

  return (
    <div>
      <Header />
      <div className="container">
        <List />
        {chatId && <Chat />}
        {/* <UserList /> */}
        {/* <button onClick={handleShowMyInfo}>MyInfor</button>
        {showMyInfo && <MyInfor onHide={handleHideMyInfo} />} */}
      </div>
    </div>
  );
};

export default App;
