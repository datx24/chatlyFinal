import React from "react";
import styled from "styled-components";

const UserHeadStyled = styled.div`
    display: flex;
    height: 130px;
    padding: 0 16px;
    align-items: center;
    position: relative;
    img{
        height: 91px;
        width: 91px;
        border-radius: 100%;
        border: 2px solid #238C9F;
    }
    .userNameContact{
        font-family: "Roboto", sans-serif;
        font-size: 25px;
        font-weight: 700;
        margin: 0 20px;
    }
    .userName{
        display: flex;
        align-items: center;
        margin: 0 0 10px 0;
    }
    .userContactBtn button{
        margin-right: 10px;
        background-color: white;
        border: 1px solid #324B50;
        border-radius: 5px;
        padding: 5px 10px;
        font-family: "Roboto", sans-serif;
        font-size: 15px;
        font-weight: 700;
        color: #324B50;
        cursor: pointer;
    }
    .userContactBtn button:hover{
        background-color: #DBE3E4;
    }
    .line{
        content: "";
        width: 100%;
        height: 5px;
        position: absolute;
        background-color: #DBE3E4;
        left: 0;
        top: 130px;
    }
`

export default function UserHead({displayName, photoURL}){
    return(
        <UserHeadStyled>
            { 
            }
            <img src={photoURL} alt="imageURL" className="userImage"></img>
            <div className="userNameContact">
                <div className="userName">
                    <p style={{margin: "0 5px 0 0"}}>{displayName}</p>
                    <i class='bx bxs-edit-alt'></i>
                </div>
                <div className="userContactBtn" style={{display: "flex"}}>
                    <button>Gọi điện</button>
                    <button>Nhắn tin</button>
                </div>
            </div>
            <div className="line"></div>
        </UserHeadStyled>
    )
}