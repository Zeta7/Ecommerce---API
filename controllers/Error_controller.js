const globalErrorHandler = (error, req, res, next) => {
  const statusCode = error.statusCode || 500;
  const status = error.status || 'fail';

  res.status(statusCode).json({
    status,
    error: error,
    message: error.message,
    stack: error.stack,
  });
};

module.exports = { globalErrorHandler };
