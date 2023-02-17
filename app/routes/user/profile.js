import express from "express";
import cors from "cors"
import dotenv from "dotenv"
import ProfileService from "../../services/userService/profileService.js";
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


app.post('/authModify',cors(corsOptions),(req,res)=>{
    ProfileService().authModify(req,res)
})


app.post('/editUser',cors(corsOptions),(req,res)=>{
    ProfileService().editUser(req,res)
})


app.post('/editEmailAdress',cors(corsOptions),(req,res)=>{
    ProfileService().editEmailAdress(req,res)
})


app.post('/editUserPhone',cors(corsOptions),(req,res)=>{
    ProfileService().editUserPhone(req,res)
})


app.post('/editUserPassword',cors(corsOptions),(req,res)=>{
    ProfileService().editUserPassword(req,res)
})
app.post('/withdrawUser',cors(corsOptions),(req,res)=>{
    ProfileService().withdrawUser(req,res)
})

export default app