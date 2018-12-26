const mongoose = require('mongoose')
const Joi = require('joi')
Joi.objectId = require('joi-objectid')(Joi)

const Schema = new mongoose.Schema({
  name: {
    type: String,
    trim: true,
    minlength: 5,
    maxlength: 30,
    index: { unique: true, dropDups: true },
    required: true
  },
  description: {
    type: String,
    maxlength: 255
  },
  main_url: {
    type: String
  },
  data: Object,
  roles: {
    type: [ { type: mongoose.Schema.Types.ObjectId, ref: 'Role'} ]
  }
})

const joiSchema = {
  name: Joi.string().min(5).max(30).required(),
  description: Joi.string().min(8).max(100).required(),
  main_url: Joi.string().optional(),
  data: Joi.object().optional(),
  roles: Joi.array().items(Joi.objectId().error(() => 'Roles item should be an ObjectId ref Role document')).error(() => 'Roles should be an array').optional()
}

const Group = mongoose.model('Group', Schema)

exports.Group = Group
exports.joiSchema_Group = joiSchema