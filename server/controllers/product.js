const asyncHandler = require('express-async-handler');
const slugify = require('slugify');

const Product = require('../models/product');

const createProduct = asyncHandler(async (req, res) => {
    if(Object.keys(req.body).length === 0) throw new Error('Request body is empty');
    if(req.body.title) req.body.slug = slugify(req.body.title)
    const product = await Product.create(req.body);
    return res.status(201).json({
        success: product ? true : false,
        created: product? product: "Cannot create product"
    });
})

const getProduct = asyncHandler(async (req, res) => {
    const { pid } = req.params;
    const product = await Product.findById(pid);
    return res.status(201).json({
        success: product ? true : false,
        product: product? product: "Cannot get product"
    });
})

const getProducts = asyncHandler(async (req, res) => {
    const queries = {...req.query}
    const excludeFields = ['limit', 'sort', 'page', 'fields']
    excludeFields.forEach(el => delete queries[el])
    let queryString = JSON.stringify(queries)
    queryString = queryString.replace(/\b(gte|gt|lt|lte)\b/g,matchEl => `$${matchEl}`)
    const formatedQueries = JSON.parse(queryString)
    if(queries?.title) formatedQueries.title = {$regex: queries.title, $options: 'i'}
    let queryCommand =Product.find(formatedQueries)

    if (req.query.sort) {
        const sortBy = req.query.sort.split(',').join(' ');
        queryCommand = queryCommand.sort(sortBy);
    } else {
        queryCommand = queryCommand.sort('-createdAt'); // Mặc định sắp xếp theo ngày tạo
    }

    if (req.query.fields) {
        const fields = req.query.fields.split(',').join(' ');
        queryCommand = queryCommand.select(fields);
    } else {
        queryCommand = queryCommand.select('-__v'); // Mặc định loại bỏ trường `__v`
    }       

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || process.env.LIMIT_PRODUCT;
    const skip = (page - 1) * limit;
    queryCommand = queryCommand.skip(skip).limit(limit);

    const products = await queryCommand;
    const counts = await Product.countDocuments(formatedQueries);
    return res.status(200).json({
        success: true,
        products,
        counts
    });
})

const updateProduct = asyncHandler(async (req, res) => {
    const {pid} = req.params
    if(req.body.title) req.body.slug = slugify(req.body.title)
    const product = await Product.findByIdAndUpdate(pid, req.body, {new: true});
    return res.status(201).json({
        success: product ? true : false,
        updateProduct: product? product: "Cannot update product"
    });
})

const deleteProduct = asyncHandler(async (req, res) => {
    const {pid} = req.params
    const product = await Product.findByIdAndDelete(pid);
    return res.status(201).json({
        success: product ? true : false,
        updateProduct: product? product: "Cannot delete product"
    });
})

const ratings = asyncHandler(async (req,res)=>{
    const {_id} = req.user
    const {star, comment, pid} = req.body
    if(!star || !pid) throw new Error("Missing input")
    const ratingProduct = await Product.findById(pid)
    const alreadyRating = ratingProduct?.ratings?.find(el => el.postedBy.toString() === _id)
    console.log(alreadyRating)

    if(alreadyRating) {
        await Product.updateOne({
            ratings: {$elemMatch: alreadyRating}
        }, {
            $set: {
                "ratings.$.star": star,
                "ratings.$.comment": comment
            }
        },{new: true})
    } else {
        const respone = await Product.findByIdAndUpdate(pid, {
            $push: {
                ratings: {
                    star,
                    comment,
                    postedBy: _id
                }
            }
        },{new: true})
        console.log(respone)
    }

    const updateProduct = await Product.findById(pid)
    const ratingCount = updateProduct.ratings.length
    const sumRatings = updateProduct.ratings.reduce((sum,el) => {
        return sum + el.star
    },0)

    updateProduct.totalRatings = Math.round(sumRatings * 10 / ratingCount) / 10
    await updateProduct.save()

    return res.status(200).json({
        success: true
    })
})  


module.exports = {
    createProduct,
    getProduct,
    getProducts,
    updateProduct,
    deleteProduct,
    ratings
}