const jwt = require('jsonwebtoken');
const User = require('../models/users/users');
const asyncErrorHandler = require('../utils/asyncErrorHandler');
const CustomError = require('../utils/CustomError');

const auth = asyncErrorHandler(async (req, res, next) => {
    let testToken = req.headers.authorization;
    // console.log(testToken);
    let Token;
    if (testToken || testToken.startsWith("Bearer")) {
        Token = testToken.split(" ")[1];
        // console.log(Token);
    }

    //verify token
    const decodedToken = await jwt.verify(Token, process.env.SECRET_STRING);
    // console.log(decodedToken);
    const user = await User.findById(decodedToken.id);
    // console.log(user);
    if (!user) {
        // res.status(400).json({
        //     message: "Please login"
        // })
        let err = new CustomError(400, "Please login");
        next(err)
    }
    req.user = user;
    next();
})

module.exports = auth;