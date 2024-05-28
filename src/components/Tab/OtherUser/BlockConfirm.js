import React, { useState } from 'react';
import styled from 'styled-components';

const BlockConfirmStyled = styled.div`
  position: fixed;
  z-index: 1000;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  border: 1px solid black;
  border-radius: 10px;
  width: 90%;
  background-color: white;
  display: flex;
  padding: 5px;
  .blockBtn{
    width: 40%;
    margin: 10px;
    dipslay: flex;
    border-radius: 5px;
    background-color: white;
  }
  h2{
    font-size: 20px;
    margin: 0 10px 0 45px;
  }
  .confirmBtn:hover{
    background-color: #D20F0F;
    color: white;
  }
  .declineBtn:hover{
    background-color: #DBE3E4;
  }
`



const BlockUserModal = ({show, handleClose, handleBlock }) => {
  const [modalOpen, setModalOpen] = useState(show)
  if(!modalOpen) return null;
    return (
      <BlockConfirmStyled>
        <div className="">
          <h2>Bạn có muốn chặn người dùng này?</h2>
          <div className='Btn'>
            <button onClick={handleBlock} style={{marginLeft: '45px'}} className='blockBtn confirmBtn'>Chặn</button>
            <button onClick={() => setModalOpen(false)} style={{margin: '10px 0'}} className='blockBtn declineBtn'>Quay lại</button>
          </div>
        </div>
      </BlockConfirmStyled>
    );
};

export default BlockUserModal;