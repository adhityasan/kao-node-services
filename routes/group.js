const express = require('express')
const router = express.Router()
const { Group, joiSchema_Group } = require('@models/groups')

const authorize = require('@middlewares/authorization')
const mongoosedocquery = require('@utils/mongoose-doc-query')
const { joiValidate, buildErrorResponse } = require('@utils/joi-validate')

async function getGroups(req, res) {
  let docquery = mongoosedocquery(req.query)
  
  try {
    const groups = await Group
      .find(docquery.find)
      .skip(docquery.skip)
      .limit(docquery.limit)
      .sort(docquery.sort)
      .select(docquery.select)

    res.send({ message: 'Success get groups data', data: groups })
  } catch (error) {
    res.status(400).send({ message: 'Fail to get groups data', errror: error })
  }
}

async function createGroup(req, res) {
  const data = req.body
  const { error: joiError } = joiValidate(data, joiSchema_Group)

  if (joiError) return res.status(400).send(buildErrorResponse(joiError))

  try {
    const newgroup = new Group(data)
    newgroup.save()

    return res.send({ message: 'Success create new group', data: newgroup })
  } catch (error) {
    return res.status(400).send({ message: 'Fail create new group', error: error })    
  }
}

router.get('/', authorize, getGroups)
router.post('/', authorize, createGroup)

module.exports = router