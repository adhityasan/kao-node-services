const jwt = require('jsonwebtoken')
const config = require('config')
const { Group } = require('@models/groups')

function authorizeUser (req, res, next) {
  const token = req.header('x-auth-token')
  const prefix = config.get('tokenPrefix')

  if (!token) return res.status(401).send('Access Denied. No token provided')

  const containPrefix = token.includes(prefix)

  if (!containPrefix) return res.status(400).send('Invalid token. No caller identifier')

  try {
    const decoded = jwt.verify(token.replace(prefix, ''), config.get('jwtPrivateKey'))
    req.user = decoded
    next()
  } catch (error) {
    res.status(400).send('Invalid token')
  }
}

async function authorizeAdmin (req, res, next) {
  const token = req.header('x-auth-token')
  const prefix = config.get('tokenPrefix')

  if (!token) return res.status(401).send('Access Denied. No token provided')

  const containPrefix = token.includes(prefix)

  if (!containPrefix) return res.status(400).send('Invalid token. No caller identifier')

  try {
    const decoded = jwt.verify(token.replace(prefix, ''), config.get('jwtPrivateKey'))

    if (!decoded.isAdmin) {
      const groupAdmin = await Group.findOne({ name: 'admin' })
      let asAdminByGroup = false
      if ((decoded.groups && decoded.groups.length > 0) && groupAdmin) {
        decoded.groups.forEach(gid => gid == groupAdmin._id ? asAdminByGroup = true : null )
      }
      if (!asAdminByGroup) {
        return res.status(403).send('Access Forbidden. User have no permission to access this resource')
      }
    }
    
    req.user = decoded
    next()
  } catch (error) {
    res.status(400).send({ message: 'Invalid token', error: error })
  }
}

exports.authorize_user = authorizeUser
exports.authorize_admin = authorizeAdmin