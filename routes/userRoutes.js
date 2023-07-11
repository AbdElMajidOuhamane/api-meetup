const express =require("express");
const { registerUser, loginUser, currentUser,logOut, updateProfile, changePassword, updatePic } = require("../controllers/userController");
const validateToken = require("../middleware/validateToken");
const  singleUpload  = require("../middleware/multer");
const router=express.Router()

router.post("/register",singleUpload,registerUser);

router.post("/login",loginUser);

router.get("/current",validateToken,currentUser);

router.post("/logout",logOut);

router.put("/updateprofile",validateToken,updateProfile);


router.put("/changepassword",validateToken,changePassword)

router.put("/updatepic",validateToken,singleUpload,updatePic)
module.exports=router