import React, { useState, useEffect }  from "react";
import HeaderSub from '../header/HeaderSub';
import Header from "../Modals/Header";
import AddMemberGroup from "../Tab/AddMemberGroup/AddMemberGroup";
import styled from "styled-components";
import Logo from "../../images/Group 4.png"
import { useSearch } from '../lib/searchContext'; // Import SearchContext

const GroupInforStyle = styled.div`
  position: fixed;
  height: 582px;
  z-index: 1000;
  background-color: white;
  top: 0;
  left: 100%;
  transform: translateX(-100%);
  animation: moveLeft 0.5s ease forwards;
  width: 471px;
  border-radius: 20px;
  border: 1px solid black;
  font-family: "Roboto", sans-serif;

  @keyframes moveLeft {
    from {
        transform: translateX(0);
    }
    to {
        transform: translateX(-100%);
    }
  }
  p,
  h3{
    margin: 0;
    cursor: default;
  }
  .close-tab{
    outline: none;
  }
  .group-name-members{
    padding: 20px 16px 20px 16px;
    margin-bottom: 20px;
    display: flex;
  }
  .group-name-members img{
    width: 91px;
    height: 91px;
    border-radius: 50%;
    border: 2px solid #238c9f;
  }
  .group-name-members_1 {
    margin: 0 0 0 10px;
  }
  .group-name-members::before{
    position: absolute;
    content: '';
    height: 5px;
    width: 100%;
    background-color: #DBE3E4;
    top: 155px;
    left: 0;
  }
  .group-list{
    padding: 0 16px 20px 16px;
  }
  .group-list-title{
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 10px;
  }
  .group-list-title h3{
    font-size: 20px;
    color: #324B50;
  }
  .input-group{
    display: flex;
    align-items: center;
    border: 1px solid #324B50;
    border-radius: 30px;
    height: 30px;
    width: 50%;
    padding: 0 5px;
  }
  .input-group input{
    height: 100%;
    border: none;
    outline: none;
    border-top-right-radius: 30px;
    border-bottom-right-radius: 30px; 
  }
  .input-group i{
    font-size: 18px;
    color: #324B50;
    margin-right: 5px;
  }
  .group-list-member{
    overflow-y: auto;
    height: 300px;
    font-weight: 500;
  }
  .member{
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 10px;
  }
  .member-avatar{
    width: 46px;
    height: 46px;
    border-radius: 50%;
    border: 2px solid #238C9F;
  }
  .member-name{
    margin-left: 10px;
    font-size: 20px;
    cursor: default;
  }
  .member-option{
    cursion: pointer;
  }
  .add-member-btn{
    border: none;
    background-color: #324B50;
    color: white;
    width: 202px;
    height: 34px;
    border-radius: 10px;
    font-weight: 700;
    font-size: 20;
  }
`

const HeaderTab = styled.div`
display: flex;
height: 41px;
justify-content: space-between;
align-items: center;
padding: 0px 16px;
background-color: #324B50;
border-top-left-radius: 18px;
border-top-right-radius: 18px;
position: relative;
.logo{
    height: 100%;
}
.close-tab{
    border: none;
    outline: none;
    background: none;
    font-family: "Rubik", sans-serif;
    font-weight: 900;
    color: white;
    font-size: 20px;
}
.close-tab:hover{
    border: none;
    background: none;
    color: white;
    cursor: pointer;
}
`

function GroupInfor({ member, groupName, ImgGroup, onClose }) {
  const [isAddGroupVisible, setIsAddGroupVisible] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredMembers, setFilteredMembers] = useState(member);


  const handleAddGroupToggle = () => {
    setIsAddGroupVisible(!isAddGroupVisible);
  };

  useEffect(() => {
    const filtered = member.filter(m => 
        m.displayName.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredMembers(filtered);
}, [searchTerm, member]);

  // Hàm xử lý thay đổi của search bar
  const handleSearchChange = (e) => {
      setSearchTerm(e.target.value);
  };
  

  const arr = Object.keys(member).map(key => member[key]);

  return (
    <GroupInforStyle className="card m-auto">
      <HeaderTab>
          <img src={Logo} alt="logo" className="logo"></img>        
          <button 
              onClick={onClose}
              className='close-tab'
          >X</button>
        </HeaderTab>
      <div className="group-name-members">
        <img src={ImgGroup} alt="..." />
        <div className="group-name-members_1">
          <h3>{groupName}</h3>
          <p>Đây là nhóm của tôi</p>
        </div>
      </div>
      <div className="group-list">
        <div className="group-list-title">
          <h3>Danh sách thành viên</h3>
          <div className="input-group">
            <i class='bx bx-search-alt'></i>
            <input type="search" placeholder="Tìm tên thành viên" aria-label="Search" aria-describedby="search-addon" value={searchTerm} onChange={handleSearchChange}/>
          </div>
        </div>
        <div className="group-list-member">
          {filteredMembers.map(member1 => (
            <div className= "member"  key={member1.id}>
              <div style={{display: 'flex', alignItems: 'center'}}>
                <img src={member1.photoURL} className="member-avatar" alt="..." />
                <h3 className="member-name">{member1.displayName}</h3>
              </div>
              <a className="member-option">...</a>
            </div>
          ))}
        </div>
        <div style={{display: 'flex', justifyContent: 'center'}}>
          <button className="add-member-btn" onClick={handleAddGroupToggle}>Thêm thành viên</button>
        </div>
        {isAddGroupVisible && <AddMemberGroup onClose={handleAddGroupToggle} />}
      </div>
    </GroupInforStyle>

  );
}

export default GroupInfor;

