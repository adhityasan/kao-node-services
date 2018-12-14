const mongoose = require('mongoose')
const { Schema: TaskSchema } = require('@models/tasks')


const Schema = new mongoose.Schema({
  name: {
    type: String,
    trim: true,
    minlength: 5,
    maxlength: 30,
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

const Role = mongoose.model('Role', Schema)

exports.Role = Role