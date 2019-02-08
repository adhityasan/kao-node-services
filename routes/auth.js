const _ = require('lodash')
const express = require('express')
const bcrypt = require('bcrypt')
const Joi = require('joi')
const randtoken = require('rand-token')
const  { authorize_user } = require('@middlewares/authorization')

const { joiValidate, buildErrorResponse: joiErrResponse } = require('@utils/joi-validate')
const { User, joiSchema_User } = require('@models/users')
const { Authlog } = require('@models/authlog')

const router = express.Router()

async function login(req, res) {

  const loginSchema = {
    username: Joi.string().min(6).max(30).regex(/@/, { name: 'valid username', invert: true }).optional().allow(''),
    email: Joi.string().email().regex(/@/, { name: 'valid email', invert: false }).optional().allow(''),
    password: Joi.string().min(8).max(100).required(),
    remember: Joi.boolean().optional()
  }

  const { error: joiError } = joiValidate(req.body, loginSchema, true)
  
  if (joiError) return res.send(joiErrResponse(joiError))
  
  try {
    const { username, password, email, remember } = req.body
    const user = !email ? 
      await User.findOne({ username: username }) :
      await User.findOne({ email: email }) 

    if (!user) return res.status(400).send({ message: 'Username atau email tidak ditemukan', data: _.pick(req.body, ['username', 'email']) })
    
    const validPassword = await bcrypt.compare(password, user.password)
    
    if (!validPassword) return res.status(400).send({ message: 'Password tidak valid', data: _.pick(req.body, ['username', 'email']) })
      
    const token = user.generateAuthToken()
    
    user.lastLogin = new Date()
    user.save()
    
    if (user.useOTP) {
      // handle OTP
      // 
    }
    
    const log = new Authlog()
    log.userId = user._id
    log.time = new Date()
    if (remember) log.refreshToken = randtoken.uid(100)
    log.save()

    const responseData = new Object()
    responseData.userId = user._id
    responseData.username = user.username
    responseData.verified = user.verified
    responseData.navigation = user.navigation
    responseData.groups = user.groups
    responseData.role = user.role
    responseData.token = token
    responseData.expiresIn = '3600'
    if (remember) responseData.refreshToken = log.refreshToken

    res.header('x-auth-token', token).send(responseData)

  } catch (error) {
    res.status(400).send({ message: 'Semething went wrong in the process', data: { error: error } })
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
    res.status(400).send({ message: 'Fail register user', error: error })
  }
}

async function whoami(req, res) {
  return res.send(req.user)
}

router.post('/login', login)
router.post('/register', register)
router.get('/whoami', authorize_user, whoami)

module.exports = router