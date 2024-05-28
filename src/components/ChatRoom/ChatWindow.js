import React, { useContext, useState } from 'react';
import { SelectedGroupContext } from './SelectedGroupContext';
import { HomeOutlined } from '@ant-design/icons';
import { Button } from 'antd';
import GroupInfo from '../Modals/GroupInfo';
export default function ChatWindow() {
    const { selectedGroup } = useContext(SelectedGroupContext);
    // const [showGroupInfo, setShowGroupInfo] = useState(false);
    const [isGroupInfoVisible, setIsGroupInfoVisible] = useState(false);
    // const handleHomeClick = () => {
      // setShowGroupInfo(true);
    // };
    const handleGroupInfoToggle = () => {
      setIsGroupInfoVisible(!isGroupInfoVisible);
    };
  

  return (
    <div style={{ textAlign: 'right' }}>
       {/* Add the Link component with the destination path */}
        <Button
         type="primary"
         onClick={handleGroupInfoToggle}
        >
          <HomeOutlined /> Home
        </Button>
        {isGroupInfoVisible && <GroupInfo onClose={handleGroupInfoToggle}/>}
    </div>
  );
}