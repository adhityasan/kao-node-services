const mongoose = require('mongoose')
const Joi = require('joi')
const { Schema: TaskSchema } = require('@models/tasks')


const Schema = new mongoose.Schema({
  name: {
    type: String,
    trim: true,
    minlength: 5,
    maxlength: 100,
    index: { unique: true, dropDups: true },
    required: true
  },
  description: {
    type: String,
    maxlength: 255
  },
  main_url: String,
  data: Object,
  tasks: {
    type: [ TaskSchema ]
  }
})

const joiSchema = {
  name: Joi.string().min(5).max(100).required(),
  description: Joi.string().min(8).max(100).required(),
  main_url: Joi.string(),
  data: Joi.object().optional(),
  tasks: Joi.array().items(Joi.object().error(() => 'Roles item should be an Object')).error(() => 'Roles should be an array').optional()
}

const Role = mongoose.model('Role', Schema)

exports.Role = Role
exports.joiSchema_Role = joiSchema