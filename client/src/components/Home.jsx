import React from 'react'
import { Typography, Box } from '@mui/material';

function Home() {
  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
      <Typography variant="h3" component="h1" gutterBottom>
        Welcome to the Dashboard
      </Typography>
    </Box>
  )
}

export default Home;
