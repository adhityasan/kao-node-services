const mongoose = require('mongoose')
const Joi = require('joi')
Joi.objectId = require('joi-objectid')(Joi)
const jwt = require('jsonwebtoken')
const config = require('config')
const { Navigation } = require('@models/navigations')

const Schema = new mongoose.Schema({
  username: {
    type: String,
    minlength: 6,
    maxlength: 255,
    index: { unique: true, dropDups: true },
    trim: true,
    validate: {
      validator: function(v) {
        return (v.includes('@')) ? false : true
      },
      message: 'username should not contain \'@\' character'
    },
    required: true
  },
  password: {
    type: String,
    maxlength: 1024,
    trim: true
  },
  email: {
    type: String,
    match: /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
    index: { unique: true, dropDups: true },
    lowercase: true,
    trim: true,
    required: true
  },
  activated: {
    type: Boolean,
    default: false
  },
  profile: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Profile'
  },
  navigation: Array,
  lastLogin: Date,
  groups: [ { type: mongoose.Schema.Types.ObjectId, ref: 'Group' } ],
  role: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Role'
  }
})

Schema.methods.generateAuthToken = function() {
  const token = jwt.sign({ _id: this._id, email: this.email, verified: this.verified, groups: this.groups, role: this.role }, config.get('jwtPrivateKey'))
  const prefix = config.get('tokenPrefix')
  return `${prefix}${token}`
}

Schema.methods.getNavigation = async function() {
  const ownedNavigation = await Navigation.find({ groupsPrivilege: {$in: this.groups }}).select('-groupsPrivilege -rolesPrivilege')
  return ownedNavigation
}

const User = mongoose.model('User', Schema)

const joiSchema = {
  username: Joi.string().min(6).max(30).regex(/@/, { name: 'valid username', invert: true }).required(),
  email: Joi.string().email().regex(/@/, { name: 'valid email', invert: false }).required(),
  password: Joi.string().min(8).max(100).required(),
  profile: Joi.objectId().error(() => 'Profile should be an ObjectId ref Profile document'),
  groups: Joi.array().items(Joi.objectId().error(() => 'Groups item should be an ObjectId ref Group document')).error(() => 'Groups should be an array contain ObjectId'),
  role: Joi.objectId().error(() => 'Role should be an ObjectId ref Role document')
}

exports.User = User
exports.joiSchema_User = joiSchema