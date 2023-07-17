const express =require("express");
const validateToken = require("../middleware/validateToken");
const { getAllPosts, getSinglePost, createPost, updatePost, deletePost, getMyPosts } = require("../controllers/postController");
const router =express.Router();

router.use(validateToken);

router.route('/all').get(getAllPosts);
router.route('/my').get(getMyPosts);
router.route('/single/:id').get(getSinglePost);
router.route("/new").post(createPost);
router.route("/single/:id").put(updatePost).delete(deletePost);




module.exports = router;