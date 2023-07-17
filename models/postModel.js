const mongoose=require("mongoose");

const postSchema=mongoose.Schema({
    user_id:{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
        ref:"user"
     },
    title:{
        type:String,
        required:[true,"Please Enter Title Of The Event !!"]
    },
    description:{
        type:String,
        required:[true,"Add Description Of The Event"]
    },
    date:{
        type:String,
        required:[true,"Please Add a day of the event"]
    },
    time:{
        type:String,
        required:[true,"Give the HH:MM of the event"]
    },
    location:{
        type:String,
        required:[true,"add the location of the event ."]
    },
    images:[{
        public_id:String,
        url:String
    }],
    category:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Category"
    },
    createdAt:{
        type:Date,
        default:Date.now
    }

})

module.exports =mongoose.model("Post",postSchema);