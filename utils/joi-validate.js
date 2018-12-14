const _ = require('lodash')
const Joi = require('joi')

function joiValidate(data, joiSchema, customPath=false, abortEarly=false) {
  let schema = {}

  if (customPath) {
    for (let path in data) {
      schema[path] = joiSchema[path]
    }
    return Joi.validate(data, schema, {abortEarly: abortEarly})
  } else {
    schema = joiSchema
    return Joi.validate(data, schema, {abortEarly: abortEarly})
  }
}

function buildErrorResponse(joiError) {
  if (joiError.isJoi) {
    
    if (!joiError.details.length > 1) {
      return new Object({ 
        message: joiError.details[0].message, 
        data: joiError.details[0] 
      })
    } else {
      const messages = _.map(joiError.details, function(x) {
        return x.message
      })
      return new Object({ 
        message: messages.join(', '), 
        data: joiError.details 
      })
    }

  } else {
    return {
      message: 'Something went wrong and it\'s not from joi validation',
      data: joiError._object
    }
  }
}

exports.joiValidate = joiValidate
exports.buildErrorResponse = buildErrorResponse