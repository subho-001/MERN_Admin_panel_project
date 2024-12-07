import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Typography, CircularProgress, Box } from '@mui/material';

function Logout() {
  const navigate = useNavigate();

  useEffect(() => {
    // Remove the token from localStorage and redirect to the home page
    localStorage.removeItem('token');
    navigate('/');
  }, [navigate]);

  return (
    <Box
      display="flex"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
      height="100vh"
    >
      <Typography variant="h4" gutterBottom>
        Logging Out...
      </Typography>
      <CircularProgress />
    </Box>
  );
}

export default Logout;
