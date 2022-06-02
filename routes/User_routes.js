const express = require('express');

const {
  protectAccountOwner,
  protectAdmin,
  protectToken,
  userExists,
} = require('../middlewares/User_middlewares');

const {
  checkValidations,
  createUserValidations,
} = require('../middlewares/Validations_middlewares');

const {
  createUser,
  deleteUser,
  getAllUserOrders,
  getAllUserProducts,
  getOrderById,
  loginUser,
  updateUser,
} = require('../controllers/Users_controller');

const { orderExists } = require('../middlewares/Order_middlewares');

const router = express.Router();

router.post('/', createUserValidations, checkValidations, createUser);
router.post('/login', loginUser);

router.use(protectToken);

router.get('/me', getAllUserProducts);
router
  .route('/:id')
  .patch(userExists, protectAccountOwner, updateUser)
  .delete(userExists, protectAccountOwner, deleteUser);

router.get('/orders', getAllUserOrders);
router.get('/orders/:id', orderExists, getOrderById);

module.exports = { usersRouter: router };
