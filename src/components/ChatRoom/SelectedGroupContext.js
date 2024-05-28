import React, { createContext, useState } from 'react';

export const SelectedGroupContext = createContext();

export const SelectedGroupProvider = ({ children }) => {
  const [selectedGroup, setSelectedGroup] = useState(null);

  return (
    <SelectedGroupContext.Provider value={{ selectedGroup, setSelectedGroup }}>
      {children}
    </SelectedGroupContext.Provider>
  );
};
