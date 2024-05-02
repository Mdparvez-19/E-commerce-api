const express = require('express');
const mongoose = require('mongoose');
const productRouter = require('./routes/productroutes');
const userRouter = require('./routes/userRoutes');
const cartRouter = require('./routes/cartRoutes');
const orderRouter = require('./routes/orderRoutes');
// const authRouer = require('./routes/authroutes');
// const session = require('express-session')

const dotenv = require('dotenv');
const CustomError = require('./utils/CustomError');
const errorController = require('./controllers/errorController');
dotenv.config({
    path: "./.env"
})

let app = express();


// const passport = require('passport');
// require('./passport/passport');

//to store the session in cookies
// app.use(session({
//     secret: "cat",
//     resave: false,
//     saveUninitialized: true,
// }));
// app.use(passport.initialize());
// app.use(passport.session());

mongoose.connect(process.env.MONGODB_LOCALURI).then(() => {
    console.log(`db connected`);
}).catch((err) => {
    console.log(err);
})

app.use(express.json());

app.use('/app/v1/products', productRouter);
app.use('/app/v1/users', userRouter);
app.use('/app/v1/cart', cartRouter);
app.use('/app/v1/orders', orderRouter);
// app.use('/auth', authRouer);

//error handling

app.all("*", (req, res, next) => {
    // res.status(404).json({
    //     status: "fail",
    //     message: `this path ${req.url} doesn't exist`
    // })

    // let error = new Error(`this path ${req.url} doesn't exist`);
    // error.statusCode = 404;
    // error.status = 'fail';
    // console.log(error);
    // next(error);
    
    let err = new CustomError(404, `this path ${req.url} doesn't exist`);
    next(err);
})

//Global error handler
app.use(errorController);

module.exports = app;