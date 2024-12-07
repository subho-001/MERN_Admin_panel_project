const mongoose = require('mongoose')

//employee schema
const employeeSchema = new mongoose.Schema({
    name:{type:String, required:true},
    email:{type:String, unique:true},
    mobile:{type:String,required:true},
    password:{type:String,required:true}
},{timestamps:true})

//new employee schema
const createEmployeeSchema = new mongoose.Schema({
    name:{type:String, required:true},
    email:{type:String, reuired:true, unique:true},
    mobile:{type:String,required:true},
    designation:{type:String, required:true},
    gender:{type:String, required:true},
    profilePic:{type:String},
    courses:[{type:String}],
},{timestamps:true})

const Employee = mongoose.model('Employee', employeeSchema);

const CreateEmployee = mongoose.model('CreateEmployee',createEmployeeSchema);

module.exports = {
    Employee,
    CreateEmployee
}
