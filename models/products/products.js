const { Schema, model } = require('mongoose');

const productSchema = new Schema(
    {
        title: {
            type: String,
            require: [true, "title is required"],
            unique: true
        },
        description: {
            type: String,
            require: [true, "description is required"]
        },
        price: {
            type: Number,
            require: [true, "price is required"]
        },
        discountPercentage: {
            type: String,
            require: [true, "discountPercentage is required"],
            default: 0
        },
        rating: {
            type: Number,
            default: 1,
            max: [10, "rating should be between 1-10"]
        },
        stock: {
            type: Number,
            require: [true, "stock is required"],
            default: 1
        },
        brand: {
            type: String,
            require: [true, "brand field can't be empty"]
        },
        category: {
            type: String,
            require: [true, "category is required"],
        },
        thumbnail: {
            type: String,
            default : "https://appliedsurveys.com/wp-content/uploads/2015/02/default.png"
        },
        images: [String]
    },
    {
        timestamps: true
    }
);

const Product = model('products', productSchema)
module.exports = Product