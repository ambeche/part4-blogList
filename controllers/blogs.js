const jwt = require('jsonwebtoken');
const blogsRouter = require('express').Router();
const Blog = require('../models/blog');
const Comment = require('../models/comment');
const User = require('../models/user');

const decodeToken = async (req) =>
  await jwt.verify(req.token, process.env.ENCODING);

blogsRouter.get('/', async (req, res) => {
  const blogs = await Blog.find({})
    .populate('user', { username: 1, name: 1 })
    .populate('comments', { commentedBlog: 0 });
  res.json(blogs);
});

blogsRouter.post('/', async (req, res) => {
  const blog = req.body;

  const decodedToken = await decodeToken(req);
  if (!decodedToken.id)
    return res.status(401).json({ error: 'token missing or invalid' });

  const user = await User.findById(decodedToken.id);

  if (blog.likes === undefined) blog.likes = 0;

  blog.user = user._id;
  const newblog = new Blog(blog);

  const savedBlog = await newblog.save();
  user.blogs = user.blogs.concat(savedBlog._id);
  await user.save();
  console.log('savedblog', savedBlog);

  const createdblogWithAssociatedIdsPopulated = await Blog.findById(
    savedBlog._id
  ).populate('user', { username: 1, name: 1 });
  console.log('blog', createdblogWithAssociatedIdsPopulated);

  res.status(201).json(createdblogWithAssociatedIdsPopulated.toJSON());
});

blogsRouter.put('/:id', async (req, res) => {
  const updated = await Blog.findByIdAndUpdate(
    req.params.id,
    { likes: req.body.likes },
    {
      new: true
    }
  )
    .populate('user', { username: 1, name: 1 })
    .populate('comments', { commentedBlog: 0 });
  res.json(updated.toJSON());
});

blogsRouter.delete('/:id', async (req, res) => {
  const decodedToken = await decodeToken(req);
  if (!decodedToken)
    return res.status(401).json({ error: 'token missing or invalid' });

  const blog = await Blog.findById(req.params.id);
  const user = await User.findById(decodedToken.id);
  const isVerified =
    blog && user ? blog.user.toString() === user.id.toString() : false;

  if (!isVerified)
    return res
      .status(401)
      .json({ error: 'Blog deletion is only authorized to the author!' });

  await Blog.findByIdAndRemove(req.params.id);

  // deletes all comments associated with the deleted blog
  if (blog.comments.length)
    await Promise.all(() =>
      blog.comments.map((comment) => Comment.findByIdAndDelete(comment._id))
    );

  user.blogs = user.blogs.filter(
    (blogId) => blogId.toString() !== req.params.id.toString()
  );
  await user.save();
  res.status(204).end();
});

blogsRouter.post('/:id/comments', async (req, res) => {
  const content = req.body;
  console.log('cmt', req.body);

  if (!content) return res.status(400).end('content is required');

  const blog = await Blog.findById(req.params.id);
  // creates a comment and adds it to the comments field of the associated blog doc
  const createdComment = await new Comment({
    ...content,
    commentedBlog: blog._id
  }).save();

  blog.comments = [...blog.comments, createdComment._id];

  await blog.save();

  const commentedBlog = await Blog.findById(req.params.id)
    .populate('user', { username: 1, name: 1 })
    .populate('comments', { commentedBlog: 0 });

  res.status(201).json(commentedBlog.toJSON());
});

module.exports = blogsRouter;
