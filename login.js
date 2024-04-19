const express = require('express')
const exSession = require('express-session')

const router = express.Router()

router.use(express.json())
router.use(exSession({
  secret: 'supersecret',
  resave: false,
  saveUninitialized: true,
  cookie: {}
}))

router.post('/login', (req, res) => {
  const testCredentials = { email: 'me@me.com', password: 'me' }
  const email = req.query.email
  const pwd = req.query.password

  if (String(email.toLowerCase()) === String(testCredentials.email) && pwd === testCredentials.password) {
    req.session.auth = 'authentifiziert'
    req.session.email = email
    req.session.pwd  = pwd
    res.status(200).send(req.session.auth)
  } else {
    res.sendStatus(403)
  }
})

router.get('/verify', (req, res) => {
  if (String(req.session.auth) === 'authentifiziert') {
    res.status(200).send(req.session.email)
  } else {
    res.sendStatus(401)
  }
})

router.delete("/logout", (req, res) => {
    if (req.session.email) {
        req.session.auth = "nicht authentifiziert"
        req.session.email = null
        req.session.pwd = null
        res.sendStatus(204)
    } else {
        res.sendStatus(401)
    }
})

module.exports = router
