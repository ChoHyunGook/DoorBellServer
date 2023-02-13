import dotenv from 'dotenv'
import applyDotenv from "../lambdas/applyDotenv.js";
import moment from "moment-timezone";

export default function TableDataBase(mongoose){
    const{mongoUri, port} = applyDotenv(dotenv)
    const getCurrentTime = ()=>{
        const m = moment().tz("Asia/Seoul")
        return m.format('YYYY.MM.DD HH:mm:ss')
    }

    const tableSchema = new mongoose.Schema({
        contract:{type:String,required:true,unique:true},
        terminalNum:{type:String, required:true},
        contractName:{type:String,required:true},
        contractSortation:{type:String,required:true},
        id:{type:String,required:true},
        phoneNum:{type:String,required:true},
        communication: {type:String,required:true},
        serviceType:{type:String,required:true},
        serviceRegitDate: {type:String,required:true},
        serviceCloseDate: {type:String,required:true},
        open:{type:String,required:true},
    },{versionKey:false});


    return mongoose.model('Table',tableSchema)
}