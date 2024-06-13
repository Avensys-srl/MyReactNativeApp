// src/context/ProfileContext.js

import React, { createContext, useState } from 'react';

export const ProfileContext = createContext();

export const ProfileProvider = ({ children }) => {
  const [isService, setIsService] = useState(false);

  return (
    <ProfileContext.Provider value={{ isService, setIsService }}>
      {children}
    </ProfileContext.Provider>
  );
};
