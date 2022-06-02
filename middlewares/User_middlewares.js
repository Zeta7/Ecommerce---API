const jwt = require('jsonwebtoken');

const { User } = require('../models/User_model');
const { catchAsync } = require('../utils/CatchAsync');
const { AppError } = require('../utils/AppError');

//-------------- protect token -----------------------------------
const protectToken = catchAsync(async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return next(new AppError('Sesion invalid', 403));
  }

  const decoded = await jwt.verify(token, process.env.JWT_SECRET);

  const user = await User.findOne({
    where: { id: decoded.id, status: 'active' },
  });

  if (!user) {
    return next(
      new AppError('The owner of this token is no longer avvalible', 403)
    );
  }

  req.sessionUser = user;
  next();
});

//------------------- protect admin -----------------------------------
const protectAdmin = catchAsync(async (req, res, next) => {
  if (req.sessionUser.role !== 'admin') {
    return next(new AppError('Access not granted', 403));
  }
  next();
});

//------------------- user exist --------------------------------
const userExists = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  const user = await User.findOne({
    where: { id, status: 'active' },
    attributes: { exclude: ['password'] },
  });

  if (!user) {
    return next(new AppError('User does not exist with given Id', 404));
  }
  // Add user data to the req object
  req.user = user;
  next();
});

//------------------- protect acount owner --------------------------------
const protectAccountOwner = catchAsync(async (req, res, next) => {
  const { user, sessionUser } = req;
  if (user.id !== sessionUser.id) {
    return next(new AppError('You do not own this account', 403));
  }
  next();
});

module.exports = {
  userExists,
  protectToken,
  protectAdmin,
  protectAccountOwner,
};
