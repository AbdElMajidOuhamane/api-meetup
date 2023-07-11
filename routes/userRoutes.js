const express =require("express");
const { registerUser, loginUser, currentUser,logOut, updateProfile, changePassword } = require("../controllers/userController");
const validateToken = require("../middleware/validateToken");
const router=express.Router()

router.post("/register",registerUser);

router.post("/login",loginUser);

router.get("/current",validateToken,currentUser);

router.post("/logout",logOut);

router.put("/updateprofile",validateToken,updateProfile);


router.put("/changepassword",validateToken,changePassword)
module.exports=router