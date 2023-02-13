import db from "../../models/index.js";
import getDatabase from "../../lambdas/getDataBase.js";
import jwt from "jsonwebtoken";
import applyDotenv from "../../lambdas/applyDotenv.js";
import dotenv from "dotenv";
dotenv.config()


export default function UserService(){

    const {
        access_jwt_secret, refresh_jwt_secret,
    } = applyDotenv(dotenv)

    const User = db.User
    const dbo = getDatabase()
    const dbConnect = dbo.getDb()


    return {
        join(req, res) {
            try{
                const data = req.body
                const tokenData = req.cookies.authNumToken
                const verify = jwt.verify(tokenData, access_jwt_secret)

                if (verify.authNum !== data.authNum) {
                    res.status(400).send('인증번호가 일치하지 않습니다.')
                } else {
                    if (verify.phone !== data.phone) {
                        res.status(400).send('인증받으신 핸드폰번호와 입력하신 핸드폰번호가 일치하지 않습니다.')
                    } else {
                        User.findOne({userid: req.body.userid}, function (err, user) {
                            if (err) throw err
                            if (!user) {
                                User.findOne({phone: req.body.phone}, function (err, user) {
                                    if (err) throw err
                                    if (!user) {
                                        new User(req.body).save((err) => {
                                            if (err) {
                                                res.status(500).send(err)
                                            } else {
                                                res.status(200)
                                                    .clearCookie('termsToken', '')
                                                    .clearCookie('exclusiveToken', '')
                                                    .json({message: '회원가입 성공!!!!!!', data: User})
                                            }
                                        })
                                    } else {
                                        return res.status(500).send('이미 사용중인 전화번호입니다. 다시 한번 확인해주세요!')
                                    }
                                })
                            } else {
                                return res.status(500).send('이미 사용중인 이메일 주소입니다 다시 한번 확인해 주세요!')
                            }
                        })
                    }
                }
            }catch (e){
                if(e.name === 'TokenExpiredError'){
                    res.status(500).send('인증시간이 만료되었습니다.')
                }
            }
        },





        login(req, res) {
            User.findOne({
                userid: req.body.userid
            }, function (err, user) {
                if (err) throw err
                if (!user) {
                    res
                        .status(401)
                        .send('해당 ID가 존재하지 않습니다.');
                } else {
                    user.comparePassword(req.body.password, function (_err, isMatch) {
                        if (!isMatch) {
                            res
                                .status(401)
                                .send('비밀번호를 다시 한번 확인해주세요.');
                        } else {
                            try {

                                const accessToken = jwt.sign({
                                    userid: user.userid,
                                    name: user.name,
                                    company: user.company
                                }, access_jwt_secret, {expiresIn: '30m'})

                                const refreshToken = jwt.sign({
                                    userid: user.userid,
                                    name: user.name,
                                    company: user.company
                                }, refresh_jwt_secret, {expiresIn: '24h'})


                                res.cookie("accessToken", accessToken, {
                                    secure: false,
                                    httpOnly: true
                                })
                                res.cookie("refreshToken", refreshToken, {
                                    secure: false,
                                    httpOnly: true
                                })
                                res.status(200)
                                    .clearCookie('termsToken', '')
                                    .clearCookie('exclusiveToken', '')
                                    .json({
                                        loginSuccess: true,
                                    })
                            } catch (err) {
                                res.status(400).json(err)
                            }
                        }
                    })
                }
            })
        },

        logout(req, res) {
            try {
                res.clearCookie('accessToken', '')
                    .clearCookie('authLoginToken','')
                    .clearCookie('authModifyToken')
                res.status(200).json({message: "logout success"})
            } catch (err) {
                res.status(400).json(err)
            }
        },

        agreeTermsConditions(req,res){
            const data =req.body
            const terms = data.termsConditions

            const termsToken = jwt.sign({
                terms:terms
            },access_jwt_secret)

            res.cookie('termsToken',termsToken,{
                secure:false,
                httpOnly:true
            })
            res.status(200).send('약관에 동의하셨습니다.')

        },

        companyOnlyConditions(req,res){
            const data =req.body
            const company = data.company

            const exclusiveToken = jwt.sign({
                company:company
            },access_jwt_secret)

            res.cookie('exclusiveToken',exclusiveToken,{
                secure:false,
                httpOnly:true
            })
            res.status(200).send(`${company} 전용관으로 이동됩니다.`)

        },





    }


}