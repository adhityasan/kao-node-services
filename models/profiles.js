const mongoose = require('mongoose')
const Joi = require('joi')

const Schema = new mongoose.Schema({
  name: {
    type: String,
    minlength: 8,
    maxlength: 100,
    require: true
  },
  email: {
    type: Array,
    required: true    
  },
  age: {
    type: Number,
    min: 5,
    max: 100
  },
  address: {
    type: String,
    minlength: 8,
    maxlength: 255,
  },
  phone: {
    type: String,
    minlength: 11
  },
  url: String,
  bio: String
})

Schema.virtual('firstName').get(function () {
  return this.name.split(' ')[0]
})

Schema.virtual('lastName').get(function () {
  let splitted = this.name.split(' ')
  let lastIndex = splitted.length - 1
  return splitted[lastIndex]
})

const Profile = mongoose.model('Profile', Schema)

const joiSchema = {
  name: Joi.string().required(),
  email: Joi.array(),
  age: Joi.number().required(),
  address: Joi.string(),
  phone: Joi.string(),
  url: Joi.string().allow(''),
  bio: Joi.string().allow('')
}

exports.Profile = Profile
exports.joiSchema_Profile = joiSchema