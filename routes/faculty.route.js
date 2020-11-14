const express = require('express');
const router = express.Router();

const facultyController = require('../controller/faculty.controller');

router.post('/createquiz',facultyController.createQuiz);

router.post('/addquestion',facultyController.addQuestion);

router.post('/registerstudent',facultyController.registerStudent);

module.exports = router;