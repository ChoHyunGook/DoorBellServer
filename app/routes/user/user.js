import express from "express";
import cors from "cors"
import dotenv from "dotenv"
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
        "Access-Control-Allow-Headers",
        "x-access-token, Origin, Content-Type, Accept",
        "Access-Control-Allow-Origin", "*"
    );
    next();
});

app.post('/join', cors(corsOptions), (req,res)=>{
    UserService().join(req,res)
})
app.post('/login',cors(corsOptions),(req,res)=>{
    UserService().login(req,res)
})

app.get('/logout',cors(corsOptions),(req,res)=>{
    UserService().logout(req,res)
})

app.post('/terms',cors(corsOptions),(req,res)=>{
    UserService().agreeTermsConditions(req,res)
})

app.post('/exclusive',cors(corsOptions),(req,res)=>{
    UserService().companyOnlyConditions(req,res)
})




export default app


