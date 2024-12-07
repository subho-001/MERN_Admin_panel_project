import { useState } from 'react'
import './App.css'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Login from './components/Login'
import Signup from './components/Signup'
import Dashboard from './components/Dashboard'
import ProtectedRoute from './components/ProtectedRoute'
import CreateEmployee from './components/CreateEmployee'
import EditEmployee from './components/EditEmployee'

function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login/>}/>
        <Route path="/signup" element={<Signup/>}/>
        <Route 
          path="/dashboard/*" 
          element={
            <ProtectedRoute>
              <Dashboard/>
            </ProtectedRoute>
          }
        />
        <Route path='/create_emp' element={<CreateEmployee/>}/>

        <Route path="/edit_employee/:id" element={<EditEmployee />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
