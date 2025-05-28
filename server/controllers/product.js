const asyncHandler = require('express-async-handler');
const slugify = require('slugify');

const Product = require('../models/product');

let dealdaily;
let hour = 23,
    minutes = 59,
    second = 59;

(async () => {
    dealdaily = await Product.aggregate([{ $sample: { size: 1 } }]);
    if (dealdaily[0]) {
        dealdaily[0].sale = 10;
        await Product.findByIdAndUpdate(dealdaily[0]._id, { $set: { sale: 10 } });
    }
})();

setInterval(() => {
    if (second > 0) {
        second -= 1;
    } else {
        if (minutes > 0) {
            minutes -= 1;
            second = 59;
        } else {
            hour -= 1;
            minutes = 59;
            second = 59;
        }
    }
}, 1000);

setInterval(async () => {
    await Product.findByIdAndUpdate(dealdaily[0]._id, { $set: { sale: 0 } });
    dealdaily = await Product.aggregate([{ $sample: { size: 1 } }]);
    if (dealdaily[0]) {
        dealdaily[0].sale = 10;
        await Product.findByIdAndUpdate(dealdaily[0]._id, { $set: { sale: 10 } });
    }
    (hour = 23), (minutes = 59), (second = 59);
    setInterval(() => {
        if (second > 0) {
            second -= 1;
        } else {
            if (minutes > 0) {
                minutes -= 1;
                second = 59;
            } else {
                hour -= 1;
                minutes = 59;
                second = 59;
            }
        }
    }, 1000);
}, 24 * 60 * 60 * 1000);

const createProduct = asyncHandler(async (req, res) => {
    const { title, price, description, brand, category } = req.body;
    const thumb = req?.files?.thumb[0]?.path;
    const images = req?.files?.images?.map(el => el.path);
    if (!(title && price && description && brand && category)) throw new Error('Missing input');
    req.body.slug = slugify(title);
    req.body.description = req.body.description.split('.');
    if (thumb) req.body.thumb = thumb;
    if (images) req.body.images = images;
    const product = await Product.create(req.body);
    return res.status(201).json({
        success: product ? true : false,
        mes: product ? 'Created' : 'Failed',
    });
});

const getProduct = asyncHandler(async (req, res) => {
    const { pid } = req.params;
    const product = await Product.findById(pid).populate({
        path: 'ratings',
        populate: {
            path: 'postedBy',
            select: 'name avatar',
        },
    });
    return res.status(201).json({
        success: product ? true : false,
        product: product ? product : 'Cannot get product',
    });
});

const getProducts = asyncHandler(async (req, res) => {
    const queries = { ...req.query };
    const excludeFields = ['limit', 'sort', 'page', 'fields'];
    excludeFields.forEach(el => delete queries[el]);
    let queryString = JSON.stringify(queries);
    queryString = queryString.replace(/\b(gte|gt|lt|lte)\b/g, matchEl => `$${matchEl}`);
    const formatedQueries = JSON.parse(queryString);
    let colorQueryObject = {};
    if (queries?.title) {
        formatedQueries.title = { $regex: queries.title, $options: 'i' };
    } else delete formatedQueries.title;
    if (queries?.brand) {
        formatedQueries.brand = { $regex: queries.brand, $options: 'i' };
    } else delete formatedQueries.brand;
    if (queries?.category) formatedQueries.category = { $regex: queries.category, $options: 'i' };
    if (queries?.color) {
        delete formatedQueries.color;
        const colorArr = queries.color?.split(',');
        const colorQuery = colorArr.map(el => ({ color: { $regex: el, $options: 'i' } }));
        colorQueryObject = { $or: colorQuery };
    }
    let queryObject = {};
    if (queries?.q) {
        delete formatedQueries.q;
        queryObject = {
            $or: [
                { title: { $regex: queries.q, $options: 'i' } },
                { category: { $regex: queries.q, $options: 'i' } },
                { brand: { $regex: queries.q, $options: 'i' } },
            ],
        };
    } else delete formatedQueries.q;
    const q = { ...colorQueryObject, ...formatedQueries, ...queryObject };
    let queryCommand = Product.find(q);

    if (req.query.sort) {
        const sortBy = req.query.sort.split(',').join(' ');
        queryCommand = queryCommand.sort(sortBy);
    } else {
        queryCommand = queryCommand.sort('-_id'); // Mặc định sắp xếp theo ngày tạo
    }

    if (req.query.fields) {
        const fields = req.query.fields.split(',').join(' ');
        queryCommand = queryCommand.select(fields);
    } else {
        queryCommand = queryCommand.select('-__v'); // Mặc định loại bỏ trường `__v`
    }

    const page = parseInt(req.query.page) || 1;
    const limit =
        req.query.limit !== undefined
            ? parseInt(req.query.limit)
            : parseInt(process.env.LIMIT_PRODUCT);

    const skip = (page - 1) * limit;
    queryCommand = queryCommand.skip(skip).limit(limit);

    const products = await queryCommand;
    const counts = await Product.countDocuments(q);
    return res.status(200).json({
        success: true,
        counts,
        products,
    });
});

