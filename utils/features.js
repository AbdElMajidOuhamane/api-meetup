const dataUriParser =require("datauri/parser.js");
const path=require("path")
const {createTransport}=require("nodemailer");
const crypto = require('crypto');

function generateOTP(length = 6) {
  const digits = '0123456789';
  let OTP = '';

  for (let i = 0; i < length; i++) {
    OTP += digits[Math.floor(Math.random() * digits.length)];
  }

  return OTP;
}

const getDataUri=(file)=>{
    const parser=new dataUriParser();
    const extName=path.extname(file.originalname).toString();
    return parser.format(extName,file.buffer);
}

const sendEmail=async(subject,to,text)=>{
    const transporter=createTransport({
        
            host:process.env.SMPT_HOST ,
            port: process.env.SMPT_PORT,
            auth: {
              user:process.env.SMPT_USER,
              pass:process.env.SMPT_PASS 
            }
         
    })
    await transporter.sendMail({
        to,
        subject,
        text
    })
}


module.exports={getDataUri,sendEmail,generateOTP};