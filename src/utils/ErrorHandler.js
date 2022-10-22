const { Request, Response } = require('express');
const ApiClientError = require('./ApiClientError');

class ErrorHandler {
  /**
   * Error handler for express
   *
   * @param {ApiClientError} err
   * @param {Request} req
   * @param {Response} res
   * @param {Function} next
   */
  error(err, req, res, next) {
    if (res.headersSent) {
      return next(err);
    }

    const statusCode = err.status ?? 500;

    res.status(statusCode).json({
      message: err.message,
      status_code: statusCode
    });
  }

  /**
   * Throws an exception
   * @param {String} message
   * @param {Number} statusCode
   * @throws {ApiClientError}
   */
  throw(message, statusCode = 400) {
    throw new ApiClientError(message, statusCode);
  }
}

module.exports = new ErrorHandler();