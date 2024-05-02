const User = require('../models/users/users');
const jwt = require('jsonwebtoken');
const asyncErrorHandler = require('../utils/asyncErrorHandler');
const CustomError = require('../utils/CustomError');
const sendEmail = require('../utils/email');
const crypto = require('crypto');

//To generate token
const genToken = async (id) => {
    return await jwt.sign({ id: id }, process.env.SECRET_STRING, { expiresIn: '1d' });
}

const signup = asyncErrorHandler(async (req, res) => {
    //check for existing user
    const existingUser = await User.findOne({ email: req.body.email });
    // if (existingUser) {
    //     return res.status(400).json({
    //         message: 'email is already used'
    //     })
    // }
    const newUser = await User.create(req.body);
    const token = await genToken(newUser._id);
    res.status(201).json({
        status: "success",
        token,
        data: {
            user: newUser
        }
    })
});

const login = asyncErrorHandler(async (req, res, next) => {
    const { email, password } = req.body
    //check for existing user
    const existingUser = await User.findOne({ email: email });
    // console.log(passwordMatch);
    if (!existingUser) {
        let err = new CustomError(400, 'no user found with this email');
        next(err);
    }

    const passwordMatch = await existingUser.comparePassword(password, existingUser.password);

    if (!passwordMatch) {
        let err = new CustomError(400, 'password did not match');
        next(err);
    }

    //generate token
    const token = await genToken(existingUser._id);

    res.status(200).json({
        status: 'success',
        token,
        data: { user: existingUser }
    })
});

const forgotPassword = async (req, res, next) => {
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
        let err = new CustomError(401, "something went wrong try again")
        next(err)
    }

    let token = await user.resetToken();
    console.log(token);
    await user.save();

    let message = 'click on the below link to reset password , the link is valid for 10 min only';
    let html = `<a>http://127.0.0.1:5000/app/v1/users/resetpassword/${token}</a>`
    let options = {
        userEmail: user.email,
        subject: "reset password",
        text: message,
        html: html
    }

    await sendEmail(options);
    res.status(200).json({
        status: 'success',
        message: 'mail sent successfully'
    });
    // next();
};

const resetPassword = asyncErrorHandler(async (req, res, next) => {
    let token = crypto.createHash('sha256', process.env.SECRET_STRING)
        .update(req.params.token).digest('hex');
    let user = await User.findOne({
        hashedToken: token,
        passwordResetTokenExpiresAt: ({ $gt: Date.now() })
    });

    if (!user) {
        let err = new CustomError(400, 'token is expired or invalid token');
        return next(err);
    }
    user.password = req.body.password;
    user.confirmPassword = req.body.confirmPassword;
    user.passWordChangedAt = Date.now();
    user.passwordResetTokenExpiresAt = undefined;
    user.hashedToken = undefined;

    await user.save();

    res.status(200).json({
        status: 'success',
        message: 'password updated successfully'
    });
});

// const verifyRole = async (role)=>{
//     return (req,res,next)=>{
//         if(!role.includes(req.user.role)){
//            let err = new CustomError(403 , 'you are not authorized')
//            next(err);
//         }
//         next();
//     }
// }

const verifyRole = (role) => {
    return (req, res, next) => {
        if (!role.includes(req.user.role)) {
            let err = new CustomError(403, 'you are not authorized')
            next(err);
        }
        next();
    }
}

module.exports = { signup, login, forgotPassword, resetPassword, verifyRole }
