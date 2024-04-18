const express = require('express')
const swaggerUI = require('swagger-ui-express')
const swaggerDocument = require('./swagger-out.json')

const loginController = require('./login.js')
const bookController = require('./books.js')
const lendController = require('./lends.js')

const app = express()
const port = 3000

app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use('/swagger-api', swaggerUI.serve, swaggerUI.setup(swaggerDocument))
app.use('', bookController)
app.use('', lendController)
app.use('', loginController)

app.listen(port, () => {
  console.log('Library running on port:', port)
})
