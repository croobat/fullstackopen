require('dotenv').config()

const PORT = process.env.PORT || 3000
const MONGODB_URI = process.env.NODE_ENV === 'test'
  ? process.env.MONGODB_URI
  : process.env.TEST_MONGODB_URI

module.exports = {
  PORT,
  MONGODB_URI
}
