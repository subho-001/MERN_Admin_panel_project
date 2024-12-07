import React from 'react'
import { NavLink } from 'react-router-dom'
import { AppBar, Toolbar, Button, Typography, Box } from '@mui/material'

function Navbar() {
  const username = localStorage.getItem('username')

  return (
    <AppBar position="sticky" sx={{ backgroundColor: '#4caf50' }}>
      <Toolbar>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
          {/* Left Side: Links */}
          <Box sx={{ display: 'flex', gap: 2 }}>
            <NavLink to="home" style={{ textDecoration: 'none' }}>
              <Button 
                sx={{ 
                  color: '#ffffff', 
                  '&:hover': { 
                    backgroundColor: '#388e3c', // Darker shade of green
                    color: '#ffffff',
                  } 
                }}
              >
                Home
              </Button>
            </NavLink>
            <NavLink to="emplist" style={{ textDecoration: 'none' }}>
              <Button 
                sx={{ 
                  color: '#ffffff', 
                  '&:hover': { 
                    backgroundColor: '#388e3c', // Darker shade of green
                    color: '#ffffff',
                  } 
                }}
              >
                Employee List
              </Button>
            </NavLink>
          </Box>

          {/* Right Side: Welcome Message or Logout */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            {username && (
              <Typography variant="h6" sx={{ color: '#ffffff' }}>
                Welcome, {username}!
              </Typography>
            )}
            <NavLink to="logout" style={{ textDecoration: 'none' }}>
              <Button 
                sx={{ 
                  color: '#ffffff', 
                  '&:hover': { 
                    backgroundColor: '#388e3c', // Darker shade of green
                    color: '#ffffff',
                  } 
                }}
              >
                Logout
              </Button>
            </NavLink>
          </Box>
        </Box>
      </Toolbar>
    </AppBar>
  )
}

export default Navbar
