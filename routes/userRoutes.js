const express =require("express");
const { registerUser, loginUser, currentUser,logOut } = require("../controllers/userController");
const validateToken = require("../middleware/validateToken");
const router=express.Router()

router.post("/register",registerUser);

router.post("/login",loginUser);

router.get("/current",validateToken,currentUser);

router.post("/logout",logOut);


module.exports=router