const asyncHandler = require('express-async-handler');

const ProductCategory = require('../models/productCategory');

const createProductCategory = asyncHandler(async (req, res) => {
    const { title, brand } = req.body;
    const image = req?.files?.image[0]?.path;
    if (!(title && brand)) throw new Error('Missing input');
    if (image) req.body.image = image;
    req.body.brand = req.body.brand.split('.');
    const respone = await ProductCategory.create(req.body);
    return res.status(201).json({
        success: respone ? true : false,
        createdCategory: respone ? respone : 'Cannot create new product category',
    });
});

const getProductCategories = asyncHandler(async (req, res) => {
    const respone = await ProductCategory.find();
    return res.status(201).json({
        success: respone ? true : false,
        prodCategory: respone ? respone : 'Cannot get product category',
    });
});

const updateProductCategory = asyncHandler(async (req, res) => {
    const { pcid } = req.params;
    const files = req?.files;
    if (files?.image) {
        delete req.body.image;
        req.body.image = files?.image[0]?.path;
    }
    if (req.body.brand) req.body.brand = req.body.brand.split('.');
    const respone = await ProductCategory.findByIdAndUpdate(pcid, req.body, { new: true });
    return res.status(201).json({
        success: respone ? true : false,
        updateProdCategory: respone ? respone : 'Cannot update product category',
    });
});

const deleteProductCategory = asyncHandler(async (req, res) => {
    const { pcid } = req.params;
    const respone = await ProductCategory.findByIdAndDelete(pcid);
    return res.status(201).json({
        success: respone ? true : false,
        deleteProdCategory: respone ? respone : 'Cannot delete product category',
    });
});

module.exports = {
    createProductCategory,
    getProductCategories,
    updateProductCategory,
    deleteProductCategory,
};
