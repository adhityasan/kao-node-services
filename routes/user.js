const express = require('express')
const router = express.Router()

const { User } = require('@models/users')
const authorize = require('@middlewares/authorization')
const mongoosedocquery = require('@utils/mongoose-doc-query')

async function getUsers(req, res) {
  let docquery = mongoosedocquery(req.query)
  
  try {
    const users = await User
      .find(docquery.find)
      .skip(docquery.skip)
      .limit(docquery.limit)
      .sort(docquery.sort)
      .select('-password')

    res.send({ message: 'Success get users data', data: users })
  } catch (error) {
    res.status(400).send({ message: 'Fail to get users data', errror: error })
  }
}

router.get('/', authorize, getUsers)

module.exports = router