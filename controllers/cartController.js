const Cart = require('../models/cart/cart');
const Product = require('../models/products/products');
const asyncErrorHandler = require('../utils/asyncErrorHandler');

const getCart = asyncErrorHandler(async (req, res) => {
    const owner = req.user._id;
    // console.log(req.user._id);
    const cart = await Cart.findOne({ owner: owner });
    if (cart && cart.products.length > 0) {
        res.status(200).json({
            status: "success",
            data: {
                cart: cart
            }
        })
    } else {
        res.status(200).json({
            status: "success",
            message: 'there are no products found in cart'
        })
    }
})

const createCart = asyncErrorHandler(async (req, res,) => {
    // console.log("createCart function is called");
    const owner = req.user._id;
    // console.log(owner);
    const { productId, quantity } = req.body;
    // console.log(productId, quantity);
    const cart = await Cart.findOne({ owner: owner });
    // console.log("cart" , cart);
    const product = await Product.findById(productId);
    // console.log(product);
    if (!product) {
        res.status(400).json({
            status: "bad request",
            message: "there are no products with the id"
        })
    }
    let title = product.title;
    let price = product.price;
    // console.log(title, price);
    if (cart) {
        const productIndex = await cart.products.findIndex((product) => product.productId === productId);
        // console.log(productIndex);
        if (productIndex > -1) {
            let product = cart.products[productIndex];
            // console.log(product);
            product.quantity += quantity;
            cart.bill = cart.products.reduce((acc, curr) => {
                return acc + curr.quantity * curr.price;
            }, 0);
            cart.products[productIndex] = product;
            await cart.save();
            console.log("successfully saved");
            res.status(200).json({
                status: "success",
                data: {
                    cart
                }
            })
        } else {
            cart.products.push({ productId, title, price, quantity });
            cart.bill = cart.products.reduce((acc, curr) => {
                return acc + curr.quantity * curr.price;
            }, 0);
            await cart.save();
            res.status(200).json({
                status: "success",
                data: {
                    cart
                }
            })
        }
    } else {
        const newCart = await Cart.create({
            owner: owner,
            products: {
                productId,
                quantity,
                price,
                title
            },
            bill: quantity * price
        })
        res.status(200).json({
            status: "success",
            data: {
                cart: newCart
            }
        })
    }
})

const deleteProduct = asyncErrorHandler(async (req, res) => {
    const owner = req.user._id;
    // console.log(owner);
    const productId = req.query.productId;
    // console.log(productId);
    const cart = await Cart.findOne({ owner: owner });
    // console.log("cart", cart);
    if (cart) {
        const productIndex = cart.products.findIndex((product) => product.productId == productId)
        // console.log(product.productId);
        // console.log(productId););
        // console.log(productIndex);

        if (productIndex > -1) {
            let product = cart.products[productIndex];
            // console.log(product);
            cart.bill -= product.price * product.quantity;
            if (cart.bill < 0) {
                cart.bill = 0;
            };
            cart.products.splice(productIndex, 1);
            cart.bill = cart.products.reduce((acc, curr) => {
                return acc += curr.price * curr.quantity;
            }, 0)
            await cart.save();
            res.status(200).json({
                status: 'success',
                data: cart
            })
        } else {
            res.status(200).json({
                status: 'success',
                message: 'there is no product with the id'
            })
        }
    } else {
        res.status(200).json({
            status: 'success',
            message: 'ther are no products in cart'
        })
    }
})

module.exports = { getCart, createCart, deleteProduct }