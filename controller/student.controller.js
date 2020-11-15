const mongoose = require('mongoose');
const quizList = require('../models/quizList');
const studentList = require('../models/student');
const AppError = require('../util/appErrors');
const resultList = require('../models/result');

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
            data2={
                id:element._id,
                question:element.question,
                questionId:element.questionId,
                options:element.options,
                marks:element.marks
            }
            testQuestion.push(data2);
        })  
        res.send({
            result:"You can Shart Test Now, Attempt All Questions",
            testOf:req.body.quizId,
            testQuestion
        });
    });
};

exports.submitTest = async(req,res,next)=>{
    const testOf = req.body.testOf;
    const responds = req.body.respond;
    var calculatedResult = await CalculateResult(responds,testOf);
    const saveTest = new resultList({
        studentEnroll:req.user.studentEnroll,
        studentName:req.user.studentName,
        class:req.user.studentClass,
        testAppeared:testOf,
        totalMarkScore:calculatedResult
    });
    await saveTest.save().then(r=>{
        saveQuestion(r._id,responds);
    })
    res.send({result:"Your Test is Submitted"});
}


function CalculateResult(arrayData,collectionName){
    return new Promise((resolve,reject)=>{
        const db= mongoose.connection;   
        var sumResult = 0;
        var i=0;
           arrayData.forEach(element=>{
               var id = mongoose.Types.ObjectId(element.que_id);
                db.collection(`${collectionName+"-quiz"}`).findOne({_id:id}).then(data1=>{
                 if(element.submitedAns === data1.answer){
                      sumResult = sumResult + parseInt(data1.marks);
                      i++;
                 }
                 else{
                     i++
                }
                 }).then(()=>{
                    if(i==arrayData.length){resolve(sumResult);}
              }).catch(err=>{
                  reject(err);
              });
           });
   });
}
