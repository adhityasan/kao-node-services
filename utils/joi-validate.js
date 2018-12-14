const Joi = require('joi')

function joiValidate(data, joiSchema, customPath = false) {
  let schema = {}

  if (customPath) {
    for (let path in data) {
      schema[path] = joiSchema[path]
    }
    return Joi.validate(data, schema)
  } else {
    schema = joiSchema
    return Joi.validate(data, schema)
  }
}

module.exports = joiValidate