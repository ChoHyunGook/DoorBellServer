import db from "../../models/index.js";
import getDatabase from "../../lambdas/getDataBase.js";
import jwt from "jsonwebtoken";
import applyDotenv from "../../lambdas/applyDotenv.js";
import dotenv from "dotenv";
dotenv.config()

export default function CheckService(){

    const {
        access_jwt_secret,
    } = applyDotenv(dotenv)

    const User = db.User
    const dbo = getDatabase()
    const dbConnect = dbo.getDb()

    return {
        userInfoCheck(req, res) {
            try {
                const token = req.cookies.accessToken
                const data = jwt.verify(token, access_jwt_secret)
                jwt.verify(token, access_jwt_secret, (err, decoded) => {
                    if (err) {
                        res.status(400).json({message: "로그인이 되어있지 않습니다."})
                    } else {
                        User.find({userid: data.userid}, function (err, userInfo) {
                            res.status(200).send(userInfo)
                        })
                    }
                })
            } catch (e){
                if(e.name === 'TokenExpiredError'){
                    res.status(500).send('인증시간이 만료되었습니다.')
                }
            }
        },


        signCheck(req, res) {
            try {
                const token = req.cookies.accessToken
                jwt.verify(token, access_jwt_secret, (err, decoded) => {
                    if (err) {
                        res.status(400).json({message: "로그인이 되어있지 않습니다."})
                    }else{
                        res.status(200).json({message: "로그인이 되어있습니다."})
                    }
                })
            }catch (e) {
                if(e.name === 'TokenExpiredError'){
                    res.status(500).send('인증시간이 만료되었습니다.')
                }
            }
        },

        companyCheck(req, res) {
            try {
                const token = req.cookies.accessToken
                const data = jwt.verify(token, access_jwt_secret)

                jwt.verify(token, access_jwt_secret, (err) => {
                    if (err) {
                        res.status(400).send('로그인이 필요합니다.')
                    } else {
                        res.status(200).json(data.company)
                    }
                })
            }catch (e){
                if(e.name === 'TokenExpiredError'){
                    res.status(500).send('인증시간이 만료되었습니다.')
                }
            }

        },


        termsCheck(req,res){
            try {
                const token = req.cookies.termsToken
                const data = jwt.verify(token, access_jwt_secret)

                jwt.verify(token, access_jwt_secret, (err)=>{
                    if(err){
                        res.status(400).send('회원가입 약관동의 후 이용해주세요.')
                    }else{
                        res.status(200).send(`약관동의 상태: ${data.terms}`)
                    }
                })

            }catch (e){
                if(e.name === 'TokenExpiredError'){
                    res.status(500).send('약관동의 인증시간이 만료되었습니다.')
                }
            }
        },

        exclusiveCompanyCheck(req,res){
            try {
                const token = req.cookies.exclusiveToken
                const data = jwt.verify(token, access_jwt_secret)

                jwt.verify(token, access_jwt_secret, (err)=>{
                    if(err){
                        res.status(400).send(err)
                    }else{
                        res.status(200).send(data.company)
                    }
                })

            }catch (e){
                if(e.name === 'TokenExpiredError'){
                    res.status(500).send('인증시간이 만료되었습니다.')
                }
            }
        },

       exclusiveTokenCheck(req,res){
            try {
                const token = req.cookies.exclusiveToken
                const data = jwt.verify(token,access_jwt_secret)

                jwt.verify(token,access_jwt_secret,(err)=>{
                    if(err){
                        res.status(400).send(err)
                    }else{
                        res.status(200).send('전용관으로 입장함')
                    }
                })
            }catch (e){
                if(e.name === 'TokenExpiredError'){
                    res.status(500).send('인증시간이 만료되었습니다.')
                }else if(e.name === 'JsonWebTokenError'){
                    res.status(201).send('일반 회원가입')
                }else {
                }
            }
       },

        exclusiveNtermsNloginSignCheck(req, res) {
            try {
                res.clearCookie('dbDataToken')
                res.clearCookie('authModifyToken')
                res.clearCookie('authNumToken')
                res.clearCookie('exclusiveToken')
                res.clearCookie('termsToken')
                const token = req.cookies.accessToken
                jwt.verify(token, access_jwt_secret, (err, decoded) => {
                    if (err) {
                        res.status(400).json({message: "로그인이 되어있지 않습니다."})
                    }else{
                        res.status(200).json({message: "로그인이 되어있습니다."})
                    }
                })
            }catch (e) {
                if(e.name === 'TokenExpiredError'){
                    res.status(500).send('인증시간이 만료되었습니다.')
                }
            }
        },

        authModifySignCheck(req,res){
            try {
                const token = req.cookies.authModifyToken
                jwt.verify(token, access_jwt_secret,(err)=>{
                    if(err){
                        res.status(400).send('비밀번호 인증이 되어있지 않습니다.')
                    }else {
                        res.status(200).send('비밀번호 인증 중...')
                    }
                })
            }catch (e) {
                if(e.name === 'TokenExpiredError'){
                    res.status(500).send('인증시간이 만료되었습니다.')
                }
            }
        },

        searchDataCheck(req,res){
            try {
                const token = req.cookies.dbDataToken
                const data = jwt.verify(token,access_jwt_secret)

                jwt.verify(token,access_jwt_secret,(err)=>{
                    if(err){
                        res.status(400).send('검색결과 없음')
                    }else {
                        res.status(200).send(data.userData)
                    }
                })


            }catch (e) {
                if(e.name === 'TokenExpiredError'){
                    res.status(500).send('인증시간이 만료되었습니다.')
                }
            }
        }


    }
}