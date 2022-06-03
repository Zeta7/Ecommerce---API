const express = require('express');

// Controllers
const {
  addProductToCart,
  getUserCart,
  purchaseCart,
  removeProductFromCart,
  updateProductInCart,
} = require('../controllers/Orders_controller');

// Middlewares
const { protectToken } = require('../middlewares/User_middlewares');

const router = express.Router();

router.use(protectToken);

router.get('/', getUserCart);

router.post('/add-product', addProductToCart);

router.patch('/update-cart', updateProductInCart);

router.post('/purchase', purchaseCart);

router.delete('/:productId', removeProductFromCart);

module.exports = { cartRouter: router };
