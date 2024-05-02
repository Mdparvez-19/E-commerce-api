const mongoose = require('mongoose');
const Products = require('../models/products/products');
const fs = require('fs');

mongoose.connect("mongodb://127.0.0.1:27017/nodeKart").then(() => {
    console.log('db connected');
}).catch((err) => {
    console.log(err);
});

async function imoprtData() {
    try {
        const data = fs.readFileSync('./data.json', 'utf-8');
        const products = JSON.parse(data);
        await Products.insertMany(products);
    } catch (error) {
        console.log(error);
    }
    process.exit();
}

async function deleteData() {
    try {
        await Products.deleteMany({})
    } catch (error) {
        console.log(error);
    }
    process.exit()
}

if (process.argv[2] === "--import") {
    imoprtData();
    console.log('products added successfully');
}

if (process.argv[2] === '--delete') {
    deleteData();
    console.log('products deleted successfulli');
}