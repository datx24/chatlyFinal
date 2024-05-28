import React from 'react';
import styled from 'styled-components';
import { Form } from 'antd';
import TabHeader from '../Tab/Components/TabHeader';
import { useState, useEffect } from 'react';
import { auth, db, storage } from '../lib/firebaseConfig';
import { getDoc, doc, setDoc } from 'firebase/firestore'; 
import upload from '../lib/upload';
import { ref } from 'firebase/storage';
const MyInforStyle = styled.div`
    width: 471px;
    height: 372px;
    border: 1px solid black;
    border-radius: 20px;
    font-family: "Roboto", sans-serif;
    font-sỉze: 20px;
    font-weight: 700;
    position: fixed;
    z-index: 500;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    background-color: white;
    p{
      cursor: default;
    }
    .userName{
      display: flex;
      align-items: center;
      padding: 15px 16px;
      position: relative;
      height: 110px;
    }
    .userImage{
      width: 91px;
      height: 91px;
      border: 2px solid #238C9F;
      border-radius: 50%;
    }
    .userName p{
      margin: 0 5px 0 15px;
      font-size: 25px;
      width: 160px;
      margin-left: 100px;
    }
    
    .userName i{
      font-size: 25px;
    }
    .userName button{
      outline: none;
      border: none;
      background-color: white;
    }
    .nameChange{
      outline: none;
      margin: 0 5px 0 15px;
      height: 20px;
      width: 160px;
      border: none;
      border-bottom: 1px solid #238C9F;
      font-family: "Roboto", sans-serif;
      font-weight: 700;
    }

    .userName::before{
      content: "";
      width: 100%;
      height: 5px;
      background-color: #DBE3E4;
      position: absolute;
      bottom: -5px;
      left: 0;
    }
    .userDetail{
      margin: 10px 16px;
    }
    .userDetail p{
      margin: 0;
      font-size: 20px;
    }
    .userDetail i{
      font-size: 20px;
    }
    .title{
      display: flex;
      align-items: center;
    }
    .title p{
      margin-right: 5px;
    }
    .title button{
      outline: none;
      border: none;
      background-color: white;
    }
    .inforDetail{
      display: flex;
      justify-content: space-between;
      margin: 5px 0;
      color: #324B50;
    }
    .inforDetail span{
      font-size: 15px;
      font-weight: 400;
    }
    .inforDetail p{
      opacity: 0.6;
    }
    .inforChange{
      outline: none;
      border: none;
      border-bottom: 1px solid #238C9F;
      width: 200px;
      text-align: right;
    }
  `



