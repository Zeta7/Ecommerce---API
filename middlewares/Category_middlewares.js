const { Category } = require('../models/Category_model');
const { catchAsync } = require('../utils/CatchAsync');
const { AppError } = require('../utils/AppError');

//------------------- category exist --------------------------------
const CategoryExists = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  const category = await Category.findOne({
    where: { id, status: 'active' },
  });

  if (!category) {
    return next(new AppError('Category does not exist with given Id', 404));
  }

  req.category;
  next();
});

module.exports = { CategoryExists };
