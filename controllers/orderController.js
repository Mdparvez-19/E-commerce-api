const Order = require('../models/order/order');
const Cart = require('../models/cart/cart');
const asyncErrorHandler = require('../utils/asyncErrorHandler');
const CustomError = require('../utils/CustomError');

const getOrders = asyncErrorHandler(async (req, res) => {
    let owner = req.user._id;
    // console.log(owner);
    let orders = await Order.find({ owner });
    res.status(200).json({
        status: "success",
        data: {
            orders,
        }
    })
})

const createOrder = asyncErrorHandler(async (req, res, next) => {
    let owner = req.user._id;
    let cart = await Cart.findOne({ owner });
    if (cart) {
        const newOrder = await Order.create({
            owner: owner,
            products: cart.products,
            bill: cart.bill
        });
        await Cart.findByIdAndDelete(cart._id);
        res.status(200).json({
            status: 'success',
            message: 'order placed successfully',
            data: {
                newOrder
            }
        })
    } else {
        // res.status(200).json({
        //     status: "success",
        //     message: 'there are no products in the cart '
        // })
        let err = new CustomError(200, 'there are no products in the cart ');
        next(err);
    }
})

module.exports = {
    getOrders, createOrder
}