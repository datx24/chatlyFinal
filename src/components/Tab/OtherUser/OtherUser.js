import { Form } from "antd";
import React, { useState, useEffect } from "react";
import styled from "styled-components";
import HeaderSub from "../../header/HeaderSub";
import UserHead from "./UserHead";
import UserInfor from "./UserInfor";
import BlockUserModal from "./BlockConfirm";
import { doc, getDoc, updateDoc, arrayUnion, arrayRemove } from 'firebase/firestore';
import { db, auth } from "../../lib/firebaseConfig"; // Import your firebase config

const TabStyled = styled.div`
    width: 471px;
    height: 582px;
    border: 2px solid black;
    border-radius: 20px;
    background-color: white;
    position: fixed;
    z-index: 500;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    .userInfor{
        font-family: "Roboto", sans-serif;
        font-size: 20px;
        font-weight: 500;
        margin: 15px 0 5px 0;
        padding: 0 16px;
        position: relative;
    }
    .userAct{
        text-align: left;
        margin: 25px 16px;
        font-family: "Roboto", sans-serif;
        font-size: 20px;
        font-weight: 500;
    }
    .actItem{
        display: flex;
        align-items: center;
        margin-bottom: 5px;
        cursor: pointer;
    }
    .actItem p{
        margin: 0 5px;
    }
    .closeTab{
    border: none;
    background: none;
    font-family: "Rubik", sans-serif;
    font-weight: 900;
    color: red;
    font-size: 20px;
    position: absolute;
    top: 0%;
    right: 2%;

    }
    .closeTab:hover{
        border: none;
        background: none;
        color: white;
    }
`

const handleBlockUser = async (currentUserId, otherUserId) => {
    try {
      const userRef = doc(db, "users", currentUserId);
      await updateDoc(userRef, {
        blocked: arrayUnion(otherUserId)
      });
      console.log("User blocked successfully");
    } catch (error) {
      console.error("Error blocking user: ", error);
    }
  };
  
const handleUnblockUser = async (currentUserId, otherUserId) => {
    try {
      const userRef = doc(db, "users", currentUserId);
      await updateDoc(userRef, {
        blocked: arrayRemove(otherUserId)
      });
      console.log("User unblocked successfully");
    } catch (error) {
      console.error("Error unblocking user: ", error);
    }
  };

export default function OtherUser({selectedUser, onClose}){

    const [isBlocked, setIsBlocked] = useState(false);
    const [modalOpen, setModalOpen] = useState(false);
    const [currentUser, setCurrentUser] = useState(null);

    useEffect(() => {
        const checkIfBlocked = async () => {
        const currentUser = auth.currentUser;
            if (currentUser) {
                const userDoc = await getDoc(doc(db, 'users', currentUser.uid));
                if (userDoc.exists()) {
                    const blockedList = userDoc.data().blocked || [];
                    const userData = userDoc.data();
                    setIsBlocked(blockedList.includes(selectedUser.id));
                    setCurrentUser(userData);
                }
            };
        }
        checkIfBlocked();
      }, [selectedUser.id]);
    

    const handleBlock = async () => {
        await handleBlockUser(currentUser.id, selectedUser.id);
        setIsBlocked(true);
        setModalOpen(false);
    };
    
    const handleUnblock = async () => {
        await handleUnblockUser(currentUser.id, selectedUser.id);
        setIsBlocked(false);
    };
    
    

    return(
        <div>
            <TabStyled>
                <Form>
                    <HeaderSub/>
                    <button 
                    onClick={onClose}
                    className='closeTab'>
                    X  
                    </button>
                    <UserHead
                        displayName={selectedUser.displayName}
                        photoURL={selectedUser.photoURL}
                    />
                    <UserInfor
                        email={selectedUser.email}
                        phoneNumber={selectedUser.phoneNumber}
                        gender={selectedUser.gender}
                        birthDay={selectedUser.birthDay}
                    />
                    <div className="userAct">
                        {isBlocked? 
                            (<div className="actItem" onClick={handleUnblock}>
                                <i className='bx bx-block'></i>
                                <p>Hủy chặn</p>
                            </div>) : (
                            <div className="actItem" onClick={() => setModalOpen(true)}>
                                <i className='bx bx-block'></i>
                                <p>Chặn</p>
                                {modalOpen ?
                                    (<BlockUserModal
                                        show = {modalOpen}
                                        handleClose={() => setModalOpen(false)}
                                        handleBlock={handleBlock}
                                    />) : null
                                } 
                            </div> 
                            )
                        }
                        <div className="actItem">
                            <i class='bx bx-user-plus'></i>
                            <p>Kết bạn</p>
                        </div>
                    </div>
                </Form>
            </TabStyled>
        </div>
    )
}