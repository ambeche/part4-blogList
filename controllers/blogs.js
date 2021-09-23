const jwt = require('jsonwebtoken');
const blogsRouter = require('express').Router();
const Blog = require('../models/blog');
const Comment = require('../models/comment');
const User = require('../models/user');

const decodeAndVerifyToken = async (req, res) => {
  const decodedToken = await jwt.verify(req.token, process.env.ENCODING);

  if (!decodedToken.id)
    return res.status(401).json({ error: 'token missing or invalid' });

  return decodedToken;
};

blogsRouter.get('/', async (req, res) => {
  const blogs = await Blog.find({})
    .populate('user', { username: 1, name: 1 })
    .populate('comments', { commentedBlog: 0 });
  res.json(blogs);
});

blogsRouter.post('/', async (req, res) => {
  const blog = req.body;

  const decodedToken = await decodeAndVerifyToken(req, res);
  const user = await User.findById(decodedToken.id);

  //if (blog.likes.value === undefined) blog.likes.value = 0;

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
  const decodedToken = await decodeAndVerifyToken(req, res);

  const likedblog = await Blog.findById(req.params.id);

  // verifies whether a blog has already been liked, hance like/unlike a blog
  // the isLiked properter combined with the userId controlls whether a blog is liked or not
  // no multiple likes

  const likerExists = likedblog.likes.users.find(
    (user) => user.liker?.toString() === decodedToken.id.toString()
  );

  const isEmpty = likedblog.likes.users.length === 0;

  const setLiker = (isLiked) =>
    likedblog.likes.users.map((user) =>
      user.liker?.toString() === decodedToken.id.toString()
        ? { liker: decodedToken.id, isLiked }
        : user
    );

  const likers = likerExists?.isLiked
    ? setLiker(false)
    : isEmpty || !likerExists
      ? [...likedblog.likes.users, { liker: decodedToken.id, isLiked: true }]
      : setLiker(true);

  likedblog.likes = {
    value:
      likerExists && likerExists?.isLiked
        ? likedblog.likes.value - 1
        : req.body.likes.value,
    users: likers
  };
  await likedblog.save();

  // responds with accociated fields populated
  const updated = await Blog.findById(req.params.id)
    .populate('user', { username: 1, name: 1 })
    .populate('comments', { commentedBlog: 0 });
  res.json(updated.toJSON());
});

blogsRouter.delete('/:id', async (req, res) => {
  const decodedToken = await decodeAndVerifyToken(req, res);

  // verifies that the authenticated user is authorized to delete the blog.
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
