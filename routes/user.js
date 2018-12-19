const _ = require('lodash')
const express = require('express')
const bcrypt = require('bcrypt')
const router = express.Router()

const { User, joiSchema_User } = require('@models/users')
const authorize = require('@middlewares/authorization')
const mongoosedocquery = require('@utils/mongoose-doc-query')
const { joiValidate, buildErrorResponse, isObjectId } = require('@utils/joi-validate')

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

async function getUser(req, res) {
  const userid = req.params.id
  const { error: joiError } = isObjectId(userid)

  if (joiError) return res.status(400).send(buildErrorResponse(joiError))

  try {
    const user = await User.findById(userid).select('-password')
  
    res.send({ message: 'Success get user data', data: user })
  } catch (error) {
    res.status(400).send({ message: 'Fail to get user data', error: error })
  }
}

async function createUser(req, res) {
  const { error: joiError } = joiValidate(req.body, joiSchema_User, true)

  if (joiError) return res.status(400).send(buildErrorResponse(joiError))
  
  
  try {
    const newuser = new User(_.pick(req.body, [ 'username', 'password', 'email', 'groups', 'role', 'profile', 'activated' ]))
    const salt = await bcrypt.genSalt(10)
    const hashed = await bcrypt.hash(newuser.password, salt)
    newuser.password = hashed
    const saveResult = await newuser.save()

    res.send({ message: 'Success create new user', data: _.pick(saveResult, [ '_id', 'username', 'email', 'activated' ]) })
  } catch (error) {
    res.send({ message: 'Fail create new user', error: error })
  }
}

async function updateUser(req, res) {
  const userid = req.params.id
  const updates = req.body
  const { error: joiError } = isObjectId(userid)

  if (joiError) return res.status(400).send(buildErrorResponse(joiError))
  
  const user = await User.findById(userid)

  if (!user) return res.status(404).send({ message: 'User with given id was not found', data: { _id: userid, ...updates } })

  try {
    user.set(updates)
    const saveResult = await user.save()
    
    res.send({ message: `Success update user, id: ${userid}`, data: saveResult })
  } catch (error) {
    
    res.status(400).send({ message: `Fail update user, id: ${userid}`, error: error })
  }
}

async function deleteUser(req, res) {
  const userid = req.params.id
  const { error: joiError } = isObjectId(userid)

  if (joiError) return res.status(400).send(buildErrorResponse(joiError))

  try {
    const user = await User.findByIdAndDelete(userid)

    if (!user) return res.status(404).send({ message: 'User with given id was not found', data: { _id: userid } })
    
    res.send({ message: `Success delete user, id: ${userid}`, data: user })
  } catch (error) {
    
    res.status(400).send({ message: `Fail delete user, id: ${userid}`, error: error })
  }
}

router.get('/', authorize, getUsers)
router.post('/', authorize, createUser)
router.get('/:id', authorize, getUser)
router.put('/:id', authorize, updateUser)
router.delete('/:id', authorize, deleteUser)

module.exports = router