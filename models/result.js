const mongoose = require('mongoose');

const studentResult = new mongoose.Schema({
  studentEnroll: {
    type: String
  },
  studentName: {
    type: String
  },
  class: {
    type: String
  },
  testAppeared: {
    type: String
  },
  quesAtempt: [
    {
      queId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'student'
      },
      ansSubmitted: {
        type: String
      }
    }
  ],
  totalMarkScore: {
    type: String
  },
  dateOfTest: {
    type: Date,
    default: Date.now()
  }
});

module.exports = mongoose.model('studentResult', studentResult);
