const mongoose = require('mongoose');

const QuizQuestion = new mongoose.Schema({
  questionId: {
    type: String
  },
  question: {
    type: String
  },
  options: [
    {
      a: { type: String },
      b: { type: String },
      c: { type: String },
      d: { type: String }
    }
  ],
  answer: {
    type: String
  },
  marks: {
    type: Number
  }
});

module.exports = mongoose.model('Quiz', QuizQuestion);