const MyInfor = ({show, handleHideMyInfor}) => {
  const [user, setUser] = useState(null);
  const [userImgUrl, setUserImgUrl] = useState('');
  const [isEditingName, setIsEditingName] = useState(false);
  const [isEditingInfor, setIsEditingInfor] = useState(false);
  const [newName, setNewName] = useState(user?.displayName);
  const [formData, setFormData] = useState({
    phoneNumber: '',
    gender: '',
    birthDay: '',
  });
  const [showMyInfo, setShowMyInfo] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      const currentUser = auth.currentUser;
      if (currentUser) {
        const userDoc = await getDoc(doc(db, 'users', currentUser.uid));
        if (userDoc.exists) {
          const userData = userDoc.data();
          setUser(userData);
          setNewName(userData.displayName || 'Chưa có');
          setFormData({
            phoneNumber: userData.phoneNumber || 'Chưa có',
            gender: userData.gender || 'Chưa có',
            birthDay: userData.birthDay || 'Chưa có',
          });
          setUserImgUrl(userData.photoURL || '');
        }
      }
    };
    fetchUserData();
  }, [])

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    const fileRef = ref(storage, `avatars/${file.name}`)
    await fileRef.put(file);
    const imageURL = await fileRef.getDownloadURL();
    setUserImgUrl(imageURL);

    // Update avatar URL in Firebase database
    const userRef = doc(db, 'users', auth.currentUser.uid);
    await setDoc(userRef, { photoURL: userImgUrl}, { merge: true });
    setUser({ ...user, photoURL: userImgUrl });
    setIsEditingName(false);
  };

  const handleEditClickName = () => {
    setIsEditingName(true);
    setNewName(user?.displayName);
  };

  const handleSaveName = async () => {
    const userRef = doc(db, 'users', auth.currentUser.uid);
    await setDoc(userRef, { displayName: newName }, { merge: true });
    setUser({ ...user, displayName: newName });
    setIsEditingName(false);
  };
    
  const handleEditClickInfor = () => {
    setIsEditingInfor(true);
  };

  const handleInputChangeInfor = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSaveInfor = async () => {
    const userRef = doc(db, 'users', auth.currentUser.uid);
    await setDoc(userRef, formData, { merge: true });
    setUser({...user, phoneNumber : formData.phoneNumber, gender: formData.gender, birthDay: formData.birthDay});
    setIsEditingInfor(false);
  };

  const handleHideMyInfo = () => {
    setShowMyInfo(false);
  };

  const handleShowMyInfo = () => {
    setShowMyInfo(true);
  };

  if(showMyInfo) return;

  return (
    <Form>
      <MyInforStyle>
        <TabHeader/>
        <div className='userName'>
          {/* <img src={user?.photoURL} alt='userImage'/> */}
          <label htmlFor="fileInput" className="custom-file-upload">
              <input
                id="fileInput"
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                style={{display: 'none', zIndex: '1' }}
              />
              {userImgUrl? (
                <img src={userImgUrl} className='userImage' alt="use-image" />
              ) : (
                <span>Add Image</span>
              )}
            </label>
          {isEditingName ? (
              <>
                <input
                  type="text"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className='nameChange'
                />
                <button onClick={handleSaveName}><i class='bx bxs-edit-alt' ></i></button>
              </>
            ) : (
              <>
                <p>{ user?.displayName }</p>
                 <button onClick={handleEditClickName}><i class='bx bxs-edit-alt' ></i></button>
              </>
            )}
        </div>
        <div className='userDetail'>
          <div className='title'>
            <p>Thông tin cá nhân</p>
            {isEditingInfor ? (
              // Nếu đang trong trạng thái chỉnh sửa thì hiện nút lưu
              <button onClick={handleSaveInfor} style={{backgroundColor: '#DBE3E4', border: '1px solid black', borderRadius: '5px', padding: '0 10px', color: '#324B50'}}>Lưu</button>
            ):(
              // Nếu không thì hiện nút để chỉnh sửa
              <button onClick={handleEditClickInfor}><i class='bx bxs-edit-alt'></i></button>
            )}
          </div>
          <div className='infor'>
            {isEditingInfor ? (
              // Nếu đang trong trạng thái chỉnh sửa thì hiện các input
            <div>
              <div className='inforDetail'>
                {/* Cập nhật giới tính */}
                  <p>Giới tính</p>
                  <div style={{display: 'flex', alignItems: 'center'}}>
                    <label  style={{margin: '0 20px 0 0', display: 'flex'}}>
                      <input
                        type="radio"
                        value="Nam"
                        name='gender'
                        checked={formData.gender === 'Nam'}
                        onChange={handleInputChangeInfor}
                      />
                      <p style={{fontSize: '15px', fontWeight: '400', color: 'black', opacity: '1', marginLeft: '5px'}}>Nam</p>
                    </label>
                    <label style={{margin: '0 20px 0 0', display: 'flex'}}>
                      <input
                        type="radio"
                        value="Nữ"
                        name='gender'
                        checked={formData.gender === 'Nữ'}
                        onChange={handleInputChangeInfor}
                      />
                      <p style={{fontSize: '15px', fontWeight: '400', color: 'black', opacity: '1', marginLeft: '5px'}}>Nữ</p>
                    </label>
                    <label style={{margin: '0', display: 'flex'}}>
                      <input
                        type="radio"
                        value="Chưa có"
                        name='gender'
                        checked={formData.gender === 'Ẩn'}
                        onChange={handleInputChangeInfor}
                      />
                      <p style={{fontSize: '15px', fontWeight: '400', color: 'black', opacity: '1', marginLeft: '5px'}}>Ẩn</p>
                </label>
              </div>
                </div>
                {/* Cập nhật ngày sinh */}
                <div className='inforDetail'>
                  <p>Ngày sinh</p>
                  <input
                    type="date"
                    name="birthDay"
                    value={formData.birthDay}
                    onChange={handleInputChangeInfor}
                    className='inforChange'
                  />
                </div>
                {/*Không cập nhật email mà chỉ hiển thị*/}
                <div className='inforDetail'>
                  <p>Email</p>
                  <span>{user?.email || 'Chưa có'}</span>
                </div>
                {/* Cập nhật số điện thoại */}
                <div className='inforDetail'>
                  <p>Số điện thoại</p>
                  <input
                    type="text"
                    name="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={handleInputChangeInfor}
                    className='inforChange'
                  />
                </div>
            </div>
          ) : (
            // Nếu không chỉnh sửa thì hiển thị các thông tin được lấy từ firebase
              <div>
                <div className='inforDetail'>
                  <p>Giới tính</p>
                  <span>{user?.gender || 'Chưa có'}</span>
                </div>
                <div className='inforDetail'>
                  <p>Ngày sinh</p>
                  <span>{user?.birthDay || 'Chưa có'}</span>
                </div>
                <div className='inforDetail'>
                  <p>Email</p>
                  <span>{user?.email || 'Chưa có'}</span>
                </div>
                <div className='inforDetail'>
                  <p>Số điện thoại</p>
                  <span>{user?.phoneNumber || 'Chưa có'}</span>
                </div>
              </div>
          )}
          </div>
        </div>
      </MyInforStyle>
    </Form>
  );
};

export default MyInfor;