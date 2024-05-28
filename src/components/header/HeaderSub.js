import { Button, Form } from "antd";
import React from "react";
import styled from 'styled-components';

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
            <img src="https://scontent.xx.fbcdn.net/v/t1.15752-9/434521997_782614083797588_95458143183886990_n.png?_nc_cat=103&ccb=1-7&_nc_sid=5f2048&_nc_ohc=0E7GRRKCtLgAb7IszO7&_nc_ad=z-m&_nc_cid=0&_nc_ht=scontent.xx&oh=03_Q7cD1QFi4WhedGa3i492Qb-ypQ3JXdBOR2LTtEYHNdm2kkgKSw&oe=664E7A07" alt="logo" className="logo"></img>
            {/* <button className="closeTab"><span >X</span></button> */}
            
        </HeaderTab>
    )
}