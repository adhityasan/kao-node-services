const _ = require('lodash')
const Joi = require('joi')
Joi.objectId = require('joi-objectid')(Joi)

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
        error: joiError.details[0] 
      })
    } else {
      const messages = _.map(joiError.details, function(x) {
        return x.message
      })
      return new Object({ 
        message: messages.join(', '), 
        error: joiError.details 
      })
    }

  } else {
    return {
      message: 'Something went wrong and it\'s not from joi validation',
      error: joiError._object
    }
  }
}

function isObjectId(id) {
  const schema = { id: Joi.objectId().error(() => 'The given id is not a valid ObjectId')}
  const data = { id: id }
  return Joi.validate(data, schema)
}

exports.joiValidate = joiValidate
exports.buildErrorResponse = buildErrorResponse
exports.isObjectId = isObjectId