const asyncHandler=require("express-async-handler");
const User = require("../models/userModel");
const bcrypt = require("bcrypt");
const jwt=require("jsonwebtoken")

//@desc Register user
//@route POST /api/user/register
//@access public


const registerUser =asyncHandler(async (req,res)=>{
    const {username,email,password}=req.body;
    if(!username || !email || !password){
        res.status(400);
        throw new Error("All Fields are mandatory");
    }
    const userAvailable=await User.findOne({email});
     if(userAvailable){
        res.status(400);
        throw new Error("User already register");
     }
     //Hash Password 
    const hashedPassword=await bcrypt.hash(password,10);
    console.log(hashedPassword);
    const user= await User.create({
        username,
        email,
        password:hashedPassword
    })
    console.log(`User Create User ${user}`);
    if(user){
        res.status(201).json({
            _id: user.id,
            email: user.email});
    }else{
        res.status(400);
        throw new Error("User data is not valid");
    }
    res.json({message:"Register The User"});
})

//@desc Login user
//@route POST /api/user/login
//@access public


const loginUser =asyncHandler(async (req,res)=>{
    const {email,password}=req.body;
    if(!email || !password){
        res.status(400);
        throw new Error("All fields are mandetoly!");
    }
    const user=await User.findOne({email});
    //compare password with hashed password
    const comparePassword=await  bcrypt.compare(password,user.password)
    if(user && comparePassword){
        const accessToken=jwt.sign({
            user:{
                username:user.username,
                email:user.email,
                id:user.id,
            },
        },process.env.ACCESS_TOKEN_SECRET,
        {expiresIn:"15m"}
        )
        res.status(200).json({accessToken})
    }else{
        res.status(400);
        throw new Error("Email or Password is not available")
    }
    res.json({message:"Login The User"});
})


//@desc current user
//@route POST /api/user/currnet
//@access private


const currentUser =asyncHandler(async (req,res)=>{
    res.json(req.user);
})




module.exports={ registerUser,loginUser,currentUser }