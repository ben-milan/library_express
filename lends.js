const express = require('express')
const lends = require('./lends.json')
const path = require('path')

const router = express.Router()

router.use(express.json())

router.get('/lends', (req, res) => {
  res.sendFile(path.join(__dirname, '/lends.json'))
})

router.get('/lends/:id', (req, res) => {
  const id = req.params.id
  const lend = lends.find(lend => String(lend.id) === String(id))

  if (lend !== undefined) {
    res.status(200).json(lend)
  } else {
    res.sendStatus(404)
  }
})

router.post('/lends', (req, res) => {
  const lend = req.body

  if (lend.id && lend.customer_id && lend.isbn && lend.borrowed_at) {
    lends.push(lend)
    res.status(201).json(lend)
  } else {
    res.sendStatus(422)
  }
})

router.delete('/lends/:id', (req, res) => {
  const id = req.params.id
  const lendIdx = lends.findIndex(lend => String(lend.id) === String(id))

  if (lendIdx !== -1) {
    lends.splice(lendIdx, 1)
    res.sendStatus(200)
  } else {
    res.sendStatus(404)
  }
})

module.exports = router
