const express = require('express')
const router = express.Router()
const { Navigation, joiSchema_Navigation } = require('@models/navigations')
const { authorize_admin } = require('@middlewares/authorization')

const { joiValidate, isObjectId, buildErrorResponse } = require('@utils/joi-validate')

async function getNavigations(req, res) {
  try {
    const navigations = await Navigation.find({})

    res.send({ message: 'Success get all navigations', data: navigations })
  } catch (error) {
    res.status(404).send({ message: 'Fail get navigations data', error: error })
  }
}

async function getNavigation(req, res) {
  const navid = req.params.id
  const { error: joiError_id } = isObjectId(navid)

  if (joiError_id) return res.status(400).send(buildErrorResponse(joiError_id))

  try {
    const navigation = await Navigation.findById(navid)

    if (!navigation) return res.status(404).send({ message: 'Navigation with given id was not found', data: { _id: navid, ...navigation } })

    res.send({ message: `Success get Navigation, id: ${navid}`, data: navigation })
  } catch (error) {
    res.status(404).send({ message: `Fail get Navigation, id: ${navid}`, error: error })    
  }
}

async function createNavigation(req, res) {
  const data = req.body
  const { error : joiError_data } = joiValidate(data, joiSchema_Navigation, true)

  if (joiError_data) return res.status(400).send(buildErrorResponse(joiError_data))

  try {
    const newNav = new Navigation(data)
    const saveResult = await newNav.save()

    res.send({ message: `Success create new Navigation, id: ${saveResult._id}`, data: saveResult })
  } catch (error) {
    res.status(400).send({ message: 'Fail create new Navigation', error: error })
  }
}

async function updateNavigation(req, res) {
  const navid = req.params.id
  const updates = req.body

  const { error: joiError_id } = isObjectId(navid)
  const { error: joiError_body } = joiValidate(updates, joiSchema_Navigation, true)

  if (joiError_id) return res.status(400).send(buildErrorResponse(joiError_id))
  if (joiError_body) return res.status(400).send(buildErrorResponse(joiError_body))

  try {
    const navigation = await Navigation.findByIdAndUpdate(navid, { $set: updates }, { new: true })
    
    if (!navigation) return res.status(404).send({ message: 'Navigation with given id was not found', data: { _id: navid, ...navigation } })
    
    res.send({ message: `Succes update Navigation, id: ${navid}`, data: navigation })
  } catch (error) {
    res.status(400).send({ message: `Fail update Navigation, id: ${navid}`, error: error })
  }
}

async function deleteNavigation(req, res) {
  const navid = req.params.id
  const { error: joiError_id } = isObjectId(navid)

  if (joiError_id) return res.status(400).send(buildErrorResponse(joiError_id))

  try {
    const navigation = await Navigation.findByIdAndRemove(navid)

    if (!navigation) return res.status(404).send({ message: 'Navigation with given id was not found', data: { _id: navid, ...navigation }})

    res.send({ message: `Success delete navigation, id: ${navid}`, data: navigation })
  } catch (error) {
    res.send({ message: `Fail delete navigation, id: ${navid}`, error: error })
  }
}

router.get('/', authorize_admin, getNavigations)
router.post('/', authorize_admin, createNavigation)
router.get('/:id', authorize_admin, getNavigation)
router.put('/:id', authorize_admin, updateNavigation)
router.delete('/:id', authorize_admin, deleteNavigation)

module.exports = router
