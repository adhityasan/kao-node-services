const express = require('express')
const router = express.Router()
const { Role, joiSchema_Role } = require('@models/roles')

const { authorize_admin } = require('@middlewares/authorization')
const mongoosedocquery = require('@utils/mongoose-doc-query')
const { joiValidate, buildErrorResponse, isObjectId } = require('@utils/joi-validate')

async function getRoles(req, res) {
  let docquery = mongoosedocquery(req.query)
  
  try {
    const roles = await Role
      .find(docquery.find)
      .skip(docquery.skip)
      .limit(docquery.limit)
      .sort(docquery.sort)
      .select(docquery.select)

    res.send({ message: 'Success get roles data', data: roles })
  } catch (error) {
    res.status(400).send({ message: 'Fail to get roles data', errror: error })
  }
}

async function getRole(req, res) {
  const roleid = req.params.id
  const { error: joiError } = isObjectId(roleid)

  if (joiError) return res.status(400).send(buildErrorResponse(joiError))

  try {
    const role = await Role.findById(roleid)
    
    if (!role) return res.status(404).send({ message: 'Role with given id was not found', data: { _id: roleid }})
    
    res.send({ message: `Success get role, id: ${roleid}`, data: role })
  } catch (error) {
    res.status(400).send({ message: `Fail get role, id ${roleid}`, error: error })
  }
}

async function createRole(req, res) {
  const data = req.body
  const { error: joiError } = joiValidate(data, joiSchema_Role)

  if (joiError) return res.status(400).send(buildErrorResponse(joiError))

  try {
    const newrole = new Role(data)
    newrole.save()

    return res.send({ message: 'Success create new role', data: newrole })
  } catch (error) {
    return res.status(400).send({ message: 'Fail create new role', error: error })    
  }
}

async function updateRole(req, res) {
  const roleid = req.params.id
  const updates = req.body

  const { error: joiError } = isObjectId(roleid)

  if (joiError) return res.status(400).send(buildErrorResponse(joiError))
  
  try {
    const role = await Role.findById(roleid)

    if (!role) return res.status(404).send({ message: 'Role with given id was not found', data: { _id: roleid, ...updates } })

    role.set(updates)

    const saveResult = await role.save()

    res.send({ message: `Success update role, id: ${roleid}`, data: saveResult })
  } catch (error) {
    res.send({ message: `Fail update role, id: ${roleid}`, error: error })    
  }
}

async function deleteRole(req, res) {
  const roleid = req.params.id
  const { error: joiError } = isObjectId(roleid)

  if (joiError) return res.status(400).send(buildErrorResponse(joiError))

  try {
    const role = await Role.findByIdAndRemove(roleid)

    if (!role) return res.status(404).send({ message: 'Role with given id was not found', data: { _id: roleid, ...role }})

    res.send({ message: `Success delete role, id: ${roleid}`, data: role })
  } catch (error) {
    res.send({ message: `Fail delete role, id: ${roleid}`, error: error })
  }
}

router.get('/', authorize_admin, getRoles)
router.get('/:id', authorize_admin, getRole)
router.post('/', authorize_admin, createRole)
router.put('/:id', authorize_admin, updateRole)
router.delete('/:id', authorize_admin, deleteRole)

module.exports = router