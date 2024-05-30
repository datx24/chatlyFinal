import { Form } from "antd";
import React, { useState, useEffect,useContext } from "react";
import styled from 'styled-components';
import { collection, doc, setDoc, getDocs } from "firebase/firestore"; 
import ListAddConditon from "./ListAddConditon";
import { db } from "../../lib/firebaseConfig";
import addMembersToGroup from "../../lib/addMembersToGroup";
import getGroupMembers from "../../lib/getGroupMembers";
import { SelectedGroupContext } from "../../ChatRoom/SelectedGroupContext";
import Logo from "../../../images/Group 4.png"
export const TabStyled = styled.div`
    width: 471px;
    height: 582px;
    border: 2px solid black;
    border-radius: 20px;
    position: absolute;
    top: 0%;
    left: 100%;
    animation: moveLeft 0.5s ease forwards;
    background:#fff;
    transform: translateX(-100%);
    @keyframes moveLeft {
        from {
            transform: translateX(0);
        }
        to {
            transform: translateX(-100%);
        }
      }
    
    .body-tab{
        padding: 0px 16px;
        position: relative;
    }
    .title-text{
        margin: 0px;
        text-align: center;
        font-size: 25px;
        font-weight: 700;
        margin: 5px auto;
        font-family: "Roboto", sans-serif;
        color: #324B50;
    }
    .search-bar{
        border: 1px solid #324B50;
        display: flex;
        height: 30px;
        border-radius: 30px;
        align-items: center;
        padding: 0px 10px;
    }
    .search-bar i{
        margin-right: 5px;
    }
    .search-input{
        width: 100%;
        outline: none;
        border: none;
        color: #324B50;
        opacity: 0.5;
        position: relative;
    }
    .body-tab::before{
        content: "";
        background-color: #DBE3E4;
        width: 100%;
        height: 5px;
        top: 110px;
        left: 0;
        position: absolute;
    }
    .add-btn{
        background-color: #324B50;
        padding: 6px 75px;
        border-radius: 10px;
        font-family: "Roboto", sans-serif;
        font-sỉze: 20px;
        font-weight: 700;
        color: white;
        margin: 10px 0;
        cursor: pointer;
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



export default function AddMemberGroup({ onClose }){
    const { selectedGroup } = useContext(SelectedGroupContext);
    //lấy mảng selectusers 
    const [selectedUsers, setSelectedUsers] = useState([]);
    const [groupId, setGroupId] = useState(selectedGroup.GroupId); // Giá trị ban đầu của groupId
    const [groupMembers, setGroupMembers] = useState([]);
    const [users, setUsers] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredMembers, setFilteredMembers] = useState(users);



    useEffect(() => {
        // Thực hiện truy vấn và cập nhật danh sách thành viên của nhóm
        // lấy ra danh sách thành viên có trong nhóm
    const fetchGroupMembers = async () => {
        const members = await getGroupMembers(groupId);
        setGroupMembers(members);
    };

    fetchGroupMembers();
    }, [groupId]);


    const handleSelectedUsers = (selectedUsers) => {
    setSelectedUsers(selectedUsers);
    };
    
    useEffect(() => {
        // Truy vấn Firestore để lấy danh sách người dùng
        const fetchUsers = async () => {
            const usersRef = collection(db, 'users');
            const snapshot = await getDocs(usersRef);
            const users = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setUsers(users);
        };
    
        fetchUsers();
    }, []);

    useEffect(() => {
        const filtered = users.filter(m => 
            m.displayName.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setFilteredMembers(filtered);
    }, [searchTerm, users]);
    
      // Hàm xử lý thay đổi của search bar
      const handleSearchChange = (e) => {
          setSearchTerm(e.target.value);
      };
      
    const handleClick = () => {
    // Thực hiện việc thêm thành viên vào nhóm
    addMembersToGroup(groupId, selectedUsers);
    };
    return(
        <TabStyled>
            
            <Form>
            <HeaderTab>
                <img src={Logo} alt="logo" className="logo"></img>        
                <button 
                    onClick={onClose}
                    className='close-tab'
                >X</button>
            </HeaderTab>
                <div className="body-tab">
                    <div className="title">
                        <h3 className="title-text">Thêm thành viên</h3>
                        <div className="search-bar">
                            <i class='bx bx-search-alt icon' style = {{fontSize:"18px", color: "#324B50"}}></i>
                            <input className="search-input" placeholder ="Tên người dùng" onChange={handleSearchChange} value={searchTerm}></input>
                        </div>
                    </div>
                    <ListAddConditon
                        groupId={groupId}
                        groupMembers={groupMembers}
                        onSelectUsers={handleSelectedUsers}
                        filteredMembers = {filteredMembers}
                    />
                </div>
                <div style={{display: "flex", justifyContent: "center"}}>
                <button className="add-btn" onClick={handleClick}>Thêm</button>

                </div>
            </Form>
            
        </TabStyled>
    )
}