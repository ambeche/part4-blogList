const uniqueValidator = require('mongoose-unique-validator');
const mongoose = require('mongoose');

mongoose.set('useFindAndModify', false);

const userSchema = mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    minlength: 3,
    set: (username) => username.toLowerCase()
  },
  name: {
    type: String
  },
  passwordHash: String,
  blogs: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Blog'
    }
  ],
  numberOfBlogs: {
    type: Number,
    default: function () {
      return this.blogs.length;
    }
  }
});

userSchema.plugin(uniqueValidator);

userSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
    delete returnedObject.passwordHash;
  }
});

module.exports = mongoose.model('User', userSchema);
