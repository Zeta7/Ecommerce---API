const { Product } = require('../models/Product_model');
const { catchAsync } = require('../utils/CatchAsync');
const { AppError } = require('../utils/AppError');

//------------------- product exist --------------------------------
const productExists = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  const product = await Product.findOne({
    where: { id, status: 'active' },
  });

  if (!product) {
    return next(new AppError('Product does not exist with given Id', 404));
  }

  req.product = product;
  next();
});

//----------------------- protect product owner ------------------------------
const protectProductOwner = catchAsync(async (req, res, next) => {
  const { sessionUser } = req;
  const { product } = req;
  if (product.userId !== sessionUser.id) {
    return next(new AppError('You do not own this account', 403));
  }
  next();
});

module.exports = { productExists, protectProductOwner };
