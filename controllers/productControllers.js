const Products = require('../models/products/products');
const asyncErrorHandler = require('../utils/asyncErrorHandler');

const createProducts = asyncErrorHandler(async (req, res) => {
    let newProducts = await Products.create(req.body)
    res.status(200).json({
        status: 'success',
        products: newProducts
    })
});

const getAllProducts = asyncErrorHandler(async (req, res) => {
    // console.log(req.user.name);

    // search ? (search = req.query.search) : "";
    // let products = await Products.find({ title: { $regex: search, $options: 'i' } });

    const search = req.query.search || "";

    const page = parseInt(req.query.page) || 1;

    const limit = parseInt(req.query.limit) || 10;

    //pagination
    const skip = (page - 1) * limit;

    let category = req.query.category || "All";

    let sort = req.query.sort || "rating";

    const categoryArr = ["smartphones", "laptops", "fragrances", "skincare", "groceries", "home-decoration", "furniture", "tops", "womens-dresses", "womens-shoes", "mens-shirts", "mens-shoes", "mens-watches", "womens-watches", "womens-bags", "womens-jewellery", "sunglasses", "automotive", "motorcycle", "lighting"]

    //based on category
    category === "All" ? (category = [...categoryArr]) : (category = req.query.category.split(","));

    //sorting
    req.query.sort ? (sort = req.query.sort.split(",")) : (sort = [sort]);
    let sortBy = "";
    console.log(sortBy);

    if (sort.length > 0) {
        sortBy = sort.join(" ");
    } else {
        sortBy = sort
    }

    let products = await Products.find({ title: { $regex: search, $options: 'i' } }).where("category").in([...category])
        .skip(skip)
        .limit(limit)
        .sort(sortBy);

    let total = await Products.countDocuments();
    res.status(200).json({
        status: "success",
        count: products.length,
        total,
        page,
        limit,
        data: products
    })
});

const getProducById = asyncErrorHandler(async (req, res) => {
    let id = req.params.productId
    let product = await Products.findById(id);
    // console.log(product);
    res.status(200).json({
        status: "success",
        data: product
    })
});

const deleteProduct = (async (req, res) => {
    let id = req.params.productId;
    await Products.findByIdAndDelete(id);
    res.status(200).json({
        status: "success",
    })
})

module.exports = { createProducts, getAllProducts, getProducById, deleteProduct }
