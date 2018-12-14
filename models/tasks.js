const mongoose = require('mongoose')

const Schema = new mongoose.Schema({
  name: {
    type: String,
    minlength: 5,
    maxlength: 30
  },
  description: {
    type: String,
    maxlength: 255
  },
  action_url: String,
  data: Object
})

exports.Schema = Schema
exports.Task = mongoose.model('Task', Schema)