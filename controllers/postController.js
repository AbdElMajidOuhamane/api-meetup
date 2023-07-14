const asyncHandler=require("express-async-handler")
const Post=require("../models/postModel.js"); 
const { default: mongoose } = require("mongoose");
const { getDataUri } = require("../utils/features.js");
const cloudinary=require("cloudinary")


const getAllPosts=asyncHandler(async(req,res)=>{
    // Search && Category query :
    const posts= await Post.find({});
   
    res.json({
        success:true,
        posts
        
    })

})


const getSinglePost=asyncHandler(async(req,res)=>{
    try {
        const postId = req.params.id;
        if (!mongoose.Types.ObjectId.isValid(postId)) {
          return res.status(400).json({ message: 'Invalid Post ID' });
        }
    
        const post = await Post.findById(postId).exec();
        if (post) {
          return res.json(post);
        } else {
          return res.status(404).json({ message: 'No Post found' });
        }
      } catch (err) {
        console.error(err); // Log the error for debugging purposes
        return res.status(500).json({ message: 'Error retrieving post' });
      }
})


//@desc POST a new Contact
//@route Post /api/contact/:id
//@access private 
const createPost = asyncHandler(async (req, res) => {
    try {
      const { title, description, location, date, time } = req.body;
      console.log(title, description, location, date, time);
      let image;
  
      if (req.file) {
        const file = getDataUri(req.file);
        // Upload the file to cloudinary
        const myCloud = await cloudinary.v2.uploader.upload(file.content);
        image = {
          public_id: myCloud.public_id,
          url: myCloud.secure_url
        };
      }
  
      if (!title || !description || !location || !date || !time) {
        return res.status(400).json({ error: "All fields are mandatory" });
      }
  
      const post = await Post.create({
        title,
        description,
        location,
        date,
        time,
        images: [image],
      });
  
      if (!post) {
        return res.status(500).json({ error: "Failed to create post" });
      }
  
      return res.status(201).json(post);
    } catch (error) {
      console.error("Error creating post:", error);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  });
  
module.exports={getAllPosts,getSinglePost,createPost}