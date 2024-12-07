import React from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import EmpList from './EmpList';
import Logout from './Logout';
import Navbar from './Navbar';
import Home from './Home';

function Dashboard() {
  return (
      <>
      <Navbar/>
        <Routes>
          <Route index element={<Home/>}/>

          <Route path='home' element={<Home/>}/>

          <Route path='emplist' element={<EmpList/>}/>
          <Route path='logout' element={<Logout/>}/>

        </Routes>
      </>
  )
}

export default Dashboard
