const jwt = require('jsonwebtoken')
const config = require('config')

module.exports = function (req, res, next) {
  const token = req.header('x-auth-token')
  const prefix = config.get('tokenPrefix')
  
  if (!token) return res.status(401).send('Access Denied. No token provided')

  const containPrefix = token.includes(prefix)

  if (!containPrefix) return res.status(400).send('Invalid token. No caller identifier')
  try {
    const decoded = jwt.verify(token, config.get('jwtPrivateKey'))
    req.user = decoded
    next()
  } catch (error) {
    res.status(400).send('Invalid token')
  }

}