const CustomError = require("../utils/CustomError");

const handleValidationError = (error) => {
    let errArray = Object.values(error.errors);
    let message = errArray.map((err) => err.message).join(",");
    return new CustomError(400, message);
}

const handleDuplicateError = (error) => {
    let msg = `this ${error.keyValue.email} already exists`
    return new CustomError(400, msg);
}

const handleExpiredTokeError = (error) => {
    return new CustomError(401, 'session expired, please login again')
}

const handleJsonWebTokenError = (error) => {
    return new CustomError(401, 'you\'re not authorized to access this page')
}

const handleCastError = (error) => {
    return new CustomError(400, `${error.value} is not a proper Id for a product`)
}

const devError = (res, error) => {
    res.status(error.statusCode).json({
        status: error.status,
        message: error.message,
        stackTrace: error.stack,
        error: error
    })
};

const prodError = (res, error) => {
    if (error.isOperational == true) {
        res.status(error.statusCode).json({
            status: error.status,
            message: error.message
        })
    } else {
        res.status(error.statusCode).json({
            status: 'error',
            message: 'something went wrong'
        })
    }
};

module.exports = (error, req, res, next) => {
    error.statusCode = error.statusCode || 500;
    error.status = error.status || 'error';
    if (process.env.NODE_ENV === 'development') {
        devError(res, error);
    }

    if (process.env.NODE_ENV === 'production') {
        if (error.name === "ValidationError") {
            error = handleValidationError(error);
        }

        // console.log(error);

        if (error.code === 11000) {
            error = handleDuplicateError(error);
        }

        if (error.name === 'TokenExpiredError') {
            error = handleExpiredTokeError(error);
        }

        if (error.name === 'JsonWebTokenError') {
            error = handleJsonWebTokenError(error);
        }

        if (error.name === 'CastError') {
            error = handleCastError(error);
        }

        prodError(res, error);
    }
}