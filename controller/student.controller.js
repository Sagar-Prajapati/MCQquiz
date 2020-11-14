const mongoose = require('mongoose');
const quizList = require('../models/quizList');
const studentList = require('../models/student');
const AppError = require('../util/appErrors');

exports.login = async(req,res,next)=>{
    const {enroll,password}=req.body;
    if(!enroll||!password){
        return next(new AppError("Please provide Enroll & password",400)); 
    }
    const student = await studentList.findOne({studentEnroll:enroll});
    if(!student){
        return next(new AppError("Not a registred Student",401));
    }
    if(!(await student.checkPassword(password,student.password) ))
    {
        return next(new AppError("Incorrect Password",401));
    }
    const token = student.generateAuthToken();
    res.header("x-auth-token",token).status(200).json({
        status:"Logged In Succesfull,You can take test now"
    });
};

exports.getTests = async(req,res,next)=>{
    const studentClass = req.user.studentClass;
    var getList = await quizList.find({createdFor:studentClass});
    if(!getList) next(new AppError("No Test Schedule for your Class",401));
    res.send({result:"Your Can Appear for This All Tests,Select Any One",getList});
};

exports.selectedTest = async(req,res,next)=>{
    const db = mongoose.connection;
    const quizId = req.body.quizId+"-quiz";
    testQuestion = [];
    await db.collection(quizId).find().toArray(function(err,result2){ 
        if(err) return next(new AppError("No Question Created Yet",401));
        result2.forEach(element=>{
            testQuestion.push(data2);
        })  
        res.send({result:"Attempt All Questions",testQuestion});
    });
};




