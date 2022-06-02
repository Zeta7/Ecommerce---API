const { Order } = require('../models/Order_model');
const { catchAsync } = require('../utils/CatchAsync');
const { AppError } = require('../utils/AppError');

//------------------- order exist --------------------------------
const orderExists = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  const order = await Order.findOne({
    where: { id, status: 'active' },
  });

  if (!order) {
    return next(new AppError('Order does not exist with given Id', 404));
  }

  req.order;
  next();
});

module.exports = { orderExists };
