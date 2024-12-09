import axios from 'axios';
import React from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { TextField, Button, Box, Typography, Grid } from '@mui/material';
import Header from './Header';

function Signup() {
  let isValidName = /^[a-zA-Z]{2,}(?: [a-zA-Z]{2,})*$/;
  let isValidEmail = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  let isValidMobile = /^[6-9]\d{9}$/;
  let isValidPassword = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

  const { register, handleSubmit, formState: { errors }, reset } = useForm();
  const navigate = useNavigate();

  const submittingData = async (data) => {
    console.log(data);
    try {
      const response = await axios.post('http://localhost:5000/api/signup', data, {
        headers: { 'Content-Type': 'application/json' }
      });

      if (response.status === 200) {
        alert('Employee registered successfully!');
        navigate('/');
      }
    } catch (error) {
      if (error.response) {
        console.error("Error Response", error.response.data);
        alert(error.response.data.message || 'Failed to register employee.');
      } else if (error.request) {
        console.error("No Response:", error.request);
        alert('Failed to connect to the server');
      } else {
        console.error("Error:", error.message);
        alert('An unexpected error occurred');
      }
    }
  }

  return (
    <div>
      <Header pageName="SignUp Page" />
      <Box sx={{ maxWidth: 500, margin: 'auto', padding: 2 }}>
        <Typography variant="h4" gutterBottom>Register Form</Typography>

        <form encType="multipart/form-data" onSubmit={handleSubmit(submittingData)}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Name"
                variant="outlined"
                placeholder="Enter employee name"
                {...register("name", {
                  required: { value: true, message: "*Employee name is required" },
                  pattern: { value: isValidName, message: "*Enter a valid name" }
                })}
                error={Boolean(errors.name)}
                helperText={errors.name?.message}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Email"
                variant="outlined"
                placeholder="Enter employee email"
                {...register("email", {
                  required: { value: true, message: "*Employee email id is required" },
                  pattern: { value: isValidEmail, message: "*Enter a valid email id" }
                })}
                error={Boolean(errors.email)}
                helperText={errors.email?.message}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Mobile No."
                variant="outlined"
                placeholder="Enter employee mobile number"
                {...register("mobile", {
                  required: { value: true, message: "*Mobile number is required" },
                  pattern: { value: isValidMobile, message: "*Enter a 10 digit valid mobile number" }
                })}
                error={Boolean(errors.mobile)}
                helperText={errors.mobile?.message}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Create a password"
                variant="outlined"
                type="password"
                placeholder="Set a password"
                {...register("password", {
                  required: { value: true, message: "*Password is required" },
                  pattern: { value: isValidPassword, message: "*Set a strong 8 character password" }
                })}
                error={Boolean(errors.password)}
                helperText={errors.password?.message}
              />
            </Grid>

            <Grid item xs={12}>
              <Button variant="contained" color='success' type="submit" fullWidth>Submit</Button>
            </Grid>
          </Grid>
        </form>

        <Box sx={{ marginTop: 2, textAlign: 'center' }}>
          <Typography variant="body2">
            If you already have an account, <a href="/">Login here</a>
          </Typography>
        </Box>
      </Box>
    </div>
  )
}

export default Signup;
