const mongoose = require('mongoose')
const Joi = require('joi')
Joi.objectId = require('joi-objectid')(Joi)

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

const joiSchema = {
  route: Joi.string().max(1024).required(),
  icon: Joi.string().max(50).optional(),
  text: Joi.string().max(30).required(),
  nested: Joi.boolean().required(),
  childs: Joi.array().items(Joi.object()).optional(),
  groupsPrivilege: Joi.array().items(Joi.objectId().error(() => 'groupsPrivilege items should be an objectId ref Group')).error(() => 'groupsPrivilege should be an array'),
  rolesPrivilege: Joi.array().items(Joi.objectId().error(() => 'rolesPrivilege items should be an objectId ref Group')).error(() => 'rolesPrivilege should be an array')
}

const Navigation = mongoose.model('Navigation', Schema)

exports.Navigation = Navigation
exports.joiSchema_Navigation = joiSchema