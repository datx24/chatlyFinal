import { Col, Row } from 'antd';
import React from  'react';
import SideBar from './SideBar';

import ChatWindow from './ChatWindow';

export default function ChatRom(){
    return (
        <>
        <Row>
            <Col span={8}>
                <SideBar/>
            </Col>
            <Col span={16}>
                <ChatWindow/>
            </Col>
        </Row>
        
        </>
    )
}