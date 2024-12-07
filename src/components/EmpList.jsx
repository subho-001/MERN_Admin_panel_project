import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button, TextField, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Box, Grid, Container } from '@mui/material';
// import Navbar from './Navbar';
// import Header from './Header';

function EmpList() {
  const [employees, setEmployees] = useState([])
  const [error, setError] = useState('')
  const navigate = useNavigate()
  const [filteredEmployees, setFilteredEmployees] = useState([])
  const [searchQuery, setSearchQuery] = useState('')

  const fetchEmployees = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/get_all_employees');
      setEmployees(response.data.employees)
      setFilteredEmployees(response.data.employees)
    } catch (err) {
      setError('Failed to fetch employees. Please try again later...');
    }
  }

  useEffect(() => {
    fetchEmployees();
  }, [])

  const handleEmpData = () => {
    navigate('/create_emp');
  }

  const handleEdit = (id) => {
    navigate(`/edit_employee/${id}`)
  }

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this employee?')) {
      try {
        const response = await axios.delete(`http://localhost:5000/api/delete_employee/${id}`)
        if (response.status === 200) {
          setEmployees(employees.filter(emp => emp._id !== id));
          setFilteredEmployees(filteredEmployees.filter(emp => emp._id !== id));
          alert('Employee deleted successfully');
        }
      } catch (err) {
        alert('Failed to delete employee');
      }
    }
  }

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
    const value = e.target.value.trim();

    const filtered = employees.filter((employee, index) => {
      const employeeIndex = (index + 1).toString();
      return (
        employeeIndex.includes(value) ||
        employee.name.toLowerCase().includes(value.toLowerCase()) ||
        employee.email.toLowerCase().includes(value.toLowerCase()) ||
        employee.mobile.toLowerCase().includes(value.toLowerCase()) ||
        employee.designation.toLowerCase().includes(value.toLowerCase()) ||
        employee.gender.toLowerCase().includes(value.toLowerCase()) ||
        employee.courses.join(' ').toLowerCase().includes(value.toLowerCase()) ||
        new Date(employee.createdAt).toLocaleDateString().includes(value)
      );
    });

    setFilteredEmployees(filtered);
  };

  return (
    <>
      {/* <Navbar /> */}
      <Container sx={{ paddingTop: 3 }}>
        {/* Box to align the Employee List title and right-side elements */}
          <Typography variant="h4">Employee List</Typography>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', marginBottom: 2 }}>
          {/* <Header pageName="Employee List" /> */}
          <Grid container spacing={2} justifyContent="flex-end" alignItems="center">
            <Grid item>
              <Typography variant="h6">Total Count: {filteredEmployees.length}</Typography>
            </Grid>
            <Grid item>
              <Button variant="contained" color="primary" onClick={handleEmpData}>
                Create Employee
              </Button>
            </Grid>
          </Grid>
        </Box>

        {/* Search Employee Bar */}
        <Grid container spacing={2} sx={{ marginBottom: 2 }} justifyContent="flex-end">
          <Grid item xs={12} sm={6} md={4}>
            <TextField
              fullWidth
              label="Search Employees"
              variant="outlined"
              value={searchQuery}
              onChange={handleSearch}
            />
          </Grid>
        </Grid>

        {/* Display Error if any */}
        {error && <Typography color="error">{error}</Typography>}

        {/* Employee List Table */}
        {filteredEmployees.length > 0 ? (
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>ID</TableCell>
                  <TableCell>Profile Picture</TableCell>
                  <TableCell>Name</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell>Mobile</TableCell>
                  <TableCell>Designation</TableCell>
                  <TableCell>Gender</TableCell>
                  <TableCell>Courses</TableCell>
                  <TableCell>Create Date</TableCell>
                  <TableCell>Action</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredEmployees.map((employee, index) => (
                  <TableRow key={employee._id}>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>
                      {employee.profilePic ? (
                        <img
                          src={`http://localhost:5000/uploads/${employee.profilePic}`}
                          alt="Profile"
                          style={{ width: '50px', height: '50px', borderRadius: '50%' }}
                        />
                      ) : ('No Image')}
                    </TableCell>
                    <TableCell>{employee.name}</TableCell>
                    <TableCell>{employee.email}</TableCell>
                    <TableCell>{employee.mobile}</TableCell>
                    <TableCell>{employee.designation}</TableCell>
                    <TableCell>{employee.gender}</TableCell>
                    <TableCell>{employee.courses.join(', ')}</TableCell>
                    <TableCell>{new Date(employee.createdAt).toLocaleDateString()}</TableCell>
                    <TableCell>
                      {/* Use Box for aligning buttons on the same line */}
                      <Box sx={{ display: 'flex', justifyContent: 'flex-start', gap: 1 }}>
                        <Button variant="outlined" color="primary" onClick={() => handleEdit(employee._id)}>
                          Edit
                        </Button>
                        <Button variant="outlined" color="secondary" onClick={() => handleDelete(employee._id)}>
                          Delete
                        </Button>
                      </Box>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        ) : (
          <Typography variant="body1">No Employees Found.</Typography>
        )}
      </Container>
    </>
  )
}

export default EmpList;
