import { Col, Row } from 'antd';
import React from 'react';
import UserInfor from './UserInfor';
import RoomList from './RoomList';
import UsersList from './UsersList';
import styled from 'styled-components';
const SideBarStyle = styled.div`
    background: #3f0e40;
    color: white;
    height: 100vh
`;

export default function SideBar(){
    return (
    <SideBarStyle>
    <Row>
        <Col span={24}><UserInfor/></Col>
        <Col span={24}><RoomList/></Col>
        {/* <Col span={24}><UsersList/></Col> */}
    </Row>
    </SideBarStyle>
    )
}