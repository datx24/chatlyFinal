import React from "react";
import { Button, Collapse, Typography } from "antd";
import styled from "styled-components";
import { PlusSquareOutlined } from "@ant-design/icons";

const {Panel} = Collapse;

const PanelStyle = styled(Panel)`
    &&& {
        .ant-collapse-header, p {
            color: white;

        }
        .ant-collapse-content-box {
            padding: 0 40px;
        }
        .add-freind {
            color: white;
            padding: 0;
        }
    }
`;

const LinkStyle = styled(Typography.Link)`
    display: block;
    margin-bottom:5px;
    color: white;
`;

export default function UsersList(){
    return(
        <Collapse ghost defaultActiveKey={['1']}>
            <PanelStyle header = "Danh sách bạn bè" key = '1'> 
                <LinkStyle >Users 1</LinkStyle>
                <LinkStyle >Users 2</LinkStyle>
                <LinkStyle >Users 3</LinkStyle>
                <Button type="text" icon={<PlusSquareOutlined/>} className="add-freind">Thêm Bạn</Button>
            </PanelStyle>
        </Collapse>
    )
}