const express =require("express");
const validateToken = require("../middleware/validateToken");
const { getAllPosts, getSinglePost, createPost } = require("../controllers/postController");
const router =express.Router();

router.use(validateToken);

router.route('/all').get(getAllPosts);
router.route('/single/:id').get(getSinglePost);
router.route("/new").post(createPost);



module.exports = router;