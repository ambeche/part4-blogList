const mongoose = require('mongoose');

mongoose.set('useFindAndModify', false);

const likesSubSchema = mongoose.Schema({
  liker: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  isLiked: {
    type: Boolean,
    default: 0
  },
  _id: { id: false }
});

const blogSchema = mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  author: {
    type: String,
    required: true
  },
  url: {
    type: String,
    required: true
  },
  likes: {
    value: { type: Number, default: 0 },
    users: [likesSubSchema]
  },
  reads: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  comments: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Comment'
    }
  ],
  numberOfComments: Number,
  linkPreview: {
    title: String,
    description: String,
    image: String,
    url: String
  },
  topics: [{
    type: String
  }]
});

blogSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    returnedObject.numberOfComments = returnedObject?.comments?.length;
    delete returnedObject._id;
    delete returnedObject.__v;
  }
});

module.exports = mongoose.model('Blog', blogSchema);
