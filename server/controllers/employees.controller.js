const {validationResult} = require('express-validator')//This is a utility from express-validator that gathers any validation errors generated during the validation middleware process in the route.
const mongoose = require('mongoose');
const Models = require('../models/employees.model')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const dotenv = require('dotenv')
dotenv.config() //for loading the env file

const registerEmployee =async(req,res)=>{
    const errors = validationResult(req);
    if(!errors.isEmpty()) {
        return res.status(400).json({errors:errors.array()});
    }

    try {
        const {name, email, mobile, password} = req.body;
    
        let isEmailExist = await Models.Employee.findOne({email});
        if(isEmailExist) {
            return res.status(400).json({message:"Employee is already exist with this Email id! please Login"})
        }

        let isMobileExist = await Models.Employee.findOne({mobile});
        if(isMobileExist) {
            return res.status(400).json({message:"Employee is already exist with this Mobile number! please Login"})
        }

        let salt = await bcrypt.genSalt(10)
        let hashedPassword = await bcrypt.hash(password,salt)

        let employee = await Models.Employee.create({name, email, mobile, password:hashedPassword})

        res.status(200).json({message:'Employee registered successfully', employee})
    } catch(error) {
        res.status(500).json({error:true,message:error.message})
    }
}


let loggedInEmployee = async(req,res)=>{

    //Handle validation error
    const errors = validationResult(req);
    if(!errors.isEmpty()) {
        return res.status(400).json({errors:errors.array()})
    }

    try{
        const {usernameOrEmail, password} = req.body

        //check the username or email is not empty
        if (!usernameOrEmail) {
            return res.status(400).json({ errors: [{ msg: 'Username or Email is required', param: 'name' }] });
        }

        //check if the input is email
        const isEmail = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(usernameOrEmail);

        let isEmployeeExist;

        if(isEmail) {
            // if it is an email, search by email
            isEmployeeExist = await Models.Employee.findOne({email:usernameOrEmail})
        } else {
            // if it is not an email, search by name
            isEmployeeExist = await Models.Employee.findOne({name:usernameOrEmail})
        }

        console.log("request body", req.body);
        
        console.log("Database query result",isEmployeeExist);
        

        if (!isEmployeeExist) {
            return res.status(400).json({ error: true, message: "User does not exist! Please signup first." });
        }

        // if(isEmployeeExist) {
        const isPasswordMatching = await bcrypt.compare(password,isEmployeeExist.password)

        if(!isPasswordMatching) {
            return res.status(400).json({error:true, message:"Invalid Password"})
        }

        const token = jwt.sign({id:isEmployeeExist._id,name:isEmployeeExist.name}, process.env.JWT_SECRET, {expiresIn:'4m'})

        console.log("token: ", token)

        res.status(200).json({error:false, message:"Successfully logged In", token})
        
    } catch(error) {
        console.log(error);
        res.status(500).json({ error: true, message: error.message })
    }
}

const createEmployee =async(req, res)=>{
    try {
        let {name, email, mobile, gender, designation, courses} =req.body;

        console.log("body", req.body);
        console.log("recieved courses", courses);

        if (!courses || courses.length === 0) {
            return res.status(400).json({ message: 'Courses must include at least one course' });
          }
        
        
        // const courses = req.body.courses ? (Array.isArray(req.body.courses)? req.body.courses : [req.body.courses]) : [];
        console.log(name);

        if(!name || !email || !mobile || !gender || !designation) {
            return res.status(400).json({message:"All fields are required"}) 
        }

        let profilePic = req.file ? req.file.filename : null;

        console.log("file", req.file);
        

        let isEmailExist = await Models.CreateEmployee.findOne({email});

        if(isEmailExist) {
            return res.status(400).json({message:"Employee is already exist with this Email id!"})
        }

        let isMobileExist = await Models.CreateEmployee.findOne({mobile});

        if(isMobileExist) {
            return res.status(400).json({message:"Employee is already exist with this mobile number!"})
        }

        
        let createdEmployee = await Models.CreateEmployee.create({name, email, mobile, profilePic, gender, designation, courses,});
        
        console.log("createEmployee", createdEmployee);
        
        
        res.status(200).json({message:"Employee created successfully", createdEmployee})
        
    } catch(err) {
        res.status(500).json({ error: true, message: err.message });
    }
}

const editEmployee = async (req, res) => {
    try {
        const employeeId = req.params.id;
        const { email } = req.body;

        // Check for duplicate email
        const existingEmployee = await Models.CreateEmployee.findOne({ email });
        if (existingEmployee && existingEmployee._id.toString() !== employeeId) {
            return res.status(400).json({
                error: true,
                message: 'Email already exists for another employee',
            });
        }

        const updatedEmployee = await Models.CreateEmployee.findByIdAndUpdate(
            employeeId,
            req.body,
            { new: true, runValidators: true }
        );

        if (!updatedEmployee) {
            return res.status(404).json({ error: true, message: 'Employee not found' });
        }

        res.status(200).json({
            error: false,
            message: 'Employee updated successfully',
            employee: updatedEmployee,
        });
    } catch (err) {
        if (err.code === 11000) {
            return res.status(400).json({
                error: true,
                message: 'Duplicate key error: Email must be unique',
            });
        }
        res.status(500).json({ error: true, message: 'Server error', details: err.message });
    }
};


// Delete Employee Controller
const deleteEmployee = async (req, res) => {
    try {
        const employeeId = req.params.id;
        console.log("deleting employee with id:", employeeId);

        if (!mongoose.Types.ObjectId.isValid(employeeId)) {
            return res.status(400).json({ error: true, message: 'Invalid employee ID' });
        }
        
        const deletedEmployee = await Models.CreateEmployee.findByIdAndDelete(employeeId);

        if (!deletedEmployee) {
            return res.status(404).json({ error: true, message: 'Employee not found' });
        }

        res.status(200).json({ error: false, message: 'Employee deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: true, message: err.message });
    }
};



module.exports = {registerEmployee, loggedInEmployee, createEmployee, deleteEmployee, editEmployee};
