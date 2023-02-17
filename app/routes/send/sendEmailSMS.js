import express from "express";
import cors from "cors"
import dotenv from "dotenv"
import EmailService from "../../services/sendService/emailService.js";
import SMSService from "../../services/sendService/smsService.js"
import UserService from "../../services/userService/userService.js";

dotenv.config()

const corsOptions = {
    origin : process.env.ORIGIN,
    optionsSuccessStatus : 200
}
const app = express()

app.use(cors({
    origin:true,
    credentials: true
}))

app.use(function(_req, res, next) {
    res.header(
        "Access-Control-Allow-Tabletheaders",
        "x-access-token, Origin, Content-Type, Accept",
        "Access-Control-Allow-Origin", "*"
    );
    next();
});


app.post('/sendMail',cors(corsOptions),async (req,res)=>{
    EmailService().sendEmail(req,res)
});

app.post('/sendModifyEmail',cors(corsOptions),(req,res)=>{
    EmailService().sendModifyEmail(req,res)
});

app.post('/sendContactMail',cors(corsOptions),(req,res)=>{
    EmailService().sendContactMail(req,res)
})






app.post('/sendJoinSMS',cors(corsOptions),(req,res)=>{
    SMSService().sendJoinSMS(req,res)
})



app.post('/findIdSendSMS',cors(corsOptions),(req,res)=>{
    SMSService().findIdSendSMS(req,res)
})

app.post('/sendFindPwSMS',cors(corsOptions),(req,res)=>{
    SMSService().sendFindPwSMS(req,res)
})

//프로필
app.post('/sendEditNameSMS',cors(corsOptions),(req,res)=>{
    SMSService().sendEditNameSMS(req,res)
})
app.post('/sendEditPhoneSMS',cors(corsOptions),(req,res)=>{
    SMSService().sendEditPhoneSMS(req,res)
})
app.post('/sendEditPasswordSMS',cors(corsOptions),(req,res)=>{
    SMSService().sendEditPasswordSMS(req,res)
})




export default app