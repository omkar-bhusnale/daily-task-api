function errorHandler(err, req, res, next) {
  console.error('Error:', err);
  res.status(500).json({
    error: 'Internal Server Error',
    details: err.message || err.toString(),
  });
}

module.exports = errorHandler;
