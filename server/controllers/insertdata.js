const asyncHandler = require('express-async-handler')
const slugify = require('slugify')

const Product = require('../models/product')
const Brand = require('../models/productCategory')

const data = require('../data.json')
const data2 = require('../prodcate')

const fn = async (product) => {
    try{
        await Product.create({
            title: product?.name,
            slug: slugify(product?.name),
            description: product?.description,
            brand: product?.brand,
            price: Math.round(Number(product?.price?.match(/\d/g).join(''))/100),
            category: product?.category[1],
            quantity: Math.round(Math.random()*1000),
            sold:Math.round(Math.random()*100),
            images: product?.images,
            color: product?.variants?.find(el=>el.label === 'Color')?.variants[0],
            thumb: product?.thumb,
            totalRatings: Math.round(Math.random()*5),
        })
    } catch(error) {
        console.log('Error:', error)
    }
    
}

const fn2 = async (p) => {
    try{
        await Brand.create({
            title: p.cate,
            brand: p.brand,
            image: p.image
        })
    } catch(error) {
        console.log('Error:', error)
    }
    
}
const insertProduct = asyncHandler(async (req, res) => {
    const promises = []
    for(let product of data) {
        promises.push(fn(product))
    }
    await Promise.all(promises)
    return res.json('Done')
})

const insertBrand = asyncHandler(async (req, res) => {
    const promises = []
    for(let brand of data2) {
        promises.push(fn2(brand))
    }
    await Promise.all(promises)
    return res.json('Done')
})

module.exports = {
    insertProduct,
    insertBrand
}