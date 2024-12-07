const express = require("express")//node js framework for building web server and APIs

// const bodyParser = require('body-parser')//middleware to parsing incoming request bodies. This is used to access req.body in routes.
const cors = require('cors');//Middleware that allows cross-origin request. Necessary for enabling the frontend to communicate with the backend

const employeeRoutes = require('./routers/employees.routes')

const connectDB = require('./helpers/dbConnect')

const dotenv = require('dotenv');

dotenv.config()//load .env file

const path = require('path');

//Initialize app
const app = express();
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

//Middleware
app.use(cors())//enables Cross-Origin Resource Sharing (CORS),which allow the backend server to handle the request from a different domain or port.

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

//Routes
app.use('/api', employeeRoutes);

//global middleware to unhandled error
app.use((err,req,res,next)=>{
    res.status(500).json({error:true, message:err.message})
})


app.get('/',(req,res)=>res.send('Server is running'));

//MongoDB connection
let startServer =async()=>{
    try{
        await connectDB(process.env.MONGO_URL)
        console.log("mongodb connected");
        app.listen(process.env.PORT,()=>{
            console.log(`server is runing on port ${process.env.PORT}`);
        })
    } catch(err) {
        console.log("failed to connect to the database",err);   
    }
}

startServer()
