require('module-alias/register')
const env = require('dotenv').config()
const express = require('express')
const helmet = require('helmet')
const morgan = require('morgan')
const config = require('config')
const debug = require('debug')('app:startup')
const dbdebug = require('debug')('app:db')
const mongoose = require('mongoose')

const r_auth = require('@routes/auth')
const r_user = require('@routes/user')
const c = require('@constants/colorize')

const dbconnection = `mongodb://${env.parsed.DB_HOST}:${env.parsed.DB_PORT}/${env.parsed.DB_NAME}`
const app = express()
const connectOption = {
  useCreateIndex: true,
  useNewUrlParser: true
}

if (!config.get('jwtPrivateKey')) {
  debug(`${c.Bright}${c.FgRed}FATAL ERROR ${c.Reset}jwtPrivateKey configuration is not defined`)
  process.exit(1) // anything else but 0 means failure
}

app.locals.title = config.get('name')
app.locals.author = config.get('author')
app.locals.email = config.get('email')

mongoose.connect(dbconnection, connectOption)
  .then(() => dbdebug(`Database ${env.parsed.DB_NAME} selected`))
  .catch(err => dbdebug(`Fail connect to ${dbconnection}: ${err}`))

app.use(helmet())
app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use(express.static('public'))

if (app.get('env')) {
  const morganType = 'tiny'
  app.use(morgan(morganType))
  debug(`Morgan enabled on ${morganType} mode...`)
}

app.use('/api/auth', r_auth)
app.use('/api/user', r_user)

app.listen(env.parsed.PORT, () => {
  debug(`App run on ${env.parsed.NODE_ENV.toUpperCase()} mode...`)
  debug(`Listening on port ${env.parsed.PORT}...`)
})