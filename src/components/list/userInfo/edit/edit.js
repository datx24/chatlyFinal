import React, { useState } from 'react';
import MyComponent from '../../../thongTinNhom-TrangCaNhan/MyInfor';
import './edit.css';
import { signOut } from 'firebase/auth';
import { auth } from '../../../lib/firebaseConfig';
import AddGroup from '../../../Modals/AddGroup';
import { tr } from 'date-fns/locale';
import MyInfor from '../../../thongTinNhom-TrangCaNhan/MyInfor';
const Edit = () => {
  const [openAddGroup, setOpenAddGroup] = useState(false);
  const [openMyInfo, setOpenMyInfo] = useState(false);
  const [state, setState] = useState({
    showProfile: false,
    profile: '',
    group: '',
    settings: '',
  });

  const handleLogout = async () => {
    try {
      await signOut(auth);
      localStorage.clear();
      window.location.reload();
    } catch (error) {
      alert('Error logging out: ' + error.message);
    }
  };

  const handleProfileClick = () => {
    setState({...state, showProfile: true, profile: 'Action in progress...' });
    setOpenMyInfo(true);
  };

  const handleGroupClick = () => {
    setState({...state, group: 'Action in progress...' });
    setOpenAddGroup(true);
  };

  const handleSettingsClick = () => {
    setState({...state, settings: 'Action in progress...' });
  };

  return (
  <>
  {openMyInfo && <MyInfor/>}
  {openAddGroup && <AddGroup/>}
  <div className="edit-container">
      
      <div>
        <button name="profile" onClick={handleProfileClick}>
          Chỉnh sửa profile
        </button>
      </div>
      <div>
        <button name="group" onClick={handleGroupClick}>
          Tạo nhóm mới
        </button>
      </div>
      <div>
        <button name="settings" onClick={handleSettingsClick}>
          Cài đặt
        </button>
      </div>
      <div>
        <button name="logout" onClick={handleLogout}>
          Đăng xuất
        </button>
      </div>
      {state.showProfile && <MyComponent />}
    
    </div>
  </>
    
  );
};

export default Edit;