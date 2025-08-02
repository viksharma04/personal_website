'use client';
import React, { createContext, useContext, useState, ReactNode } from 'react';

interface LampContextType {
  isLampOn: boolean;
  toggleLamp: () => void;
}

const LampContext = createContext<LampContextType | undefined>(undefined);

export const useLamp = () => {
  const context = useContext(LampContext);
  if (!context) {
    throw new Error('useLamp must be used within a LampProvider');
  }
  return context;
};

interface LampProviderProps {
  children: ReactNode;
}

export const LampProvider: React.FC<LampProviderProps> = ({ children }) => {
  const [isLampOn, setIsLampOn] = useState(true);

  const toggleLamp = () => {
    setIsLampOn(prev => !prev);
  };

  return (
    <LampContext.Provider value={{ isLampOn, toggleLamp }}>
      {children}
    </LampContext.Provider>
  );
};