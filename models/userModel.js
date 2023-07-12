const mongoose=require("mongoose");

const userSchema=mongoose.Schema({
    username:{
        type: String,
        required :[true,"Please add the user name"]
    },
    email:{
        type:String,
        required:[true,"Please add the user email"],
        unique:[true,"Email address  already taken"],
    },
    password:{
        type:String,
        required:[true,"Please add user password"],
    },
    avatar:{
        public_id:String,
        url:String
        
    },
    invalidatedTokens: {
        type: [String],
        default: [],
      },
    OTP:{
        otp: {
            type: Number,
          },
          otp_expire: {
            type: Date,
          },
     }
},
{
    timestamps:true,
})

module.exports= mongoose.model("User",userSchema)