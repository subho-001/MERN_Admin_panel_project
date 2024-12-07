const express = require('express')
const {body, validationResult} = require('express-validator');//This is part of the express-validator library, used to validate request data(e.g., validating from inputs).
//The body method specifies validation rules for incoming data in the request body.
const {registerEmployee, loggedInEmployee, createEmployee, editEmployee, deleteEmployee} = require('../controllers/employees.controller')

const authenticateToken = require('../middleware/authenticateToken');
const multer = require('multer');
const { CreateEmployee } = require('../models/employees.model');
const router = express.Router();

router.use(express.json())
router.use(express.urlencoded({extended:true}))


const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/'); //save files in an "uploads" folder
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname);
    }
});

const upload = multer({storage});

//Validation Rules
const validateEmployee = [
    body('name').isLength({min:2}).withMessage('Name must have at least 2 character'),
    body('email').isEmail().withMessage('Invalid email format'),
    body('mobile').matches(/^[6-9]\d{9}$/).withMessage('Invalid mobile number'),
    body('password').matches(/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/).withMessage('Password must be strong (8+ characters, upper & lowercase, number, special character)')
]

const validateLogin = [
    body('usernameOrEmail').notEmpty().withMessage('Username or Email is required'),
    body('password').notEmpty().withMessage('Password is required')
]

const validateCreateEmployee = [
    body('name')
        .matches(/^[a-zA-Z]{2,}(?: [a-zA-Z]{2,})*$/)
        .withMessage('Name must have at least 2 characters and contain only letters'),
    body('email').isEmail().withMessage('Invalid email format'),
    body('mobile')
        .matches(/^[6-9]\d{9}$/)
        .withMessage('Mobile number must start with 6-9 and have 10 digits'),
    body('designation')
        .notEmpty()
        .withMessage('Designation is required'),
    body('gender')
        .isIn(['Male', 'Female'])
        .withMessage('Gender must be either Male or Female'),
        body('courses')
        .isArray({ min: 1 }).withMessage('Courses must include at least one course')
        .bail() // stop further validation if the above fails
        .customSanitizer((value) => {
          // Ensure the value is always an array if it's a string or single course
          return Array.isArray(value) ? value : [value];
        }),
    body('profilePic')
        .custom((value, { req }) => req.file)
        .withMessage('Profile picture is required')
]

const handleValidationErrors = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            error: true,
            message: 'Validation failed',
            errors: errors.array()
        });
    }
    next();
};



//Define routes
router.post('/signup',
    validateEmployee,               //validation rules
    registerEmployee               //controller logic
)

router.post('/login',validateLogin, loggedInEmployee)

router.post('/create_emp', upload.single('profilePic'),(req,res,next)=>{
    console.log('request body', req.body);
    console.log('request file', req.file);
    next();
}, validateCreateEmployee,
handleValidationErrors, createEmployee)

router.get('/get_all_employees', async (req,res)=>{
    try{
        const employees = await CreateEmployee.find();

        // const formattedEmployees = employees.map(emp => ({
        //     ...emp._doc,
        //     courses: emp.courses.join(", "), // Convert array to string
        // }));
        
        res.status(200).json({error:false, employees})
    } catch(err) {
        res.status(500).json({error:true, message:err.message})
    }
})

router.get('/get_employee/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const employee = await CreateEmployee.findById(id);
        if (!employee) {
            return res.status(404).json({ error: true, message: 'Employee not found' });
        }
        res.status(200).json({ error: false, employee });
    } catch (err) {
        res.status(500).json({ error: true, message: err.message });
    }
});

router.put('/edit_employee/:id', editEmployee);
router.delete('/delete_employee/:id', deleteEmployee);

module.exports = router;

