const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const loginRouter = require('express').Router()
const User = require('../models/user')

loginRouter.post('/', async (req, res) => {
  const { password, username } = req.body

  const user = await User.findOne({ username })
  const isVerified = user && password ? await bcrypt.compare(password, user.passwordHash) : null

  if (!(user && isVerified)) return res.status(401).json({ error: 'invalid password or username' })

  const credentials = {
    username: user.username,
    id: user._id
  }
  const token = await jwt.sign(credentials, process.env.ENCODING)

  res.status(200).json({ token, username: user.username, name: user.name })
})

module.exports = loginRouter