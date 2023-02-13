import express from "express";
import cors from "cors"
import dotenv from "dotenv"
import TableService from "../../services/tableService/tableService.js";

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


app.post('/uploadOne',cors(corsOptions),(req,res)=>{
    TableService().create(req,res)
})

app.post('/findOne',cors(corsOptions),(req,res)=>{
    TableService().read(req,res)
})

app.post('/tableEdit',cors(corsOptions),(req,res)=>{
    TableService().update(req,res)
})

app.post('/delete',cors(corsOptions),(req,res)=>{
    TableService().delete(req,res)
})

app.post('/upload',cors(corsOptions),(req,res)=>{
    TableService().excelUpload(req,res)
})


app.get('/find',cors(corsOptions),(req,res)=>{
    TableService().tableByCompany(req,res)
})




export default app