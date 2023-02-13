import db from "../../models/index.js";
import getDatabase from "../../lambdas/getDataBase.js";
import jwt from "jsonwebtoken";
import applyDotenv from "../../lambdas/applyDotenv.js";
import dotenv from "dotenv";
import nodemailer from "nodemailer";

dotenv.config()

export default function EmailService(){
    const {
        access_jwt_secret,
        NODEMAILER_USER, NODEMAILER_PASS,
        NODEMAILER_SERVICE, NODEMAILER_HOST,

    } = applyDotenv(dotenv)

    const User = db.User
    const dbo = getDatabase()
    const dbConnect = dbo.getDb()

    return {
        sendEmail(req, res) {
            const data = req.body
            User.findOne({
                userid: data.userid
            }, function (err, user) {
                if (err) throw err
                if (!user) {
                    res
                        .status(401)
                        .send('해당 ID가 존재하지 않습니다.');
                } else {
                    let transporter = nodemailer.createTransport({
                        service: NODEMAILER_SERVICE,
                        host: NODEMAILER_HOST,
                        port: 587,
                        secure: false,
                        auth: {
                            user: NODEMAILER_USER,
                            pass: NODEMAILER_PASS
                        }
                    });

                    //인증번호 생성 및 토큰생성
                    let authNum = String(Math.floor(Math.random() * 1000000)).padStart(6, "0");

                    const authNumToken = jwt.sign({
                        userid: user.userid,
                        authNum: authNum
                    }, access_jwt_secret, {expiresIn: '5m'})

                    //인증 시 필요한 토큰 저장
                    res.cookie("authNumToken", authNumToken, {
                        secure: false,
                        httpOnly: true
                    })

                    transporter.sendMail({
                        from: `DoorBellSquare`,
                        to: req.body.userid,
                        subject: `[DoorBellSquare] ${req.body.emailSubject} 인증번호 서비스 입니다.`,
                        text: `안녕하세요 ${req.body.name} 고객님 아래의 인증번호를 확인하여 이메일 주소 인증을 완료해 주세요.\n 
                        인증번호: ${authNum} \n
                        해당 인증번호는 5분간 유효합니다.`

                    }, function (error, info) {
                        if (error) {
                            res.status(500).json({message: "발송실패!"})
                        }
                        res.send('이메일이 전송되었습니다. 인증번호 유효시간은 5분입니다.');
                    })
                    transporter.close()
                }
            })
        },

        sendModifyEmail(req, res) {
            const data = req.body

            User.findOne({userid:req.body.changeUserid},function (err,user) {
                if (err) throw err
                if (!user) {
                    let transporter = nodemailer.createTransport({
                        service: NODEMAILER_SERVICE,
                        host: NODEMAILER_HOST,
                        port: 587,
                        secure: false,
                        auth: {
                            user: NODEMAILER_USER,
                            pass: NODEMAILER_PASS
                        }
                    });

                    let authNum = String(Math.floor(Math.random() * 1000000)).padStart(6, "0");

                    const authNumToken = jwt.sign({
                        userid: data.changeUserid,
                        authNum: authNum
                    }, access_jwt_secret, {expiresIn: '5m'})


                    res.cookie("authNumToken", authNumToken, {
                        secure: false,
                        httpOnly: true
                    })

                    transporter.sendMail({
                        from: `DoorBellSquare`,
                        to: req.body.changeUserid,
                        subject: `[DoorBellSquare] ${req.body.emailSubject} 인증번호 서비스 입니다.`,
                        text: `안녕하세요 ${req.body.name} 고객님 아래의 인증번호를 확인하여 이메일 주소 인증을 완료해 주세요.\n 
                        인증번호: ${authNum} \n
                        해당 인증번호는 5분간 유효합니다.`

                    }, function (error, info) {
                        if (error) {
                            res.status(500).json({message: "발송실패!"})
                        }

                        res.send('이메일이 전송되었습니다. 인증번호 유효시간은 5분입니다.');
                    })
                    transporter.close()
                }
                else {
                    res.status(400).send('이미 사용중인 이메일(ID)입니다.')
                }
            })

        },

        sendContactMail(req,res){
            const data = req.body
            let transporter = nodemailer.createTransport({
                service: NODEMAILER_SERVICE,
                host: NODEMAILER_HOST,
                port: 587,
                secure: false,
                auth: {
                    user: NODEMAILER_USER,
                    pass: NODEMAILER_PASS
                }
            });

            const contact = data.contact
            const answer = data.answer
            const company = data.company
            const sendInfo = data.sendInfo
            const infoContent = data.infoContent


            transporter.sendMail({
                from: `DoorBellSquare`,
                to: 'danielcho@blaubit.co.kr',
                subject: `[DoorBellSquare] [${contact}] 1:1문의 요청`,
                text: `문의유형 : ${contact} \n
                소속 회사명 : ${company} \n
                답변 요청 유형 : ${answer} \n
                답변 받을 이메일 또는 전화번호 : ${sendInfo} \n
                ${infoContent} \n`

            }, function (error, info) {
                if (error) {
                    res.status(500).json({message: "발송실패!"})
                }
                res.send('이메일이 전송되었습니다. 인증번호 유효시간은 5분입니다.');
            })
            transporter.close()
        },



    }
}