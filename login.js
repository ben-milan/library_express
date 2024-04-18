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
    req.session.logIn = [{ email, pwd }]
    res.status(200).send(req.session.auth)
  } else {
    res.sendStatus(403)
  }
})

router.get('/verify', (req, res) => {
  if (String(req.session.auth) === 'authentifiziert') {
    res.status(200).send(req.session.logIn[0].email)
  } else {
    res.sendStatus(401)
  }
})

router.delete("/logout", (req, res) => {
    if (req.session.logIn && req.session.logIn[0]) {
        req.session.auth = "nicht authentifiziert"
        req.session.logIn[0].email = null
        req.session.logIn[0].pwd = null
        res.sendStatus(204)
    } else {
        res.sendStatus(401)
    }
})

module.exports = router
