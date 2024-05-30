import React, { useState } from "react";
import styled from "styled-components";
import "./UserInfor.css";
import LogoChatly from "../../../images/Group 4.png";
import { useChatStore } from "../../lib/chatStore";
import { createContext } from "react";
import { useUserStore } from "../../lib/userStore";
import { arrayRemove, arrayUnion, updateDoc } from "firebase/firestore";
import { db } from "../../lib/firebaseConfig";
import { doc } from "firebase/firestore";

const HeaderStyled = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #ddd;
  background-color: #324b50;
  padding: 5px;
  border-top-left-radius: 20px;
  border-top-right-radius: 20px;
`;

const LogoStyled = styled.img`
  width: 100px;
  height: 50px;
`;

const CloseButtonStyled = styled.button`
  border: none;
  background: none;
  font-family: "Rubik", sans-serif;
  font-weight: 900;
  color: white;
  font-size: 20px;
  position: relative;
  :hover {
    border: none;
    background: none;
    color: white;
  }
`;

const UserInforStyled = styled.div`
  font-family: "Roboto", sans-serif;
  font-size: 20px;
  font-weight: 500;
  margin: 15px 0 5px 0;
  padding: 0 16px;
  position: relative;
  z-index: 1000000;
  ul li {
    list-style: none;
    display: flex;
    justify-content: space-between;
    align-items: center;
    z-index: 1000000;
  }
  .inforTitle {
    margin: 0;
    font-weight: 500;
    color: #324b50;
    opacity: 0.6;
    z-index: 1000000;
  }
  .inforProps {
    margin: 0;
    font-size: 15px;
    font-weight: 300;
    z-index: 1000000;
  }
  .line {
    width: 100%;
    height: 2px;
    background-color: #dbe3e4;
    margin: 15px 0;
    z-index: 1000000;
  }
`;

const ButtonContainerStyled = styled.div`
  display: flex;
  justify-content: space-around;
  margin-top: 10px;
`;

const ActionButtonStyled = styled.button`
  padding: 5px 10px;
  border: none;
  border-radius: 5px;
  font-family: "Roboto", sans-serif;
  font-size: 16px;
  cursor: pointer;
  background-color: ${(props) => (props.block ? "#ff6b6b" : "#4caf50")};
  color: white;
  &:hover {
    background-color: ${(props) => (props.block ? "#ff4b4b" : "#45a049")};
  }
`;

const UserBlockContext = createContext();

export default function UserInfor({
  gender,
  birthDay,
  email,
  phoneNumber,
  username,
  photoURL,
  onClose,
}) {
  const [isUserInfoVisible, setIsUserInfoVisible] = useState(true);
  const [isUserBlocked, setIsUserBlocked] = useState(false);
  const { chatId, user, isCurrentBlocked, isReceiverBlocked, changeBlock } =
    useChatStore();
  const { currentUser } = useUserStore();
  const handleBlock = async () => {
    if (!user) return;
  
    const userDocRef = doc(db, "users", currentUser.id);
    try {
      await updateDoc(userDocRef, {
        blocked: isUserBlocked? arrayRemove(user.id) : arrayUnion(user.id),
      });
  
      // Cập nhật trạng thái chặn của cả hai bên
      setIsUserBlocked(!isUserBlocked);
      changeBlock();

    } catch (err) {
      console.log(err);
    }
  };
  

  if (!isUserInfoVisible) return null;

  return (
    <UserBlockContext.Provider value={{ isUserBlocked, setIsUserBlocked }}>
      <div className="user-info-container">
        <HeaderStyled>
          <LogoStyled src={LogoChatly} alt="Logo" />
          <CloseButtonStyled onClick={() => setIsUserInfoVisible(false)}>
            ×
          </CloseButtonStyled>
        </HeaderStyled>
        <UserInforStyled>
        <div className="user-avatar-name">
    <img src={photoURL ? photoURL : "Chưa có"} alt="Avatar" className="avatar" />
    <p className="username">{username ? username : "Chưa có"}</p>
  </div>
        <div className="line"></div>
          <p style={{ textAlign: "left", margin: "5px 0" }}>
            Thông tin đối phương
          </p>
          <ul style={{ margin: "0", padding: "0" }}>
            <li>
              <p className="inforTitle">Giới tính</p>
              <p className="inforProps">{gender ? gender : "Chưa có"}</p>
            </li>
            <li>
              <p className="inforTitle">Ngày sinh</p>
              <p className="inforProps">
                {birthDay ? birthDay : "Chưa có"}
              </p>
            </li>
            <li>
              <p className="inforTitle">Email</p>
              <p className="inforProps">{email ? email : "Chưa có"}</p>
            </li>
            <li>
              <p className="inforTitle">Số điện thoại</p>
              <p className="inforProps">
                {phoneNumber ? phoneNumber : "Chưa có"}
              </p>
            </li>
          </ul>
          <div className="line"></div>
          <ButtonContainerStyled>
            <ActionButtonStyled block={isUserBlocked} onClick={handleBlock}>
              {isCurrentBlocked
                ? "Bạn đã bị chặn"
                : isReceiverBlocked
                ? "Bỏ chặn"
                : "Chặn"}
            </ActionButtonStyled>
          </ButtonContainerStyled>
        </UserInforStyled>
      </div>
    </UserBlockContext.Provider>
  );
}