const updateProduct = asyncHandler(async (req, res) => {
    const { pid } = req.params;
    const files = req?.files;
    if (files?.thumb) {
        delete req.body.thumb;
        req.body.thumb = files?.thumb[0]?.path;
    }
    if (files?.images) {
        delete req.body.images;
        req.body.images = files?.images.map(el => el.path);
    }
    if (req.body.description) req.body.description = req.body.description.split('.');
    if (typeof req.body.title === 'string') req.body.slug = slugify(req.body.title);
    const product = await Product.findByIdAndUpdate(pid, req.body, { new: true });
    return res.status(201).json({
        success: product ? true : false,
        updateProduct: product ? product : 'Cannot update product',
    });
});

const deleteProduct = asyncHandler(async (req, res) => {
    const { pid } = req.params;
    const product = await Product.findByIdAndDelete(pid);
    return res.status(201).json({
        success: product ? true : false,
        updateProduct: product ? product : 'Cannot delete product',
    });
});

const dealdailyProduct = asyncHandler(async (req, res) => {
    return res.status(201).json({
        success: dealdaily ? true : false,
        product: dealdaily ? { dealdaily: dealdaily?.[0], hour, minutes, second } : 'error',
    });
});

const ratings = asyncHandler(async (req, res) => {
    const { _id } = req.user;
    const { star, comment, pid, updateAt } = req.body;
    if (!star || !pid) throw new Error('Missing input');
    const ratingProduct = await Product.findById(pid);
    const alreadyRating = ratingProduct?.ratings?.find(el => el.postedBy.toString() === _id);

    if (alreadyRating) {
        await Product.updateOne(
            {
                ratings: { $elemMatch: alreadyRating },
            },
            {
                $set: {
                    'ratings.$.star': star,
                    'ratings.$.comment': comment,
                    'ratings.$.updateAt': updateAt,
                },
            },
            { new: true }
        );
    } else {
        const respone = await Product.findByIdAndUpdate(
            pid,
            {
                $push: {
                    ratings: {
                        star,
                        comment,
                        postedBy: _id,
                        updateAt,
                    },
                },
            },
            { new: true }
        );
    }

    const updateProduct = await Product.findById(pid);
    const ratingCount = updateProduct.ratings.length;
    const sumRatings = updateProduct.ratings.reduce((sum, el) => {
        return sum + el.star;
    }, 0);

    updateProduct.totalRatings = Math.round((sumRatings * 10) / ratingCount) / 10;
    await updateProduct.save();

    return res.status(200).json({
        success: true,
    });
});

const uploadImagesProduct = asyncHandler(async (req, res) => {
    const { pid } = req.params;
    if (!req.files) throw new Error('No files uploaded');
    const respone = await Product.findByIdAndUpdate(
        pid,
        { $push: { images: { $each: req.files.map(el => el.path) } } },
        { new: true }
    );
    return res.json({
        success: respone ? true : false,
        message: respone ? 'Images uploaded successfully' : 'Cannot upload images',
    });
});

module.exports = {
    createProduct,
    getProduct,
    getProducts,
    updateProduct,
    deleteProduct,
    ratings,
    uploadImagesProduct,
    dealdailyProduct,
};
