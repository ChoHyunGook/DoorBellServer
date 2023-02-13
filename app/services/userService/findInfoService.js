import db from "../../models/index.js";
import getDatabase from "../../lambdas/getDataBase.js";
import jwt from "jsonwebtoken";
import applyDotenv from "../../lambdas/applyDotenv.js";
import dotenv from "dotenv";
import bcrypt from "bcrypt";
dotenv.config()


export default function FindInfoService(){
    const {
        access_jwt_secret
    } = applyDotenv(dotenv)

    const User = db.User
    const dbo = getDatabase()
    const dbConnect = dbo.getDb()

    return {
        checkSMSAuthNum(req, res) {
            try {
                const data = req.body
                const tokenData = req.cookies.authNumToken
                const verify = jwt.verify(tokenData, access_jwt_secret)
                if (data.signNum === verify.authNum) {
                    res.status(200).clearCookie('authNumToken', '').json({userid:verify.userid})
                } else {
                    res.status(403).send('인증번호가 일치하지 않습니다.')
                }
            }catch (e){
                if(e.name === 'TokenExpiredError'){
                    res.status(500).send('인증시간이 만료되었습니다.')
                }
            }

        },


        changePasswordPage(req, res) {
            try {
                const data = req.body
                const tokenData = req.cookies.authNumToken
                const verify = jwt.verify(tokenData, access_jwt_secret)

                if (data.authNum === verify.authNum) {
                    res.status(200).clearCookie('authNumToken', '').send('인증성공! 비밀번호 변경페이지로 이동합니다.')
                } else {
                    res.status(403).send('인증번호가 일치하지 않습니다.')
                }
            }
            catch (e){
                if(e.name === 'TokenExpiredError'){
                    res.status(500).send('인증시간이 만료되었습니다.')
                }
            }

        },

        findEditPassword(req, res) {
                const data = req.body
                const idData = data.userid
                const pwData = data.password
                const bcryptPwData = bcrypt.hashSync(pwData, 10)
                const insertPwData = {password: bcryptPwData}

                User.findOneAndUpdate(idData, {$set: insertPwData}, {upsert: true}, function (err) {
                    if (err) {
                        return res.status(400).send(err)
                    } else {
                        return res.status(200).clearCookie('authNumToken', '').send('비밀번호가 변경되었습니다.')
                    }
                })
        },
    }
}