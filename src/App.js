import React, { useState, useEffect } from 'react'
import List from './components/list/list'
import Chat from './components/chat/chat'
import Header from './components/header/header'
import Login from './components/login/login'
import './App.css'
import { onAuthStateChanged } from 'firebase/auth'
import { auth } from './components/lib/firebaseConfig'
import { useUserStore } from './components/lib/userStore'
import { useChatStore } from './components/lib/chatStore'
import MyInfor from './components/thongTinNhom-TrangCaNhan/MyInfor'
import UserList from './components/Tab/UserList'
const App = () => {
  const [isLoading, setIsLoading] = useState(true); // Add loading state to display loading message
  const { currentUser, fetchUserInfo } = useUserStore();
  const {chatId} = useChatStore();
  const [user, setUser] = useState(null);
  const [showMyInfo, setShowMyInfo] = useState(false);

  const handleSignIn = () => {
    // Redirect to the main page or update the state of the app
    console.log('User signed in!');
  };

  useEffect(() => {
    const unSub = onAuthStateChanged(auth, (user) => {
      if (user) {
        fetchUserInfo(user?.uid)
      } else {
        // Clear user info when user logs out
        fetchUserInfo(null)
      }
      setIsLoading(false) // After checking, turn off isLoading
    })

    return () => {
      unSub()
    }
  }, [fetchUserInfo])

  if (isLoading) return <div className="loading-container">
  <div className="loading"></div>
  </div>

  const handleHideMyInfo = () => {
    setShowMyInfo(false);
  };

  const handleShowMyInfo = () => {
    setShowMyInfo(true);
  };

  // If user is not logged in, display login page
  if (!currentUser) {
    return (
      <div>
        <div className="container">
          <Login setUser={setUser} onSignIn={handleSignIn}  /> {/* Pass setUser function to Login to update user */}
        </div>
      </div>
    )
  }

  // If user is logged in, display List and Chat
  return (
    <div>
      <Header />
      <div className="container">
        <List />
        {chatId && <Chat />}

        {/* <UserList/> */}
        {/* <button onClick={handleShowMyInfo}>MyInfor</button>
        {showMyInfo? (<MyInfor onHide = {handleHideMyInfo} onShow = {handleShowMyInfo}/>) : null} */}

      </div>
      {/* <ChatRom/> */}
      
    </div>
  )
}

export default App;