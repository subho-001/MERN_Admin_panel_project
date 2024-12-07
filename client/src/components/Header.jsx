import React from 'react';
import { AppBar, Toolbar, Typography, Box } from '@mui/material';

function Header({ pageName }) {
  return (
    <AppBar 
      position="static" 
      sx={{ backgroundColor: '#4caf50', height: 56 }} // Greenish color and reduced height
    >
      <Toolbar sx={{ display: 'flex', alignItems: 'center', minHeight: '56px !important' }}>
        
        <Typography 
          variant="h6" 
          component="div" 
          sx={{ flexGrow: 1, fontSize: '1.25rem' }} // Adjust font size if needed
        >
          {pageName}
        </Typography>
      </Toolbar>
    </AppBar>
  );
}

export default Header;
