const mongoose=require('mongoose')
const mailSender=require('../utils/mailSender');
const otpTemplate = require('../mail/templates/emailVerificationMail');
const OTPSchema=new mongoose.Schema({
    email:{
        type:String,
        required:true,
    },
    otp:{
        type:Number,
        required:true,
    },
    createdAt:{
        type:Date,
        default:Date.now(),
        expires:10*60*1000,
    }
})


// to send verfication email
const sendVerficationEmail=async(email,otp)=>{
    try {
        const mailResponse=await mailSender(email,"Verification Email",otpTemplate(otp));
        console.log("Email sent successfully:",mailResponse);

    } catch (error) {
        console.log("error occur while sending email:",error);
    }
}

OTPSchema.pre("save",async function (next){
    await sendVerficationEmail(this.email,this.otp);
    next();
})


module.exports=mongoose.model("Otp",OTPSchema)