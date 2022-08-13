const Post = require("./post-model");

module.exports = {
  createPost: async (req, res) => {
    try {
      const post = await Post.create(req.body);
      res.send(post);
    } catch (error) {
      res.send(error.message);
    }
  },

  getPost: async (req, res) => {
    let posts;

    if (req.query.id) {
      posts = await Post.findById(req.query.id);
    } else {
      posts = await Post.find();
    }

    res.send(posts);
  },

  updatePost: async (req, res) => {
    const updatedPost = await Post.updateOne(req.body);
    res.send(updatedPost);
  },

  deletePost: async (req, res) => {
    const deletedPost = await Post.deleteOne(req.body);
    res.send(deletedPost);
  },
};
