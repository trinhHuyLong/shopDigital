const userRoute = require('./user')
const productRoute = require('./product')
const productCategoryRoute = require('./productCategory')
const blogCategoryRoute = require('./blogCategory')
const blogRoute = require('./blog')
const brandRoute = require('./brand')
const couponRoute = require('./coupon')
const orderRoute = require('./order')
const insertRoute = require('./insert')
const { notFound, errorHandler } = require('../middlewares/errHandler')

const initRoute = (app) => {
  app.use('/api/user', userRoute)
  app.use('/api/product', productRoute)
  app.use('/api/productcategory', productCategoryRoute)
  app.use('/api/blogcategory', blogCategoryRoute)
  app.use('/api/blog', blogRoute)
  app.use('/api/brand', brandRoute)
  app.use('/api/coupon', couponRoute)
  app.use('/api/order', orderRoute)
  app.use('/api/insert', insertRoute)
  app.use(notFound)
  app.use(errorHandler)
}

module.exports = initRoute