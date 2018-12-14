const mongoose = require('mongoose')

const Schema = new mongoose.Schema({
  route: {
    type: String,
    trim: true,
    required: true,
    unique: true
  },
  icon: {
    type: String,
    trim: true,
    lowercase: true
  },
  text: {
    type: String,
    trim: true,
    maxlength: 25,
    minlength: 3,
    required: true
  },
  nested: {
    type: Boolean,
    default: false,
    required: true
  },
  childs: {
    type: [ this ],
    required: function() { return this.nested }
  },
  groupsPrivilege: {
    type: [ { type: mongoose.Schema.Types.ObjectId, ref: 'Group'} ],
  },
  rolesPrivilege: {
    type: [ { type: mongoose.Schema.Types.ObjectId, ref: 'Role'} ],
  }
})

const Navigation = mongoose.model('Navigation', Schema)

exports.Navigation = Navigation