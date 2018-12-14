const mongoose = require('mongoose')

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
  main_url: {
    type: String
  },
  data: Object,
  roles: {
    type: [ { type: mongoose.Schema.Types.ObjectId, ref: 'Role'} ]
  }
})

const Group = mongoose.model('Group', Schema)

exports.Group = Group