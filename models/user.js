const mongoose = require('mongoose')

mongoose.set('useFindAndModify', false)

const userSchema = mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
  name:{
    type: String,
    required: true,
  },
  password: {
    type: String,

  }
})

userSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
    delete returnedObject.passwordHash
  }
})

module.exports = mongoose.model('User', userSchema)