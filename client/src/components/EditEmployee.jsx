import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { TextField, Button, Box, Typography, Grid, MenuItem, Select, InputLabel, FormControl } from '@mui/material';
import Header from './Header';

function EditEmployee() {
    const [employee, setEmployee] = useState({});
    const [loading, setLoading] = useState(true);
    const { id } = useParams();  // Get the employee ID from the URL
    const navigate = useNavigate();

    useEffect(() => {
        const fetchEmployee = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/api/get_employee/${id}`);
                setEmployee(response.data.employee);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching employee data:', error);
            }
        };
        fetchEmployee();
    }, [id]);

    const handleChange = (e) => {
        setEmployee({
            ...employee,
            [e.target.name]: e.target.value,
        });
    };

    const handleCoursesChange = (e) => {
        const value = e.target.value.split(',').map(course => course.trim());
        setEmployee({
            ...employee,
            courses: value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
    
        const updatedData = {
            name: employee.name,
            email: employee.email,
            mobile: employee.mobile,
            designation: employee.designation,
            gender: employee.gender,
            courses: employee.courses || [],
        };
    
        try {
            const response = await axios.put(
                `http://localhost:5000/api/edit_employee/${id}`,
                updatedData
            );
    
            if (response.status === 200) {
                alert('Employee updated successfully!');
                navigate('/dashboard/emplist'); // Navigate back to employee list
            }
        } catch (error) {
            if (error.response && error.response.data) {
                // Show alert for specific error message
                alert(error.response.data.message);
            } else {
                console.error('Error updating employee:', error);
                alert('An unexpected error occurred. Please try again.');
            }
        }
    };
    
    

    if (loading) return <div>Loading...</div>;

    return (
        <div>
            <Header pageName="Edit Employee Details" />
            <Box sx={{ maxWidth: 600, margin: 'auto', padding: 3 }}>
                <Typography variant="h4" gutterBottom>Edit Employee</Typography>
                <form onSubmit={handleSubmit}>
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Name"
                                name="name"
                                variant="outlined"
                                value={employee.name || ''}
                                onChange={handleChange}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Email"
                                name="email"
                                variant="outlined"
                                type="email"
                                value={employee.email || ''}
                                onChange={handleChange}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Mobile"
                                name="mobile"
                                variant="outlined"
                                value={employee.mobile || ''}
                                onChange={handleChange}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Designation"
                                name="designation"
                                variant="outlined"
                                value={employee.designation || ''}
                                onChange={handleChange}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <FormControl fullWidth variant="outlined">
                                <InputLabel>Gender</InputLabel>
                                <Select
                                    name="gender"
                                    value={employee.gender || ''}
                                    onChange={handleChange}
                                    label="Gender"
                                >
                                    <MenuItem value="">Select Gender</MenuItem>
                                    <MenuItem value="Male">Male</MenuItem>
                                    <MenuItem value="Female">Female</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Courses (comma separated)"
                                name="courses"
                                variant="outlined"
                                value={employee.courses?.join(', ') || ''}
                                onChange={handleCoursesChange}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <Button variant="contained" color="primary" type="submit" fullWidth>
                                Update Employee
                            </Button>
                        </Grid>
                    </Grid>
                </form>
            </Box>
        </div>
    );
}

export default EditEmployee;
