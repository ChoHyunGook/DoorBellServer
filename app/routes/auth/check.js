import express from "express";
import cors from "cors"
import dotenv from "dotenv"
import CheckService from "../../services/authService/checkService.js";
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


app.get('/userInfoCheck',cors(corsOptions),(req,res)=>{
    CheckService().userInfoCheck(req,res)
})

app.get("/signCheck", cors(corsOptions), (req, res) => {
    CheckService().signCheck(req,res)
});

app.get("/companyCheck",cors(corsOptions),(req,res)=>{
    CheckService().companyCheck(req,res)
})

app.get("/termsCheck",cors(corsOptions),(req,res)=>{
    CheckService().termsCheck(req,res)
})

app.get('/exclusiveCompanyCheck',cors(corsOptions),(req,res)=>{
    CheckService().exclusiveCompanyCheck(req,res)
})

app.get('/exclusiveTokenCheck',cors(corsOptions),(req,res)=>{
    CheckService().exclusiveTokenCheck(req,res)
})

app.get('/signAllCheck',cors(corsOptions),(req,res)=>{
    CheckService().exclusiveNtermsNloginSignCheck(req,res)
})

app.get('/authModifySignCheck',cors(corsOptions),(req,res)=>{
    CheckService().authModifySignCheck(req,res)
})







export default app