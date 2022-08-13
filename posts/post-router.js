const Router = require("../framework/Router");
const {
  getPost,
  createPost,
  updatePost,
  deletePost,
} = require("./post-controller");

const router = new Router();

router.get("/posts", getPost);
router.post("/posts", createPost);
router.put("/posts", updatePost);
router.delete("/posts", deletePost);

module.exports = router;
