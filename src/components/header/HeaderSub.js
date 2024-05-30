import { Button, Form } from "antd";
import React from "react";
import styled from 'styled-components';
import LogoChatLy from '../../images/Group 4.png'

const HeaderTab = styled.div`
    display: flex;
    height: 41px;
    justify-content: space-between;
    align-items: center;
    padding: 0px 16px;
    background-color: #324B50;
    border-top-left-radius: 18px;
    border-top-right-radius: 18px;
    .logo{
        height: 100%;
    }
    .closeTab{
        border: none;
        background: none;
        font-family: "Rubik", sans-serif;
        font-weight: 900;
        color: white;
        font-size: 20px;
        position: relative;
    }
    .closeTab:hover{
        border: none;
        background: none;
        color: white;
    }
`

export default function HeaderSub(){
    return(
        <HeaderTab>
            <img src={LogoChatLy} alt="logo" className="logo"></img>
            {/* <button className="closeTab"><span >X</span></button> */}
            
        </HeaderTab>
    )
}