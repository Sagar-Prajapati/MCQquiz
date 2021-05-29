const mongoose = require('mongoose');

const allQuizList = new mongoose.Schema({
  quizId: {
    type: String,
    unique: true
  },
  quizName: {
    type: String
  },
  quizDesc: {
    type: String
  },
  createdById: {
    type: String
  },
  createdByName: {
    type: String
  },
  createdFor: {
    type: String
  },
  date: {
    type: Date,
    default: Date.now()
  }
});

module.exports = mongoose.model('All_QuizList', allQuizList);
