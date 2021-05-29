const express = require('express');
const router = express.Router();
const auth = require('../util/middlewareAuth');

const studentController = require('../controller/student.controller');

router.post('/login', studentController.login);

router.get('/testlist', auth, studentController.getTests);

router.get('/select-test', auth, studentController.selectedTest);

router.post('/submit-test', auth, studentController.submitTest);

module.exports = router;
