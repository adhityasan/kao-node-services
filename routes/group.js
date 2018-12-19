const express = require('express')
const router = express.Router()
const { Group } = require('@models/groups')

const authorize = require('@middlewares/authorization')
const mongoosedocquery = require('@utils/mongoose-doc-query')

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

router.get('/', authorize, getGroups)

module.exports = router