const { ref, uploadBytes } = require('firebase/storage');

const { catchAsync } = require('../utils/CatchAsync');
const { Product } = require('../models/Product_model');
const { Category } = require('../models/Category_model');
const { ProductImg } = require('../models/ProductImg_model');
const { User } = require('../models/User_model');
const { AppError } = require('../utils/AppError');

const { Storage } = require('../utils/Firebase');

//--------------------------- create Product ----------------------
const createProduct = catchAsync(async (req, res, next) => {
  const { sessionUser } = req; // user logger
  const { title, description, price, quantity, categoryId } = req.body;

  const newProduct = await Product.create({
    title,
    description,
    quantity,
    price,
    categoryId,
    userId: sessionUser.id,
  });

  const imgsPromises = req.files.productImg.map(async img => {
    const imgName = `/img/products/${newProduct.id}-${sessionUser.id}-${img.originalname}`;
    const imgRef = ref(Storage, imgName);

    const result = await uploadBytes(imgRef, img.buffer);

    await ProductImg.create({
      imgUrl: result.metadata.fullPath,
      productId: newProduct.id,
    });
  });

  await Promise.all(imgsPromises);

  res.status(201).json({ status: 'success', data: { newProduct } });
});

//------------------------ get all products -------------------------
const getAllProducts = catchAsync(async (req, res, next) => {
  const products = await Product.findAll({
    where: { status: 'active' },
    include: [
      { model: Category, attributes: ['name'] },
      { model: User, attributes: ['userName', 'email'] },
    ],
  });
  res.status(200).json({ products });
});

//----------------------- get product by id -------------------------
const getProductById = catchAsync(async (req, res, next) => {
  const { product } = req;
  res.status(200).json({ product });
});
//---------------------- update Product ------------------------------
const updateProduct = catchAsync(async (req, res, next) => {
  const { product } = req; //product exist
  const { title, description, price, quantity } = req.body;
  const updateProd = await product.update({
    title,
    description,
    quantity,
    price,
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
  console.log('esta llegando al requerimiento ');
  const categories = await Category.findAll({
    where: { status: 'active' },
  });
  res.status(200).json({ categories });
});

//---------------------- create new category -----------------------------
const createNewCategory = catchAsync(async (req, res, next) => {
  const { name } = req.body;

  if (name.length === 0) {
    return next(new AppError('Name cannot be empty', 400));
  }

  const newCategory = await Category.create({
    name,
  });
  res.status(201).json({ status: 'success', newCategory });
});

//----------------------- update category -------------------------
const updateCategory = catchAsync(async (req, res, next) => {
  const { id } = req.id; //product exist
  const { name } = req.body;

  const category = await Category.findOne({
    where: { id, status: 'active' },
  });

  if (!category) {
    return next(new AppError('Category does not exits with given id', 404));
  }

  if (newName.length === 0) {
    return next(new AppError('The updated name cannot be empty', 400));
  }

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
