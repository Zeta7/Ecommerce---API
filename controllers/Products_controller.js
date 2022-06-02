const { catchAsync } = require('../utils/CatchAsync');
const { Product } = require('../models/Product_model');
const { Category } = require('../models/Category_model');

//--------------------------- create Product ----------------------
const createProduct = catchAsync(async (req, res, next) => {
  const { title, description, price, quantity } = req.body;

  const newProduct = await Product.create({
    title,
    description,
    price,
    quantity,
  });
  res.status(201).json({ status: 'success', newProduct });
});

//------------------------ get all products -------------------------
const getAllProducts = catchAsync(async (req, res, next) => {
  const products = await Product.findAll({ where: { status: 'active' } });

  res.status(200).json({
    products,
  });
});

//----------------------- get product by id -------------------------
const getProductById = catchAsync(async (req, res, next) => {
  const { product } = req; //product exist
  response.status(200).json(product);
});

//---------------------- update Product ------------------------------
const updateProduct = catchAsync(async (req, res, next) => {
  const { product } = req; //product exist
  const { title, description, price, quantity } = req.body;
  const updateProd = await product.update({
    title,
    description,
    price,
    quantity,
  });
  res.status(200).json({ status: 'success', updateProd });
});

//---------------------- dissabel product -------------------------------
const deleteProduct = catchAsync(async (req, res, next) => {
  const { product } = req; //product exist
  await product.update({ status: 'deleted' });

  res.status(200).json({
    status: 'success',
  });
});

//------------------------ get all categorys -------------------------
const getAllCategories = catchAsync(async (req, res, next) => {
  const categorys = await Category.findAll({ where: { status: 'active' } });
  res.status(200).json({
    categorys,
  });
});

//---------------------- create new category -----------------------------
const createNewCategory = catchAsync(async (req, res, next) => {
  const { name } = req.body;
  const newCategory = await Product.create({
    name,
  });
  res.status(201).json({ status: 'success', newCategory });
});

//----------------------- update category -------------------------
const updateCategory = catchAsync(async (req, res, next) => {
  const { category } = req; //product exist
  const { name } = req.body;
  const upCategory = await category.update({
    name,
  });
  res.status(200).json({ status: 'success', upCategory });
});

module.exports = {
  createProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct,
  getAllCategories,
  createNewCategory,
  updateCategory,
};
