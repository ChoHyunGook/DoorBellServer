import db from "../../models/index.js";
import getDatabase from "../../lambdas/getDataBase.js";
import jwt from "jsonwebtoken";
import applyDotenv from "../../lambdas/applyDotenv.js";
import dotenv from "dotenv";
import bcrypt from "bcrypt";

dotenv.config()


export default function ProfileService(){
    const {
        access_jwt_secret
    } = applyDotenv(dotenv)

    const User = db.User
    const dbo = getDatabase()
    const dbConnect = dbo.getDb()

    return {
        authModify(req,res){
            try {
                const data = req.body
                const userIdData = data.userid
                const pwData = data.password
                User.findOne({
                    userid:userIdData
                }, function (err,user){
                    if(err) throw err
                    if(!user){
                        res
                            .status(401)
                            .send('해당 ID가 존재하지 않습니다.');
                    }else {
                        user.comparePassword(pwData,function (_err, isMatch) {
                            if(!isMatch){
                                res.status(401).send('비밀번호가 틀렸습니다.')
                            }else{
                                const authModifyToken = jwt.sign({
                                    userid:userIdData,
                                    authCheck:'success'
                                },access_jwt_secret)

                                res.cookie("authModifyToken",authModifyToken,{
                                    secure: false,
                                    httpOnly: true
                                })
                                res.status(200).send('고객 정보수정페이지로 이동됩니다.')
                            }
                        })
                    }
                })

            }catch (e){
                if(e.name === 'TokenExpiredError'){
                    res.status(500).send('인증시간이 만료되었습니다.')
                }
            }

        },


        editUser(req, res) {
            try {
                const data = req.body
                const tokenData = req.cookies.authNumToken
                const verify = jwt.verify(tokenData, access_jwt_secret)

                    if(verify.authNum===data.authNum){
                        if(verify.changeName === data.name){
                            if(verify.name === data.name){
                                res.status(400).send('기존 이름과 변경하려는 이름이 동일합니다. 다시한번 확인해주세요.')
                            }else{
                                User.findOneAndUpdate({userid: data.userid}, {$set: data},
                                    function (err, data) {
                                        if (err) {
                                            res.status(400).send(err)
                                        } else {
                                            res.status(200).clearCookie('authNumToken', '').json({data: data, message: '수정 성공'})
                                        }
                                    })
                            }
                        }else{
                            res.status(400).send('인증 시 변경요청하신 성함과 현재 요청하신 성함이 동일하지 않습니다. 입력창을 확인해 주세요.')
                        }
                    }else {
                        res.status(400).send('인증번호가 일치하지 않습니다.')
                    }

            }catch (e){
                if(e.name === 'TokenExpiredError'){
                    res.status(500).send('인증시간이 만료되었습니다.')
                }
            }
        },


        editEmailAdress(req, res) {
            try {
                const data = req.body
                const token = req.cookies.authNumToken
                const tokenData = jwt.verify(token, access_jwt_secret)
                const beforeId = data.userid
                const afterId = data.changeUserid
                const ChangeId = {userid: afterId}

                User.findOne({userid:req.body.changeUserid},function (err,user) {
                    if (err) throw err
                    if (!user) {
                                if (tokenData.authNum === data.signNum) {
                                    if(tokenData.userid === data.changeUserid){
                                        User.findOneAndUpdate(beforeId, {$set: ChangeId}, {upsert: true}, function (err) {
                                            if (err) {
                                                return res.status(400).send(err)
                                            } else {
                                                return res.status(200).clearCookie('authNumToken', '').send('아이디가 변경되었습니다.')
                                            }
                                        })
                                    }else{
                                        res.status(400).send('인증받은 이메일과 다른 이메일이 변경요청되었습니다. 입력칸을 다시 한번 확인해주세요.')
                                    }

                                } else {
                                    res.send(400).send('인증번호가 틀립니다. 다시한번 확인해주세요.')
                                }
                    } else {
                        res.status(400).send('이미 사용중인 이메일(ID)입니다.')
                    }
                })
            }catch (e){
                if(e.name === 'TokenExpiredError'){
                    res.status(500).send('인증시간이 만료되었습니다.')
                }
            }
        },


        editUserPhone(req, res) {
            try {
                const data = req.body
                const tokenData = req.cookies.authNumToken
                const verify = jwt.verify(tokenData, access_jwt_secret)
                    if(verify.authNum === data.authNum){
                        if(verify.changePhoneNum === data.changePhoneNum){
                            if(verify.phone === data.changePhoneNum){
                                res.status(400).send('기존 등록된 전화번호와 변경하려는 전화번호가 동일합니다. 다시 한번 확인해주세요.')
                            }else{
                                User.findOneAndUpdate({userid: data.userid}, {$set: data},
                                    function (err, data) {
                                        if (err) {
                                            res.status(400).send(err)
                                        } else {
                                            res.status(200).clearCookie('authNumToken', '').json({data: data, message: '수정 성공'})
                                        }
                                    })
                            }
                        }else{
                            res.status(400).send('인증 시 변경요청하신 전화번호와 현재 요청하신 전화번호가 동일하지 않습니다. 입력창을 다시한번 확인해 주세요.')
                        }
                    }else{
                        res.status(400).send('인증번호가 일치하지 않습니다.')
                    }

            }catch (e){
                if(e.name === 'TokenExpiredError'){
                    res.status(500).send('인증시간이 만료되었습니다.')
                }
            }


        },





        editUserPassword(req, res) {
            try {
                const data = req.body
                const userIdData = data.userid
                const pwData = data.password
                const bcryptPwData = bcrypt.hashSync(pwData, 10)
                const insertPwData = {password: bcryptPwData}
                const token = req.cookies.authNumToken
                const verify = jwt.verify(token, access_jwt_secret)

                    if(verify.authNum === data.authNum){
                        if(verify.password === bcryptPwData){
                            res.status(400).send('기존에 등록되어있는 비밀번호와 변경하려는 비밀번호가 똑같습니다.')
                        }else{
                            User.findOne({userid:req.body.userid},function (err,user){
                                if (err) throw err
                                if(!user){
                                    res.status(400).send('해당 ID가 존재하지 않습니다.')
                                }else {
                                    user.comparePassword(data.confirmPassword,function (_err,isMatch){
                                        if(!isMatch){
                                            res
                                                .status(401)
                                                .send('기존 비밀번호를 다시 한번 확인해주세요.');
                                        }else {
                                            User.findOneAndUpdate(userIdData, {$set: insertPwData}, {upsert: true}, function (err) {
                                                if (err) {
                                                    return res.status(400).send(err)
                                                } else {
                                                    return res.status(200).clearCookie('authNumToken', '').send('비밀번호가 변경되었습니다.')
                                                }
                                            })
                                        }
                                    })
                                }
                            })
                        }
                    }else{
                        res.status(400).send('인증번호가 일치하지 않습니다.')
                    }
                } catch (e){
                if(e.name === 'TokenExpiredError'){
                    res.status(500).send('인증시간이 만료되었습니다.')
                }
            }
        },


        withdrawUser(req,res){
            try {
                const data = req.body
                const userIdData = data.userid
                const phoneData = data.phone
                const companyData = data.company
                const nameData = data.name
                const passwordData = data.password

                const token = req.cookies.accessToken
                const verify = jwt.verify(token, access_jwt_secret)
                const authToken =req.cookies.authModifyToken
                const authVerify =jwt.verify(authToken,access_jwt_secret)


                if(authVerify.authCheck === 'success'){
                    if(verify.userid !== authVerify.userid){
                        res.status(400).send('로그인 시 유저 아이디와 정보수정 유저아이디가 동일하지 않습니다.')
                    }else {
                        User.findOne({userid:userIdData},function (err,user){
                            if (err) throw err
                            if(!user){
                                res.status(400).send('해당 ID가 존재하지 않습니다.')
                            }else {
                                user.comparePassword(passwordData, function (_err,isMatch){
                                    if(!isMatch){
                                        res
                                            .status(401)
                                            .send('비밀번호가 틀렸습니다.');
                                    }else {
                                        User.deleteMany({userid:userIdData,phone:phoneData,company:companyData,name:nameData}
                                            ,function (err){
                                                if(err){
                                                    res.status(400).send('일치하는 회원이 없습니다.')
                                                }else{
                                                    res.status(200).send('[DoorBellSquare] 회원탈퇴가 완료되었습니다. 그동안 이용해주셔서 감사합니다.')
                                                }
                                            })
                                    }
                                })
                            }
                        })
                    }
                }else {
                    res.status(400).send('잘못된 경로 입니다.')
                }




            }catch (e){
                if(e.name === 'TokenExpiredError'){
                    res.status(500).send('인증시간이 만료되었습니다.')
                }
            }


        }

    }

}