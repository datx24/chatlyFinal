import React from "react";
import styled from "styled-components";


const UserInforStyled = styled.div`
    font-family: "Roboto", sans-serif;
    font-size: 20px;
    font-weight: 500;
    margin: 15px 0 5px 0;
    padding: 0 16px;
    position: relative;
    ul li{
        list-style: none;
        display: flex;
        justify-content: space-between;
        align-items: center;
    }
    .inforTitle{
        margin: 0;
        font-weight: 500;
        color: #324B50;
        opacity: 0.6;
    }
    .inforProps{
        margin: 0;
        font-size: 15px;
        font-weight: 300;
    }
    .line{
        content: "";
        width: 100%;
        height: 5px;
        position: absolute;
        background-color: #DBE3E4;
        bottom: -15px;
        left: 0;
    }
`

export default function UserInfor({gender, birthDay, email, phoneNumber}){
    return(
        <UserInforStyled>
            <p style={{textAlign: "left", margin: "5px 0"}}>Thông tin cá nhân</p>
            <ul style={{margin: "0", padding: "0"}}>
                <li>
                    <p className="inforTitle">Giới tính</p>
                    <p className="inforProps">{gender ? gender : "Chưa có"}</p>
                </li>
                <li>
                    <p className="inforTitle">Ngày sinh</p>
                    <p className="inforProps">{birthDay ? birthDay : "Chưa có"}</p>
                </li>
                <li>
                    <p className="inforTitle">Email</p>
                    <p className="inforProps">{email ? email : "Chưa có"}</p>
                </li>
                <li>
                    <p className="inforTitle">Số điện thoại</p>
                    <p className="inforProps">{phoneNumber ? phoneNumber : "Chưa có"}</p>
                </li>
            </ul>
            <div className="line"></div>
        </UserInforStyled>
    )
}