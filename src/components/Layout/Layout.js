import React from 'react'
import { Menu } from '../Menu';

export const Layout = ({ children }) => {
  return (
    <>
      <Menu />
      {children}
    </>
  );
}