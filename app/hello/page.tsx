'use client'
import React from 'react';
import Dock from '@/components/Dock';
import {
  Home,
  Archive,
  Chat,
  Bitcoin
} from '@nsmr/pixelart-react';

const items = [
  { icon: <Home size={20} className='text-white'/>,    label: 'Home',     onClick: () => alert('Home!') },
  { icon: <Archive size={20} className='text-white'/>, label: 'Archive',  onClick: () => alert('Archive!') },
  { icon: <Chat size={20} className='text-white'/>, label: 'Profile',  onClick: () => alert('Profile!') },
  { icon: <Bitcoin   size={20} className='text-white'/>,label: 'Settings', onClick: () => alert('Settings!') },
];

const Hello = () => {
  return (
    <Dock 
      items={items}
      panelHeight={72}
      baseItemSize={50}
      magnification={70}
    />
  )
}

export default Hello