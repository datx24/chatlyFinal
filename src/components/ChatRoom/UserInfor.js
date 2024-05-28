import { Avatar, Button, Typography } from 'antd';
import React,{useState, useEffect} from 'react';
import styled from 'styled-components';
import { signOut,onAuthStateChanged,getAuth } from 'firebase/auth';
import { auth } from '../lib/firebaseConfig';
const WrapperStyled = styled.div`
    display:flex;
    justify-content: space-between;
    padding: 12px 16px;
    border-bottom: 1px solid rgba(82,38,83);

    .username{
        color: white;
        margin-left:5px;
    }
`

export default function UserInfor(){
    const [userDisplayName, setUserDisplayName] = useState('')
    const [userImgUrl, setUserImgUrl] = useState('')

    const handleLogout = async () => {
      try {
        await signOut(auth)
        localStorage.clear()
        window.location.reload()
      } catch (error) {
        console.error('Error logging out:', error)
        // Handle error properly, e.g. display an error message to the user
      }
    }

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
          if (user) {
            setUserDisplayName(user.displayName || '');
            const auth = getAuth();
            const photoURL = auth.currentUser.photoURL;
            setUserImgUrl(photoURL || '');
            
          } else {
            setUserDisplayName('');
            setUserImgUrl('');
          }
        });
        return () => {
          unsubscribe();
        }
      }, [auth]);

      console.log("Tên người dùng: ", userDisplayName);
      console.log("Ảnh người dùng: ", userImgUrl);
    return (
        < WrapperStyled>
            <div>
                <Avatar src={userImgUrl}/>
                <Typography.Text className='username'>{userDisplayName}</Typography.Text>
            </div>
            <Button onClick={handleLogout} ghost>Đăng Xuất</Button>
        </ WrapperStyled>
    )
}