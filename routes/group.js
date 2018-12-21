const express = require('express')
const router = express.Router()
const { Group, joiSchema_Group } = require('@models/groups')

const { authorize_admin } = require('@middlewares/authorization')
const mongoosedocquery = require('@utils/mongoose-doc-query')
const { joiValidate, buildErrorResponse, isObjectId } = require('@utils/joi-validate')

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

async function getGroup(req, res) {
  const groupid = req.params.id
  const { error: joiError } = isObjectId(groupid)

  if (joiError) return res.status(400).send(buildErrorResponse(joiError))

  try {
    const group = await Group.findById(groupid)
    
    if (!group) return res.status(404).send({ message: 'Group with given id was not found', data: { _id: groupid }})
    
    res.send({ message: `Success get group, id: ${groupid}`, data: group })
  } catch (error) {
    res.status(400).send({ message: `Fail get group, id ${groupid}`, error: error })
  }
}

async function createGroup(req, res) {
  const data = req.body
  const { error: joiError } = joiValidate(data, joiSchema_Group)

  if (joiError) return res.status(400).send(buildErrorResponse(joiError))

  try {
    const newgroup = new Group(data)
    const saveResult = await newgroup.save()

    return res.send({ message: 'Success create new group', data: saveResult })
  } catch (error) {
    return res.status(400).send({ message: 'Fail create new group', error: error })    
  }
}

async function updateGroup(req, res) {
  const groupid = req.params.id
  const updates = req.body

  const { error: joiError } = isObjectId(groupid)

  if (joiError) return res.status(400).send(buildErrorResponse(joiError))
  
  try {
    const group = await Group.findById(groupid)

    if (!group) return res.status(404).send({ message: 'Group with given id was not found', data: { _id: groupid, ...updates } })

    group.set(updates)

    const saveResult = await group.save()

    res.send({ message: `Success update group, id: ${groupid}`, data: saveResult })
  } catch (error) {
    res.send({ message: `Fail update group, id: ${groupid}`, error: error })    
  }
}

async function deleteGroup(req, res) {
  const groupid = req.params.id
  const { error: joiError } = isObjectId(groupid)

  if (joiError) return res.status(400).send(buildErrorResponse(joiError))

  try {
    const group = await Group.findByIdAndRemove(groupid)

    if (!group) return res.status(404).send({ message: 'Group with given id was not found', data: { _id: groupid, ...group }})

    res.send({ message: `Success delete group, id: ${groupid}`, data: group })
  } catch (error) {
    res.send({ message: `Fail delete group, id: ${groupid}`, error: error })
  }
}

router.get('/', authorize_admin, getGroups)
router.get('/:id', authorize_admin, getGroup)
router.post('/', authorize_admin, createGroup)
router.put('/:id', authorize_admin, updateGroup)
router.delete('/:id', authorize_admin, deleteGroup)

module.exports = router