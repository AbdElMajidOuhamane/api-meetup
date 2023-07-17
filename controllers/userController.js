const asyncHandler=require("express-async-handler");
const User = require("../models/userModel");
const bcrypt = require("bcrypt");
const jwt=require("jsonwebtoken");
const  {getDataUri,sendEmail, generateOTP}  = require("../utils/features");
const cloudinary =require("cloudinary")
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
     let avatar=undefined;
     if(req.file){
          const file = getDataUri(req.file);
        //cloudinary
        const myCloud=await cloudinary.v2.uploader.upload(file.content)
        avatar={
          public_id:myCloud.public_id,
          url:myCloud.secure_url
        }
     }
   
     //Hash Password 
    const hashedPassword=await bcrypt.hash(password,10);
    console.log(hashedPassword);
    const user= await User.create({
        avatar,
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


const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    res.status(400);
    throw new Error("All fields are mandatory!");
  }
  const user = await User.findOne({ email });
  // compare password with hashed password
  const comparePassword = await bcrypt.compare(password, user.password);
  if (!user && !comparePassword) {
   res.json({
      success:true,
      message:"Email or Password is not valid",
    });
  } 
  if(user && comparePassword) {
    const accessToken = jwt.sign(
      {
        user: {
          username: user.username,
          email: user.email,
          id: user.id,
        },
      },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "7d" }
    );
    res.status(200).json({ accessToken });
    
  }
});

//@desc current user
//@route POST /api/user/currnet
//@access private


const currentUser =asyncHandler(async (req,res)=>{
    const user=await User.findById(req.user.id)
    user.password = undefined;
    res.json(user);
})


//@desc update user
//@route PUT /api/user/updateprofile
//@access private


const updateProfile =asyncHandler(async (req,res)=>{
    const { username, email } = req.body;
  
    // Find the user by ID
    const user = await User.findById(req.user.id);
  
    if (!user) {
      res.status(404);
      throw new Error("User not found");
    }
  
    // Update the user's username and email
    if (username) user.username = username;
    if (email) user.email = email;
  
    await user.save();
  
    res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      user: {
        _id: user._id,
        username: user.username,
        email: user.email,
      },
    });
})



//@desc update user password
//@route PUT /api/user/updatepassword
//@access private


const changePassword =asyncHandler(async (req,res)=>{
    const { currentPassword, newPassword } = req.body;
  
  // Find the user by ID
  const user = await User.findById(req.user.id);

  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  // Compare the current password with the one stored in the database
  const isMatch = await bcrypt.compare(currentPassword, user.password);

  if (!isMatch) {
    res.status(400);
    throw new Error("Invalid current password");
  }

  // Hash the new password
  const hashedPassword = await bcrypt.hash(newPassword, 10);

  // Update the user's password
  user.password = hashedPassword;
  await user.save();

  res.json({ message: "Password updated successfully" });

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



//@desc pic user
//@route PUT /api/user/updatepic
//@access private


const updatePic =asyncHandler(async (req,res)=>{
    const user=await User.findById(req.user.id);

   
      const file = getDataUri(req.file);
      await cloudinary.v2.uploader.destroy(user.avatar.public_id);
    //cloudinary
    const myCloud=await cloudinary.v2.uploader.upload(file.content);
    user.avatar={
      public_id:myCloud.public_id,
      url:myCloud.secure_url
    }
    // console.log
    await user.save()
    console.log(user)
    res.json({
      success:true,
      message:"Avatar Updated successfully",
    });
})


//@desc current user
//@route POST /api/user/currnet
//@access private
const forgetPassword = asyncHandler(async (req, res, next) => {
  const { email } = req.body;
  const user = await User.findOne({ email });

  if (!user) {
    res.status(404);
    throw new Error("Incorrect Email");
  }

  // Generate OTP
  const otp = generateOTP(); // Implement a secure OTP generation method
  const otpExpire = new Date(Date.now() + 100 * 60 * 1000);

  // Update user document with OTP
  user.OTP = {
    otp:otp,
    otp_expire: otpExpire,
  };
  console.log(user.OTP)
  await user.save().catch((error) => {
    console.error('Validation error:', error);
  });

  const message = `Your OTP for resetting password is ${otp}. Please use it within 15 minutes.`;

  try {
    await sendEmail("OTP for Resetting Password", user.email, message);
  } catch (error) {
    // Handle email sending error
    user.otp = null;
    await user.save();
    return next(new Error("Failed to send email. Please try again."));
  }

  res.json({
    success: true,
    message: `Email sent to ${user.email}`,
  });
});

//@desc current user
//@route POST /api/user/currnet
//@access private

const resetPassword = asyncHandler(async (req, res) => {
  const { otp, password } = req.body;
  // console.log(User.OTP.findOne({otp}))
  const user = await User.findOne({
    "OTP.otp": otp,
    "OTP.otp_expire": { $gt: Date.now() },
  });

  if (!user) {
    res.status(400).json({ error: "Incorrect OTP or it has expired" });
    return;
  }
  const hashedPassword=await bcrypt.hash(password,10);
  user.password = hashedPassword;
  user.OTP = {
    otp:undefined,
    otp_expire: undefined,
  };
  await user.save();

  res.json({
    success: true,
    message: "Password changed successfully. You can now log in.",
  });
});


module.exports={ registerUser,loginUser,currentUser,logOut,updateProfile,changePassword,updatePic,forgetPassword,resetPassword }