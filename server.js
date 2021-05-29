const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const AppError = require('./util/appErrors');
const facultyRoute = require('./routes/faculty.route');
const studentRoute = require('./routes/student.route');
const { globalErrorController } = require('./util/errors');

require('dotenv').config();

const app = express();

app.use(express.json());
app.use(cors({ exposedHeaders: 'x-auth-token' }));
app.use('/api/faculty', facultyRoute);
app.use('/api/student', studentRoute);
app.all('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});
app.use(globalErrorController);

console.log('a');

mongoose
  .connect(process.env.DATABASE_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false
  })
  .then(() => {
    app.listen(process.env.PORT);
    console.log('connected at port ' + process.env.PORT);
  })
  .catch(err => {
    console.log(err);
  });
