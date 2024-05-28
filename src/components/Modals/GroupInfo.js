/* eslint-disable jsx-a11y/alt-text */
import React, { useEffect, useContext } from "react";
import { SelectedGroupContext } from '../ChatRoom/SelectedGroupContext'
import styled from "styled-components";
import { useState } from "react";
import GroupInfor from "../thongTinNhom-TrangCaNhan/GroupInfor";
import upload from "../lib/upload";
import HeaderSub from "../header/HeaderSub";
import fetchMemberData from "../lib/getMember";
import { ArrowRightOutlined } from '@ant-design/icons';
import getGroupMembers from "../lib/getGroupMembers";
import { useUserStore } from "../lib/userStore";
import deleteMember from "../lib/deleteMember";
import updateNameGroup from "../lib/updateNameGroup";
import updateGroupImage from "../lib/updateGroupImage";
const GroupInfoStyled = styled.div`
    ${'' /* position:absolute; */}
    position: absolute;
    right: 0%;
    top: 5%;
    width: 471px;
    height: 582px;
    border: 1px solid black;
    border-radius: 20px;
    background-color: white;
    z-index: 1;
    .group_name_members_2 h3{
        font-family: "Roboto", sans-serif;
        font-weight: 700;
        font-size: 25px;
        font-style: normal;
        color: #324b50;
        margin-top: 16px;
    }
    .group_name_members{
        padding-top: 0px;
        padding-bottom: 7px;
        padding-left: 16px;
        padding-right: 40px;
        align-items: center;
        display: flex;
        justify-content: space-between;
        margin-top: 10px;
        height: 91px;
    }
    .group_name_members_1{
        line-height: 25px;
        padding-left: 0px;
    }
    .group_name_members_1 p{
        font-family: "Roboto", sans-serif;
        font-size: 20px;
        font-weight: 400;
        color: #324b50;
    }
    .group_actions::before{
        content: "";
        width: 471px;
        height: 5px;
        background-color: #dbe3e4;
        position: absolute;
        margin-top: 5px;
    }
    .group_actions h3{
        font-family: "Roboto", sans-serif;
        font-weight: 500;
        font-size: 20px;
        text-align: left;
        color: #324b50;
        padding-left: 20px;
        padding-top: 20px;
        padding-bottom:10px;
    }
    .group_actions_1 .pinned_message{
        display: flex;
        justify-content: space-between;
    }
    .pinned_message p{
        font-family: "Roboto", sans-serif;
        font-weight: 400;
        font-size: 20px;
        margin-left: 5px;
        margin-top: 0px;
    }
    .pinned_message i{
        font-size: 24px;
        margin-top: 3px;
    }
    .group_actions_1 i{
        font-size: 24px;
        margin-top: 0px;
    }
    .group_actions ul li{
        list-style: none;
        display: flex;
        justify-content: space-between;
        margin-top: 0px;
    }
    .group_actions ul{
        padding: 0px 16px;
        margin-bottom:0px;
    }
    .group_actions_1 .group_members{
        display: flex;
        justify-content: space-between;
    }
    .group_members i{
        font-size: 24px;
        margin-top: 0px;
    }
    .group_members p{
        font-family: "Roboto", sans-serif;
        font-weight: 400;
        font-size: 20px;
        margin-left: 5px;
        margin-top: 0px;
    }
    .group_actions_2 h4{
        font-family: "Roboto", sans-serif;
        font-weight: 500;
        font-size: 20px;
        text-align: left;
        color: #324b50;
        padding-left: 20px;
        line-height: 45px;
    }
    .group_actions_1 .exit-chat{
        display: flex;
        justify-content: space-between;
    }
    .exit-chat i{
        font-size: 24px;
        margin-top: 0px;
        color: #d33b3b;
    }
    .exit-chat p{
        font-family: "Roboto", sans-serif;
        font-weight: 400;
        font-size: 20px;
        margin-left: 5px;
        margin-top: 0px;
        color: #d33b3b;
    }
    .forward{
        border: none;
        background: none;
        cursor: pointer;
        position: relative;
        height: 30px;
        width: 30px;
    }
    .exit-chat{
        border: none;
        background: none;
        cursor: pointer;
        position: relative;
    }
    .group_name_members_2{
        display: flex;
        align-items: center;
    }
    .group_name_members_2 i{
        padding-left: 8px;
        font-size: 24px;
    }
    .edit_name{
        border: none;
        background: none;
        cursor: pointer;
        position: relative;
    }
    .group_actions_2::before{
        content: "";
        width: 471px;
        height: 5px;
        background-color: #dbe3e4;
        position: absolute;
    }
    .group_actions_2 ul li{
        list-style: none;
        display: flex;
        justify-content: space-between;
    }
    .group_actions_2 ul{
        padding: 0px 16px;
    }
    .group_actions_2{
        padding-top: 5px;
        position: relative;
    }
    .custom-file-upload img{
        width:91px;
        height:91px;
        border-radius:50%;
        border: 2px solid #238c9f;
        position:absolute;
        margin-top: -45px;
    }
    .custom-file-upload{
        display:contents;
        position:absolute;
        height:91px;
        cursor: pointer;
    }
    .closeTab{
        border: none;
        background: none;
        font-family: "Rubik", sans-serif;
        font-weight: 900;
        color: white;
        font-size: 20px;
        position: relative;
        top: -6%;
        right: -94%;
    }
    .closeTab:hover{
        border: none;
        background: none;
        color: white;
    }
`
var memberNameFist, memberNameSecond, numberOfMembers1;
const GroupInfo = ({ onClose }) => {
  const { selectedGroup } = useContext(SelectedGroupContext);
  const [showGroupInfor, setShowGroupInfor] = useState(false);
  const [groupImgUrl, setGroupImgUrl] = useState("")
  const [groupName, setGroupName] = useState('')
  const [numberOfMembers, setNumberOfMembers] = useState(0)
  const [isEditing, setIsEditing] = useState(false)
  const [newGroupName, setNewGroupName] = useState(groupName)
  const [memberName, setMemberName] = useState();
  const [memberName2, setMemberName2] = useState();
  const [member, setMember] = useState([]);
  const [isGroupInForVisible, setIsGroupInForVisible] = useState(false);
  const { currentUser, fetchUserInfo } = useUserStore();
  var keysLength = Object.keys(selectedGroup.members).length;
  useEffect(() => {
    const fetchData = async() => {
      try{
        setTimeout(() => {
          const groupName = selectedGroup.nameGroup //"Nhóm 1 Widosoft"
          setGroupName(groupName)
        },1000)

        setTimeout(() => {
          const numberOfMembers = keysLength;
          setNumberOfMembers(numberOfMembers)
        },1000)
      }catch(error){
        console.error("Error fetching data",error);
      }
    }

    fetchData()
  },[])

  const HandCheckClick = () => {
    console.log('this is name: ',selectedGroup.nameGroup)
  }

  const handleShowGroupInfor = () => {
    setShowGroupInfor(true);
  };

  const handleGroupInForToggle = () => {
    setIsGroupInForVisible(!isGroupInForVisible);
  };

  const handleHideGroupInfor = () => {
    setShowGroupInfor(false);
  };
  
  const handleImageUpload = async(file) => {
    try{
      const url = await upload(file)
      setGroupImgUrl(url)
      localStorage.setItem("groupImageUrl",url)
    }catch(error){
      console.error("Error uploading image",error)
    }
  }

  const handleFileInputChange = (event) => {
    const file = event.target.files[0]
    if(file){
      console.log(file);
      updateGroupImage(selectedGroup.GroupId,file);
    }
  }

  const handleEditClick = () => {
    setIsEditing(true)
    setNewGroupName(groupName)
  }

  const handleSaveClick = () => {
    setGroupName(newGroupName);
    
    
    updateNameGroup(selectedGroup.GroupId,newGroupName);
    setIsEditing(false);
  }

  const handleCancelClick = () => {
    setIsEditing(false)
  }

  const handleGroupNameChange = (event) => {
    setNewGroupName(event.target.value)
  }

  const handleOutGroup = () => {
    deleteMember(selectedGroup.GroupId, currentUser.id);
  }

 fetchMemberData(selectedGroup.members[0])
  .then((memberName1) => {
    // Lấy fist name từ memberName1
    var firstName = memberName1.split(' ')[0];
    setMemberName(firstName);
  })
  .catch((error) => {
    console.error("Error:", error);
  });
  var member1 = memberName;
  fetchMemberData(selectedGroup.members[1])
  .then((memberName1) => {
    // Lấy fist name từ memberName1
    var firstName = memberName1.split(' ')[0];
    setMemberName2(firstName);
  })
  .catch((error) => {
    console.error("Error:", error);
  });
  var member2 = memberName2;
  
  useEffect(() => {
    // Gọi hàm getGroupMembers ở đây
    getGroupMembers(selectedGroup.GroupId)
      .then((memberObjects) => {
        
        setMember(memberObjects);
      })
      .catch((error) => {
        console.error("Error:", error);
        // Xử lý lỗi ở đây
      });
  }, []);
  
  const isLeader = currentUser.id === selectedGroup.leader;
  memberNameFist = member1;
  memberNameSecond = member2;
  numberOfMembers1 = numberOfMembers;
    return (
     
      <GroupInfoStyled>
      <HeaderSub/>

     <button 
      onClick={onClose}
      className='closeTab'
      >X</button>

        <div className="group_name_members">
          <div className="group-image">
            <label htmlFor="fileInput" className="custom-file-upload">
              <input
                id="fileInput"
                type="file"
                accept="image/*"
                onChange={handleFileInputChange}
                style={{display:'none'}}
              />
              {groupImgUrl? (
                <img src={groupImgUrl} alt="Uploaded"/>
              ) : (
                <span style={{display: 'block', height:'0px',width:'1px', borderRadius:'100%'}}>
                  <img src={selectedGroup.urlImg} alt="Ảnh đại diện"/>
                </span>
              )}
            </label>
          </div>
          <div className="group_name_members_1">
            <div className="group_name_members_2">
              {isEditing ? (
                <>
                  <input
                    className="group_name_input"
                    value={newGroupName}
                    onChange={handleGroupNameChange}
                  />
                  <button className="edit_name" onClick={handleSaveClick}>
                    Save
                  </button>
                  <button className="edit_name" onClick={handleCancelClick}>
                    Cancel
                  </button>
                </>
              ) : (
                <>
                  <h3>{groupName}</h3>
                  <button onClick={handleEditClick} className="edit_name">
                    <i className="bx bxs-edit-alt" />
                  </button>
                </>
              )}
            </div>
            <p>Bao gồm {member1}, {member2} và {numberOfMembers-2} người khác</p>
          </div>
        </div>
        <div className="group_actions">
          <h3>Thông tin về đoạn chat</h3>
          <ul>
            <li className="group_actions_1">
              <div className="pinned_message">
                <i className="bx bx-pin" />
                <p>Xem tin nhắn đã ghim</p>
              </div>
              <button className="forward">
                <i className="bx bx-right-arrow-alt" />
              </button>
            </li>
            <li className="group_actions_1">
              <div className="group_members">
                <i className="bx bx-search-alt" />
                <p>Xem thành viên trong đoạn chat</p>
              </div>
              <button className="forward" onClick={handleGroupInForToggle}>
                <ArrowRightOutlined />
              </button>
              
            </li>
          </ul>
        </div>
        <div className="group_actions_2">
          <h4>Quyền riêng tư và hỗ trợ</h4>
          <ul>
            <li className="group_actions_1">
              <button className="exit-chat">
                <i className="bx bx-exit" />
                <p>Rời khỏi đoạn chat</p>
              </button>
            </li>
            <li className="group_actions_1">
              {isLeader && (
                <button className="exit-chat">
                  <i className='bx bx-trash'></i>
                  <p>Giải tán nhóm</p>
                </button>
               )}
            </li>
          </ul>
        </div>
        {isGroupInForVisible && 
               ( <GroupInfor 
                member = {member}
                groupName = {selectedGroup.nameGroup}
                ImgGroup = {selectedGroup.urlImg}
                onClose={handleGroupInForToggle}
              />)}
      
      </GroupInfoStyled>
     
    );
  }
  export {memberNameFist,memberNameSecond,numberOfMembers1};
  export default GroupInfo;