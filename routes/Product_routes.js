const express = require('express');

const {
  createProductValidations,
  checkValidations,
} = require('../middlewares/Validations_middlewares');

const {
  protectAccountOwner,
  protectToken,
} = require('../middlewares/User_middlewares');

const {
  productExists,
  protectProductOwner,
} = require('../middlewares/Product_middlewares');

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

const { multerUpload } = require('../utils/multer');

const router = express.Router();

router.get('/categories', getAllCategories);
router.get('/:id', productExists, getProductById);
router.get('/', getAllProducts);

router.use(protectToken);

router.post(
  '/',
  multerUpload.fields([{ name: 'productImg', maxCount: 2 }]),
  createProductValidations,
  checkValidations,
  createProduct
);

router
  .route('/:id')
  .patch(productExists, protectProductOwner, updateProduct)
  .delete(productExists, protectProductOwner, deleteProduct);

router.post('/categories', createNewCategory);
router.patch('/categories/:id', updateCategory);

module.exports = { productsRouter: router };
