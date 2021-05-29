const quizList = require('../models/quizList');
const quizQue = require('../models/quiz');
const studentList = require('../models/student');
const { generatePassword } = require('../util/generation');
const mongoose = require('mongoose');
const AppError = require('../util/appErrors');

exports.createQuiz = async (req, res, next) => {
  const quizId = req.body.quizId;
  let checkIt = await quizList.findOne({ quizId: quizId });
  if (checkIt) return next(new AppError('Quiz Already Created', 401));
  const newQuiz = new quizList(req.body);
  await newQuiz.save();
  res.send({
    result: 'Quiz Created'
  });
};

exports.addQuestion = async (req, res, next) => {
  //mongodb connection
  const db = mongoose.connection;
  const questionId = req.body.questionId;
  const quizId = req.body.quizId;
  //verifying that the "QuizId" is created or not.
  let quizInList = await quizList.findOne({ quizId: quizId });
  if (!quizInList) return next(new AppError('No Such Quiz is presented', 404));
  //verifying quizId Named Collection is present or not.
  const quizColl = req.body.quizId + '-quiz';
  let checkQuizColl = await db
    .collection(quizColl)
    .findOne({ questionId: questionId });
  if (checkQuizColl) {
    return next(new AppError('This Question is Already Added', 401));
  }
  //Inserting this question to specified Quiz Collection in database.
  const newQuestion = new quizQue({
    questionId: questionId,
    question: req.body.question,
    options: [
      {
        a: req.body.optionA,
        b: req.body.optionB,
        c: req.body.optionC,
        d: req.body.optionD
      }
    ],
    answer: req.body.answer,
    marks: req.body.marks
  });
  await db.collection(quizColl).insertOne(newQuestion, function (err, saved) {
    if (err) {
      return next(new AppError('Some Error Occured', 401));
    } else {
      return res.send({ result: 'Question Added' });
    }
  });
};

exports.registerStudent = async (req, res, next) => {
  const enroll = req.body.studentEnroll;
  let student = await studentList.findOne({ studentEnroll: enroll });
  if (student) return next(new AppError('Student Already Registered', 401));
  var generate = await generatePassword();
  const newStudent = new studentList(req.body);
  newStudent.password = generate.password;
  let saveIt = await newStudent.save();
  if (!saveIt) {
    return next(new AppError('Some Error Occured', 403));
  } else {
    res.send({
      result: 'Student Added',
      msg: `Provide this Credentials to Student for Login and Appearing Test 
                                      , Do not share this with other that student`,
      credentials:
        `Login = ` +
        saveIt.studentEnroll +
        `,Password(8 Character) = ` +
        generate.key
    });
  }
};
