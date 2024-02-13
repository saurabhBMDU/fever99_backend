// responseHandler.js
export default function responseHandler(req, res, next) {
  // Function to handle successful responses
  res.success = function (data, message = 'Success!') {
    res.status(200).json({
      status: true,
      message: message,
      data,
    });
  };

  // Function to handle error responses
  res.error = function (message, errors, status = 500) {
    res.status(status).json({
      status: false,
      message: message,
      errors: errors
    });
  };

  next();
}

// module.exports = responseHandler;