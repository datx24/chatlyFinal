import React, { useState } from 'react';
import styled from 'styled-components';
import Header from './Header';
import ListAdd from '../Tab/AddMemberGroup/ListAdd';
import createGroup from '../lib/groups';
import DisplayImage,{imageFile} from './DisplayImage';
import InputText, { nameGroup } from './InputText';
import { useUserStore } from '../lib/userStore';
import Logo from '../../images/Group 4.png'
const AddGroupStyled = styled.div`
    width: 471px;
    height: 582px;
    border: 1px solid black;
    border-radius: 20px;
    position: fixed;
    z-index: 1000;
    background-color: #fff;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    .group-info h3{
        text-align: center;
        font-family: "Roboto", sans-serif;
        font-weight: 700;
        font-style: normal;
        font-size: 25px;
        margin: 5px;
        color: #324b50;
    }
    .search_bar {
        border: 1px solid #324B50;
        display: flex;
        height: 30px;
        border-radius: 30px;
        align-items: center;
        padding: 0px 10px;
        margin: 0 16px;
        position: relative;
    }
    .search_bar i{
        font-size: 10px;
    }
    .in-search {
        width: 100%;
        outline: none;
        border: none;
        font-family: "Roboto", sans-serif;
        font-weight: 300;
        font-size: 15px;
        border: none;
        color: #324B50;
        opacity: 0.5;
        position: relative;
    }
    .group_name img{
        width: 46px;
        height: 46px;
        border-radius: 50%;
        border: 2px solid #238c9f;
    }
    .group_name{
        padding: 0 16px;
        align-items: center;
        display: flex;
        margin-bottom: 20px;
        justify-content: space-between;
    }
    .input_group{
        outline: none;
        border: none;
        font-family: "Roboto", sans-serif;
        font-size: 15px;
        font-weight: 300;
        color: #324b50;
        opacity: 0.5;
        position: relative;
        width: 87%;
        border-bottom: 1px solid #238C9F;
    }
    p{
        display: flex;
        margin: 0;
        padding: 0 16px;
        font-family: "Roboto", sans-serif;
        color: #324B50;
        font-size: 20px;
        font-weight: 600;
    }
    .create-group{
        background-color: #324B50;
        padding: 6px 75px;
        margin: 10px 0;
        border-radius: 10px;
        font-family: "Roboto", sans-serif;
        font-sỉze: 20px;
        font-weight: 700;
        color: white;
        cursor: pointer;
    }
    .users-list ul{
        padding: 0px 16px;
        height: 270px;
        overflow-y: auto;
        margin-top: 10px;
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
    .closeTab{
        border: none;
        outline: none;
        background: none;
        font-family: "Rubik", sans-serif;
        font-weight: 900;
        color: white;
        font-size: 20px;
    }
    .closeTab:hover{
        border: none;
        background: none;
        color: white;
        cursor: pointer;
    }
`
export default function AddGroup({ onClose}){
    const { currentUser} = useUserStore();
    const [image, setImage] = useState(null);
    const [selectedUsers, setSelectedUsers] = useState([]);


    const handleSelectedUsers = (selectedUsers) => {
        setSelectedUsers(selectedUsers);
    };

    const handleCreateGroup = () => {

    createGroup(nameGroup, imageFile, selectedUsers, currentUser.id);
    };

    
    return (
        <AddGroupStyled>
            <Header/>
            <button 
                onClick={onClose}
                className='closeTab'
            >X</button>
            <div className='group-info'>
                <h3>Tạo nhóm</h3>
                <div className='group_name'>
                <DisplayImage setImage={setImage} />
                    <InputText/>
                </div>
                <div className='search_bar'>
                    <i className='bx bx-search-alt' style = {{fontSize: '18px', color: "#324B50"}}></i>
                    <input type='text' className='in-search' placeholder='Tên người dùng...'/>
                </div>
            </div>
            <div style={{width: '100%', height: '5px', backgroundColor: '#DBE3E4', margin: '25px 0 0 0'}}></div>
            <div className='users-list'>
                {/* <p>Gợi ý</p> */}
                <ListAdd onSelectUsers={handleSelectedUsers}/>
            </div>
        
            <div style={{ display: 'flex', justifyContent: 'center' }}>
                
                <button onClick={handleCreateGroup} className="create-group">
                Tạo nhóm
                </button>
            </div>
            
        </AddGroupStyled>
    )
}