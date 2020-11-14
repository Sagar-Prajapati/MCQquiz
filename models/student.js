const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const student = new mongoose.Schema({
    studentEnroll:{
        type:String,
        unique:true
    },
    studentName:{
        type:String
    },
    studentGender:{
        type:String
    },
    studentClass:{
        type:String
    },
    studentEmail:{
        type:String
    },
    studentContact:{
        type:String,
        minlength:10,
        maxlength:10        
    },
    password:{
        type:String
    }
});

student.methods.generateAuthToken = function(){
    const token = jwt.sign(
        {
        studentEnroll:this.studentEnroll,
        studentName:this.studentName,
        studentClass:this.studentClass
       },process.env.JWT_PRIVATE_KEY);
       return token;
}


student.methods.checkPassword = async function(reqPassword,hisPassword)
{
    return await bcrypt.compare(reqPassword,hisPassword);
};


module.exports = mongoose.model("student",student);

