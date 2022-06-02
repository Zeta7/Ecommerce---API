const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');
const jwt = require('jsonwebtoken');
const { User } = require('../models/user.model');
const { Product } = require('../models/Product_model');
const { Order } = require('../models/Order_model');
const { catchAsync } = require('../utils/catchAsync');
const { AppError } = require('../utils/AppError');

dotenv.config({ path: '../config.env' });

//-------------------- get all users -------------------------------
/*
const getAllUsers = catchAsync(async (req, res, next) => {
  const users = await User.findAll({ attributes: { exclude: ['password'] } });

  res.status(200).json({
    users,
  });
});
*/

//--------------------------- create users ----------------------
const createUser = catchAsync(async (req, res, next) => {
  const { userName, email, password, role } = req.body;

  const salt = await bcrypt.genSalt(12);
  const hashPassword = await bcrypt.hash(password, salt);

  const newUser = await User.create({
    userName,
    email,
    password: hashPassword,
    role: role || 'client',
  });
  newUser.password = undefined;
  res.status(201).json({ status: 'success', newUser });
});

//--------------------- Login user ------------------------------
const loginUser = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  const user = await User.findOne({ where: { email, status: 'active' } });

  if (!user || !(await bcrypt.compare(password, user.password))) {
    return next(new AppError('Invalid credentials', 400));
  }

  const token = await jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });

  user.password = undefined;
  res.status(200).json({ token, user });
});

//-------------------- get products user -----------------------------
const getAllUserProducts = catchAsync(async (req, res, next) => {
  const { sessionUser } = req; // user logger
  const products = await Product.findAll({ where: { userId: sessionUser.id } });

  res.status(200).json({
    products,
  });
});

//---------------------- update user ------------------------------
const updateUser = catchAsync(async (req, res, next) => {
  const { user } = req; //user exist
  const { userName, email } = req.body;
  await user.update({ userName, email });
  res.status(200).json({ status: 'success' });
});

//---------------------- dessable user -------------------------------
const deleteUser = catchAsync(async (req, res, next) => {
  const { user } = req; //user exist
  await user.update({ status: 'deleted' });

  res.status(200).json({
    status: 'success',
  });
});

//------------------------- get order by Id -----------------------------
const getAllUserOrders = catchAsync(async (req, res, next) => {
  const { sessionUser } = req; // user logger
  const orders = await Order.findAll({
    where: { userId: sessionUser.id, status: 'purchased' },
  });

  res.status(200).json({
    orders,
  });
});

//------------------------- get order by Id -----------------------------
const getOrderById = catchAsync(async (req, res, next) => {
  const { sessionUser } = req; // user logger
  const order = await Order.findOne({
    where: { userId: sessionUser.id, status: 'purchased' },
  });

  res.status(200).json({
    order,
  });
});

module.exports = {
  createUser,
  updateUser,
  deleteUser,
  loginUser,
  getAllUserProducts,
  getAllUserOrders,
  getOrderById,
};
