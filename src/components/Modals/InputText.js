import { useState } from 'react';
var nameGroup;
export default function InputText() {
    const [name, setName] = useState("");
  
    nameGroup = name;
    return (
      <form>
       <input 
            style={{position:'relative',left:'0%'}}
            type="text" 
            placeholder='Nhập tên nhóm'
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
      </form>
    )
  }
  export {nameGroup};