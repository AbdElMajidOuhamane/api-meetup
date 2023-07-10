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
    const user=await User.findById(req.user.id)
    user.password = undefined;
    res.json(user);
})


//@desc Logout user
//@route POST /api/user/logout
//@access private

const logOut =asyncHandler(async (req,res)=>{
    
    const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    res.status(401);
    throw new Error("Authorization token not found");
  }

  try {
    // Blacklist the token by adding it to the invalidatedTokens list
    // Alternatively, you can remove the token from the client-side storage or perform any other necessary operations
    const decoded = jwt.decode(token);
    const user = await User.findById(decoded.user.id);

    if (user) {
      user.invalidatedTokens.push(token);
      await user.save();
    }

    res.status(200).json({ message: "User logged out successfully" });
  } catch (error) {
    res.status(500);
    throw new Error("Error logging out the user");
  }
  
})




module.exports={ registerUser,loginUser,currentUser,logOut }