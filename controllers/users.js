const bcrypt = require('bcrypt')
const usersRouter = require('express').Router()
const User = require('../models/user')

usersRouter.get('/', async (req, res) => {
  const users = await User.find({})
  res.json(users.map(u => u.toJSON()))
})

usersRouter.post('/', async (req, res) => {
  const { username, name, password } = req.body
  console.log(username,name)
  const passwordHash = await bcrypt.hash(password, 10)

  const newUser = new User ({
    username,
    name,
    passwordHash
  })

  const savedUser = await newUser.save()
  res.status(201).json(savedUser.toJSON())
})

module.exports = usersRouter