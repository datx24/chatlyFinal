import { Button } from "antd";
import React, { useState, useCallback } from "react";
import styled from "styled-components";
import GroupInfo from "../../Modals/GroupInfo";
import CloseTabButton from "./CloseTabButton";

const HeaderTabStyled = styled.div`
  display: flex;
  height: 41px;
  justify-content: space-between;
  align-items: center;
  padding: 0px 16px;
  background-color: #324B50;
  border-top-left-radius: 18px;
  border-top-right-radius: 18px;
 .logo {
    height: 100%;
  }
 .closeTab {
    border: none;
    background: none;
    font-family: "Rubik", sans-serif;
    font-weight: 900;
    color: white;
    font-size: 20px;
    position: relative;
  }
 .closeTab:hover {
    border: none;
    background: none;
    color: white;
    cursor: pointer;
  }
`;


const TabHeader = () => {
  const [showGroupInfo, setShowGroupInfo] = useState(false);

  const handleToggleGroupInfo = () => {
    setShowGroupInfo(!showGroupInfo);
  };

  const handleCloseTab = () => {
    // Exit logic here
    console.log('Exit button clicked!');
    setShowGroupInfo(false); // Hide GroupInfo before closing the tab
  };
  return (
    <HeaderTabStyled>
       <img src="https://scontent.fdad3-4.fna.fbcdn.net/v/t1.15752-9/434664594_1480298689250913_4334733092950597790_n.png?_nc_cat=101&ccb=1-7&_nc_sid=5f2048&_nc_ohc=FnzsH0kLThEAb5QWeu7&_nc_ht=scontent.fdad3-4.fna&oh=03_Q7cD1QEH-9YMA2TbVc6cHA0t9-Zk50c_MPXw8-hI_uQbh-x_0Q&oe=66481A2F" alt="logo" className="logo" />
      <CloseTabButton onClick={handleCloseTab} />
      {showGroupInfo && <GroupInfo onHide={handleToggleGroupInfo} />}
    </HeaderTabStyled>
  );
};

export default TabHeader;