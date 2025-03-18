const userRoute = require('./user')
const { notFound, errorHandler } = require('../middlewares/errHandler')

const initRoute = (app) => {
  app.use('/api/user', userRoute)

  app.use(notFound)
  app.use(errorHandler)
}

module.exports = initRoute