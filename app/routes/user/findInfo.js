import express from "express";
import cors from "cors"
import dotenv from "dotenv"
import FindInfoService from "../../services/userService/findInfoService.js";
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
        "Access-Control-Allow-Headers",
        "x-access-token, Origin, Content-Type, Accept",
        "Access-Control-Allow-Origin", "*"
    );
    next();
});




app.post('/findEditPassword',cors(corsOptions),(req,res)=>{
    FindInfoService().findEditPassword(req,res)
})

app.post('/changePasswordPage',cors(corsOptions),(req,res)=>{
    FindInfoService().changePasswordPage(req,res)
})

app.post('/checkSMSAuthNum',cors(corsOptions),(req,res)=>{
    FindInfoService().checkSMSAuthNum(req,res)
})



export default app