import React, {useContext, useState, useEffect } from 'react';
import { Avatar, Button, Collapse, Typography } from 'antd';
import styled from 'styled-components';
import { PlusSquareOutlined } from '@ant-design/icons';
import AddGroup from '../Modals/AddGroup';
import { useUserStore } from '../lib/userStore';
import roomJoined from './RoomJoined';
import { db } from "../lib/firebaseConfig";
import { doc, getDoc } from "firebase/firestore";
import { groupId } from '../lib/groups';
import { SelectedGroupContext } from './SelectedGroupContext';
import { IsUserContext } from '../lib/IsUserContext';
import "../list/chatList/chatList.css"
const { Panel } = Collapse;

const PanelStyle = styled(Panel)`
  &&& {
    .ant-collapse-header,
    p {
      color: white;
    }
    .ant-collapse-content-box {
      padding: 0 40px;
    }
    .add-room {
      color: white;
      padding: 0;
    }
  }
`;

const LinkStyle = styled(Typography.Link)`
  display: block;
  margin-bottom: 5px;
  color: black;

  .username{
    padding-left: 5px;
    color: black;
  }
`;



export default function RoomList() {
  const { currentUser } = useUserStore();
  const { setSelectedGroup } = useContext(SelectedGroupContext);
  const {  setIsUser} = useContext(IsUserContext)
  const [showAddGroup, setShowAddGroup] = useState(false);
  const [groupDataList, setGroupDataList] = useState([]);
  const [isAddGroupVisible, setIsAddGroupVisible] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      const groups = await roomJoined(currentUser.id);
      const groupDataList = await Promise.all(
        groups.map(async (groupId) => {
          const groupData = await fetchGroupData(groupId);
          return groupData;
        })
      );
      setGroupDataList(groupDataList);
    };

    fetchData();
  }, [currentUser.id]);

  const fetchGroupData = async (groupId) => {
    try {
      const groupRef = doc(db, "Groups", groupId);
      const groupSnapshot = await getDoc(groupRef);
      if (groupSnapshot.exists()) {
        const groupData = groupSnapshot.data();

        return groupData;
      } else {
        console.log("Group does not exist.");
        return null;
      }
    } catch (error) {
      console.error("Error getting group members:", error);
      return null;
    }
  };

  // const handleShowAddGroup = () => {
  //   setShowAddGroup(true);
  // };

  const handleAddGroupToggle = () => {
    setIsAddGroupVisible(!isAddGroupVisible);
  };

  function handleLinkClick(groupData) {
    setSelectedGroup(groupData);
    setIsUser(true);
  }


  return (
    <>
      {/* {!showAddGroup && ( */}
        {/* <Collapse ghost defaultActiveKey={['1']}>
          <PanelStyle header="Danh sách các phòng" key="1"> */}
            {groupDataList.map((groupData) => (
              
              <LinkStyle
                key={groupData.id} 
                onClick={() => handleLinkClick(groupData)}
              >
                <div className='body2-child-1'>
                  <div className='body2-child-1-left1'>
                    <Avatar src={groupData.urlImg} className='logo-body2'/>
                  </div>
                  <div className='body2-child-1-left2'>
                    <Typography.Text className='username'>{groupData.nameGroup}</Typography.Text>
                  </div>
                </div>
                
                
              </LinkStyle>
              
            ))}
           
            {/* <Button
              type="text"
              icon={<PlusSquareOutlined />}
              className="add-room"
              onClick={handleShowAddGroup}
            >
              Thêm Phòng
            </Button> */}
            {/* <button
            type="text"
            icon={<PlusSquareOutlined />}
            className="add-room"
            onClick={handleAddGroupToggle}
            >
            Tạo nhóm
            </button>
            {isAddGroupVisible && <AddGroup onClose={handleAddGroupToggle} />}   */}
          {/* </PanelStyle>
        </Collapse> */}
      {/* )} */}
      {/* {showAddGroup && <AddGroup />} */}
     
      </>
  );
 
}
