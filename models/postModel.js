const mongoose=require("mongoose");

const postSchema=mongoose.Schema({
    title:{
        type:String,
        required:[true,"Please Enter Title Of The Event !!"]
    },
    description:{
        type:String,
        required:[true,"Add Description Of The Event"]
    },
    date:{
        type:Date,
        required:[true,"Please Add a day of the event"]
    },
    time:{
        type:Date,
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

module.exports =postSchema;