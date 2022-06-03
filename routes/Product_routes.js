const express = require('express');

const {
  createProductValidations,
  checkValidations,
} = require('../middlewares/Validations_middlewares');

const {
  protectAccountOwner,
  protectToken,
} = require('../middlewares/User_middlewares');

const { productExists } = require('../middlewares/Product_middlewares');

const {
  createNewCategory,
  createProduct,
  deleteProduct,
  getAllCategories,
  getAllProducts,
  getProductById,
  updateCategory,
  updateProduct,
} = require('../controllers/Products_controller');

const router = express.Router();

router.use(protectToken);
router
  .route('/')
  .post(createProductValidations, checkValidations, createProduct)
  .get(getAllProducts);
router
  .route('/:id')
  .get(productExists, getProductById)
  .patch(productExists, protectAccountOwner, updateProduct)
  .delete(productExists, protectAccountOwner, deleteProduct);

router.route('/categories').get(getAllCategories).post(createNewCategory);
router.patch('/categories/:id', updateCategory);

module.exports = { productsRouter: router };
