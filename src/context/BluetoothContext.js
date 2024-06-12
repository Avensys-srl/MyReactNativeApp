import React, { createContext, useState } from 'react';

export const BluetoothContext = createContext();

export const BluetoothProvider = ({ children }) => {
  const [device, setDevice] = useState(null);

  return (
    <BluetoothContext.Provider value={{ device, setDevice }}>
      {children}
    </BluetoothContext.Provider>
  );
};
