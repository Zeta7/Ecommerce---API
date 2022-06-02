const express = require('express');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const { globalErrorHandler } = require('./controllers/Error_controller');

const { usersRouter } = require('./routes/User_routes');

const app = express();

app.use(cors());

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

//--------------------- limit IP request ----------------------------
const limiter = rateLimit({
  max: 10000,
  windowMs: 60 * 60 * 1000, //1 hr
  message: 'Too many requests from this IP',
});

app.use(limiter);

//-------------------- Endpoints -------------------------
app.use('/api/v1/users', usersRouter);

//Global error handler
app.use('*', globalErrorHandler);

module.exports = { app };
