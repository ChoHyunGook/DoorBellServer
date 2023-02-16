import express from 'express'
import dotenv from "dotenv"
import morgan from 'morgan'
import cookieParser from "cookie-parser";


import db from "./app/models/index.js"
import ResponseService from "./app/lambdas/response.js";
import applyDotenv from "./app/lambdas/applyDotenv.js";

import user from "./app/routes/user/user.js";
import state from "./app/routes/auth/check.js"
import findInfo from "./app/routes/user/findInfo.js"
import table from "./app/routes/table/table.js";
import profile from "./app/routes/user/profile.js"
import sendService from "./app/routes/send/sendEmailSMS.js"


import auth from "./app/routes/auth/authHome.js"



async function startServer() {
    dotenv.config()
    const app = express()
    const {mongoUri ,port, db_name,session_secret } = applyDotenv(dotenv)


    //post 방식 일경우 begin
    //post 의 방식은 url 에 추가하는 방식이 아니고 body 라는 곳에 추가하여 전송하는 방식
    app.use(express.static('public'));
    app.use(express.urlencoded({extended: true})); // post 방식 세팅
    app.use(express.json()); // json 사용 하는 경우의 세팅

    app.use(cookieParser())


    //DB 연결 확인
    db.mongoose.set('strictQuery', false);
    db
        .mongoose
        .connect(mongoUri,{dbName:db_name})
        .then(() => {
            console.log(' ### 몽고DB 연결 성공 ### ')
        })
        .catch(err => {
            console.log(' 몽고DB와 연결 실패', err)
            process.exit();
        });
    //Admin(삭제예정)
    app.use("/auth", auth)
    //로그인, 로그아웃, 회원가입
    app.use("/users", user)
    //상태체크
    app.use("/states",state)
    //찾기서비스
    app.use("/findInfo",findInfo)
    //테이블
    app.use("/tables", table)
    //유저정보 변경
    app.use("/profiles", profile)
    //이메일,SMS 보내기
    app.use('/sendService',sendService)


    app.use(morgan('dev'))


    const responseService = new ResponseService()
    app.use((err, _req, res) => {
        if(err.name == "UnauthorizedError"){
            return responseService.unauthorizedResponse(res, err.message);
        }
    });

    app.listen(port, () => {
        console.log('***************** ***************** *****************')
        console.log('***************** ***************** *****************')
        console.log('********** 서버가 정상적으로 실행되고 있습니다 **********')
        console.log('***************** ***************** *****************')
        console.log('***************** ***************** *****************')
    })




}
startServer()