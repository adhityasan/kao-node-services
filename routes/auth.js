const _ = require('lodash')
const express = require('express')
const bcrypt = require('bcrypt')

const { joiValidate, buildErrorResponse: joiErrResponse } = require('@utils/joi-validate')
const { User, joiSchema_User } = require('@models/users')

const router = express.Router()

async function login(req, res) {
  const { error: joiError } = joiValidate(req.body, joiSchema_User, true)
  
  if (joiError) return res.send(joiErrResponse(joiError))
  
  try {
    const { username, password, email } = req.body
    const user = !email ? 
      await User.findOne({ username: username }) :
      await User.findOne({ email: email }) 

    if (!user) return res.status(400).send({ message: 'Username atau email tidak ditemukan', data: _.pick(req.body, ['username', 'email']) })

    const validPassword = await bcrypt.compare(password, user.password)

    if (!validPassword) return res.status(400).send({ message: 'Password tidak valid', data: _.pick(req.body, ['username', 'email']) })

    const token = user.generateAuthToken()

    user.lastLogin = new Date()
    user.save()
    
    res.header('x-auth-token', token).send(user)
    
  } catch (error) {
    res.send(error)
  }
}

async function register(req, res) {
  const { error: joiError } = joiValidate(req.body, joiSchema_User)
  
  if (joiError) return res.status(400).send(joiErrResponse(joiError))

  try {
    const newuser = new User(_.pick(req.body, ['username', 'email', 'password']))
    
    const existuser = await User.findOne({ username: newuser.username }).or({ email: newuser.email })

    if (existuser) return res.send({ message: 'Email or username has been used', data: _.pick(existuser, ['username', 'email']) })

    const salt = await bcrypt.genSalt(10)
    const hashed = await bcrypt.hash(newuser.password, salt)
    newuser.password = hashed
    const saveResult = await newuser.save()

    res.send({ message: 'Success register user', data: _.pick(saveResult, ['username', 'email']) })
  } catch (error) {
    res.status(400).send({ message: 'Fail register user', data: error })
  }
}

router.post('/login', login)
router.post('/register', register)

module.exports = router