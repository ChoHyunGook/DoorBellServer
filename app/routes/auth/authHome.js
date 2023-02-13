import express from "express";
import cors from "cors"
import dotenv from "dotenv"
import AuthHomeCheckService from "../../services/authService/authHomeCheckService.js";
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


app.get('/authHomeCheck',cors(corsOptions),(req,res)=>{
    AuthHomeCheckService().authHomeCheck(req,res)
})

app.post('/authLogin',cors(corsOptions),(req,res)=>{
    AuthHomeCheckService().authLogin(req,res)
})


export default app