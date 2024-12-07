// Login.js
import React from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { TextField, Button, Typography, Container, Box } from '@mui/material';
import axios from 'axios';
import Header from './Header';
// import Header from './Header'; // Import the Header component

function Login() {
    let navigatetoDashboard = useNavigate();

    let { register, handleSubmit, formState: { errors } } = useForm();

    let submittingData = async (data) => {
        try {
            const response = await axios.post('http://localhost:5000/api/login', {
                usernameOrEmail: data.name,
                password: data.password
            });

            if (response.status === 200) {
                const token = response.data.token; // Assuming the token is returned in 'response.data.token'
                localStorage.setItem('token', token); // Store the token in localStorage
                localStorage.setItem('username', data.name); // Store the username in localStorage
                alert("Login Successful");
                navigatetoDashboard('/dashboard');
            }

        } catch (error) {
            if (error.response) {
                const errorMessage = error.response.data.message || (error.response.data.errors && error.response.data.errors[0]?.msg || "Failed to login.");
                alert(errorMessage);
            } else if (error.request) {
                alert("Failed to connect to the server");
            } else {
                alert("An unexpected error occurred");
            }
        }
    }

    return (
        <div>
            <Header pageName="Login Page" />
            
            <Container component="main" maxWidth="xs" sx={{ mt: 4 }}>
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '20px', boxShadow: 3, borderRadius: 1 }}>
                    <Typography variant="h5" gutterBottom>
                        Login
                    </Typography>
                    <form onSubmit={handleSubmit(submittingData)} style={{ width: '100%' }}>
                        {/* Username / Email */}
                        <TextField
                            id="name"
                            label="Username or Email"
                            type="text"
                            fullWidth
                            margin="normal"
                            {...register("name", {
                                required: { value: true, message: "*Username/Email is required" }
                            })}
                            error={!!errors.name}
                            helperText={errors.name?.message}
                        />
                        
                        {/* Password */}
                        <TextField
                            id="password"
                            label="Password"
                            type="password"
                            fullWidth
                            margin="normal"
                            {...register("password", {
                                required: { value: true, message: "*Password is required" }
                            })}
                            error={!!errors.password}
                            helperText={errors.password?.message}
                        />

                        {/* Submit Button */}
                        <Button type="submit" variant="contained" color="success" fullWidth sx={{ mt: 2 }}>
                            Log In
                        </Button>
                    </form>

                    {/* Sign-up Link */}
                    <Box sx={{ mt: 2, textAlign: 'center' }}>
                        <Typography variant="body2">
                            Don't have an account? <a href="/signup">Sign up here</a>
                        </Typography>
                    </Box>
                </Box>
            </Container>
        </div>
    );
}

export default Login;
