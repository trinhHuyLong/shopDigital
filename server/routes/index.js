const userRoute = require('./user')
const productRoute = require('./product')
const productCategoryRoute = require('./productCategory')
const blogCategoryRoute = require('./blogCategory')
const { notFound, errorHandler } = require('../middlewares/errHandler')

const initRoute = (app) => {
  app.use('/api/user', userRoute)
  app.use('/api/product', productRoute)
  app.use('/api/productcategory', productCategoryRoute)
  app.use('/api/blogcategory', blogCategoryRoute)

  app.use(notFound)
  app.use(errorHandler)
}

module.exports = initRoute