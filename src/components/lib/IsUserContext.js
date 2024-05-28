import React, { createContext, useState } from 'react';

export const IsUserContext = createContext();

export const IsUserProvider = ({ children }) => {
  const [isUser, setIsUser] = useState(true);


  return (
    <IsUserContext.Provider value={{isUser, setIsUser}}>
      {children}
    </IsUserContext.Provider>
  );
};