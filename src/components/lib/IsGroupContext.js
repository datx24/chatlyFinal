import React, { createContext, useState } from 'react';

export const IsGroupContext = createContext();

export const IsGroupProvider = ({ children }) => {
  const [isGroup, setIsGroup] = useState(true);


  return (
    <IsGroupContext.Provider valueC={{isGroup, setIsGroup}}>
      {children}
    </IsGroupContext.Provider>
  );
};