const { Schema, model } = require('mongoose');

const cartSchema = new Schema(
    {
        owner: {
            type: Schema.Types.ObjectId,
            required: [true, 'user is not found'],
            ref: 'users'
        },
        products: [
            {
                productId: {
                    type: Schema.Types.ObjectId,
                    required: [true,'product id id not found'],
                    ref: 'products'
                },
                quantity: {
                    type: Number,
                    required: [true, 'please provide quantity'],
                    min: 1,
                    default: 1
                },
                price: {
                    type: Number,
                    required: [true, 'please provide price']
                },
                title: {
                    type: String,
                    required: [true, 'please provide title']
                }
            }
        ],
        bill: {
            type: Number,
            required: [true, 'please provide bill'],
        }
    },
    {
        timestamps: true
    }
);

module.exports = model('cart', cartSchema)