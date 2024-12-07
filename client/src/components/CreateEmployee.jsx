import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { TextField, Button, FormControl, FormControlLabel, RadioGroup, Radio, Checkbox, FormLabel, Box } from '@mui/material';
import Header from './Header';

function CreateEmployee() {
    const isValidName = /^[a-zA-Z]{2,}(?: [a-zA-Z]{2,})*$/;
    const isValidEmail = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    const isValidMobile = /^[6-9]\d{9}$/;

    const { register, handleSubmit, control, formState: { errors }, setValue } = useForm();
    const navigate = useNavigate();

    const submittingData = async (data) => {
        console.log("Form Data:", data);

        const formData = new FormData();
        formData.append("name", data.name);
        formData.append("email", data.email);
        formData.append("mobile", data.mobile);
        formData.append("designation", data.designation);
        formData.append("gender", data.gender);
        formData.append("profilePic", data.profilePic[0]);

        const selectedCourses = Array.isArray(data.courses) ? data.courses : [data.courses];

        if (selectedCourses.length === 0) {
            alert('Please select at least one course');
            return;
        }

        selectedCourses.forEach(course => formData.append("courses[]", course));

        try {
            const response = await axios.post('http://localhost:5000/api/create_emp', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            if (response.status === 200) {
                alert('Employee details added successfully!');
                navigate('/dashboard/emplist');
            }
        } catch (error) {
            console.error(error);
            alert('An error occurred while submitting the form');
        }
    };

    return (
        <>
            <Header pageName="Create Employee" />
            <Box component="form" onSubmit={handleSubmit(submittingData)} sx={{ maxWidth: 500, margin: 'auto', padding: 2 }}>
                <h2>Create Employee</h2>

                {/* Name Field */}
                <TextField
                    label="Name"
                    fullWidth
                    variant="outlined"
                    margin="normal"
                    {...register("name", {
                        required: { value: true, message: "*Employee name is required" },
                        pattern: { value: isValidName, message: "*Enter a valid name" }
                    })}
                    error={!!errors.name}
                    helperText={errors.name?.message}
                />

                {/* Email Field */}
                <TextField
                    label="Email"
                    fullWidth
                    variant="outlined"
                    margin="normal"
                    {...register("email", {
                        required: { value: true, message: "*Employee email is required" },
                        pattern: { value: isValidEmail, message: "*Enter a valid email ID" }
                    })}
                    error={!!errors.email}
                    helperText={errors.email?.message}
                />

                {/* Mobile Field */}
                <TextField
                    label="Mobile No."
                    fullWidth
                    variant="outlined"
                    margin="normal"
                    {...register("mobile", {
                        required: { value: true, message: "*Mobile number is required" },
                        pattern: { value: isValidMobile, message: "*Enter a 10-digit valid mobile number" }
                    })}
                    error={!!errors.mobile}
                    helperText={errors.mobile?.message}
                />

                {/* Designation Field */}
                <TextField
                    label="Designation"
                    select
                    fullWidth
                    variant="outlined"
                    margin="normal"
                    {...register("designation", {
                        required: { value: true, message: "*Designation is required" }
                    })}
                    error={!!errors.designation}
                    helperText={errors.designation?.message}
                    SelectProps={{
                        native: true,
                    }}
                >
                    <option value="">Select Designation</option>
                    <option value="HR">HR</option>
                    <option value="Manager">Manager</option>
                    <option value="Sales">Sales</option>
                </TextField>

                {/* Gender Field with Controller */}
                <FormControl fullWidth margin="normal" error={!!errors.gender}>
                    <FormLabel>Gender</FormLabel>
                    <Controller
                        name="gender"
                        control={control}
                        rules={{ required: { value: true, message: "*Gender is required" } }}
                        render={({ field }) => (
                            <RadioGroup {...field} row>
                                <FormControlLabel value="Male" control={<Radio />} label="Male" />
                                <FormControlLabel value="Female" control={<Radio />} label="Female" />
                            </RadioGroup>
                        )}
                    />
                    {errors.gender && <div style={{ color: "red" }}>{errors.gender?.message}</div>}
                </FormControl>

                {/* Courses Field */}
                <FormControl fullWidth margin="normal">
                    <FormLabel>Courses</FormLabel>
                    <div>
                        <FormControlLabel
                            control={<Checkbox {...register("courses")} value="MCA" />}
                            label="MCA"
                        />
                        <FormControlLabel
                            control={<Checkbox {...register("courses")} value="BCA" />}
                            label="BCA"
                        />
                        <FormControlLabel
                            control={<Checkbox {...register("courses")} value="BSc" />}
                            label="BSc"
                        />
                    </div>
                    {errors.courses && <div style={{ color: "red" }}>{errors.courses?.message}</div>}
                </FormControl>

                {/* Profile Picture Field */}
                <TextField
                    type="file"
                    fullWidth
                    variant="outlined"
                    margin="normal"
                    {...register("profilePic", {
                        required: { value: true, message: "*Profile picture is required" }
                    })}
                    error={!!errors.profilePic}
                    helperText={errors.profilePic?.message}
                />

                {/* Submit Button */}
                <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    color="primary"
                    sx={{ marginTop: 2 }}
                >
                    Create Employee
                </Button>
            </Box>
        </>
    );
}

export default CreateEmployee;
