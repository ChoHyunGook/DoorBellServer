import db from "../../models/index.js";
import getDatabase from "../../lambdas/getDataBase.js";
import jwt from "jsonwebtoken";
import applyDotenv from "../../lambdas/applyDotenv.js";
import dotenv from "dotenv";
import bcrypt from "bcrypt";
import CryptoJS from 'crypto-js';

import axios from "axios";
dotenv.config()

export default function SmsService(){
    const {
        access_jwt_secret, refresh_jwt_secret,
        SMS_service_id,SMS_secret_key,SMS_access_key,SMS_PHONE
    } = applyDotenv(dotenv)

    const User = db.User
    const dbo = getDatabase()
    const dbConnect = dbo.getDb()

    return {

        findIdSendSMS (req,res){
            const data = req.body
            let ck = true;

            User.findOne({name:req.body.name, phone:req.body.phoneNum},function (err,user) {
                if (err) throw err
                if (!user) {
                    res.status(500).send('등록되어있지 않는 이름 또는 핸드폰 번호입니다. 다시 한번 확인해 주세요.')
                }else{
                    const user_phone = req.body.phoneNum
                    const phoneNumber = user_phone.split("-").join("");
                    const userName = req.body.name
                    const phoneSubject = req.body.phoneSubject
                    const date = Date.now().toString()

                    //환경변수들
                    const serviceId = SMS_service_id;
                    const secretKey = SMS_secret_key;
                    const accessKey = SMS_access_key;
                    const smsPhone = SMS_PHONE;

                    //그외
                    const method = "POST";
                    const space = " ";
                    const newLine = "\n";
                    const url = `https://sens.apigw.ntruss.com/sms/v2/services/${serviceId}/messages`;
                    const url2 = `/sms/v2/services/${serviceId}/messages`;



                    //signature 작성 : crypto-js 모듈을 이용하여 암호화
                    const hmac = CryptoJS.algo.HMAC.create(CryptoJS.algo.SHA256, secretKey);
                    hmac.update(method);
                    hmac.update(space);
                    hmac.update(url2);
                    hmac.update(newLine);
                    hmac.update(date);
                    hmac.update(newLine);
                    hmac.update(accessKey);
                    const hash = hmac.finalize();
                    const signature = hash.toString(CryptoJS.enc.Base64);

                    //인증번호 생성 및 토큰생성
                    let authNum = String(Math.floor(Math.random() * 1000000)).padStart(6, "0");

                    const authNumToken = jwt.sign({
                        phone: phoneNumber,
                        authNum: authNum,
                        name: userName,
                        userid: user.userid
                    }, access_jwt_secret, {expiresIn: '3m'})

                    //인증 시 필요한 토큰 저장
                    res.cookie("authNumToken", authNumToken, {
                        secure: false,
                        httpOnly: true
                    })


                    axios({
                        method:method,
                        json:true,
                        url:url,
                        headers: {
                            "Contenc-type": "application/json; charset=utf-8",
                            "x-ncp-iam-access-key": accessKey,
                            "x-ncp-apigw-timestamp": date
                            ,
                            "x-ncp-apigw-signature-v2": signature,
                        },
                        data:{
                            type:"SMS",
                            countryCode: "82",
                            from: smsPhone,
                            content: `[DoorbellSquare]\n [${phoneSubject} 서비스]\n 인증번호는 [${authNum}] 입니다.`,
                            messages: [{ to: `${phoneNumber}` }],
                        },
                    });
                    return res.status(200).send('인증번호가 전송되었습니다. 인증번호 유효시간은 3분입니다.')
                }
            })

        },


        //비밀번호찾기-문자인증
        sendFindPwSMS(req,res){
            const data = req.body
            let ck = true;

            User.findOne({userid:req.body.userid, phone:req.body.phone},function (err,user) {
                if (err) throw err
                if (!user) {

                    res.status(500).send('등록되어있지 않는 아이디(이메일) 또는 핸드폰 번호입니다. 다시 한번 확인해 주세요.')
                }else{

                    const user_phone = req.body.phone
                    const phoneNumber = user_phone.split("-").join("");
                    const phoneSubject = req.body.phoneSubject
                    const date = Date.now().toString()

                    //환경변수들
                    const serviceId = SMS_service_id;
                    const secretKey = SMS_secret_key;
                    const accessKey = SMS_access_key;
                    const smsPhone = SMS_PHONE;

                    //그외
                    const method = "POST";
                    const space = " ";
                    const newLine = "\n";
                    const url = `https://sens.apigw.ntruss.com/sms/v2/services/${serviceId}/messages`;
                    const url2 = `/sms/v2/services/${serviceId}/messages`;

                    //signature 작성 : crypto-js 모듈을 이용하여 암호화
                    const hmac = CryptoJS.algo.HMAC.create(CryptoJS.algo.SHA256, secretKey);
                    hmac.update(method);
                    hmac.update(space);
                    hmac.update(url2);
                    hmac.update(newLine);
                    hmac.update(date);
                    hmac.update(newLine);
                    hmac.update(accessKey);
                    const hash = hmac.finalize();
                    const signature = hash.toString(CryptoJS.enc.Base64);

                    //인증번호 생성 및 토큰생성
                    let authNum = String(Math.floor(Math.random() * 1000000)).padStart(6, "0");

                    const authNumToken = jwt.sign({
                        phone: phoneNumber,
                        authNum: authNum,
                        userid: req.body.userid,
                    }, access_jwt_secret, {expiresIn: '3m'})

                    //인증 시 필요한 토큰 저장
                    res.cookie("authNumToken", authNumToken, {
                        secure: false,
                        httpOnly: true
                    })

                    axios({
                        method:method,
                        json:true,
                        url:url,
                        headers: {
                            "Contenc-type": "application/json; charset=utf-8",
                            "x-ncp-iam-access-key": accessKey,
                            "x-ncp-apigw-timestamp": date
                            ,
                            "x-ncp-apigw-signature-v2": signature,
                        },
                        data:{
                            type:"SMS",
                            countryCode: "82",
                            from: smsPhone,
                            content: `[DoorbellSquare]\n [${phoneSubject} 서비스]\n 인증번호는 [${authNum}] 입니다.`,
                            messages: [{ to: `${phoneNumber}` }],
                        },
                    });
                    return res.status(200).send('인증번호가 전송되었습니다. 인증번호 유효시간은 3분입니다.')
                }
            })
        },

        //프로필-이름변경-문자인증
        sendEditNameSMS(req,res){
            const data = req.body
            let ck = true;

            User.findOne({userid:req.body.userid, phone:req.body.phoneNum},function (err,user) {
                if (err) throw err
                if (!user) {
                    res.status(500).send('등록되어있지 않는 아이디(이메일) 또는 핸드폰 번호입니다. 다시 한번 확인해 주세요.')
                }else{
                    const user_phone = req.body.phoneNum
                    const phoneNumber = user_phone.split("-").join("");
                    const phoneSubject = req.body.phoneSubject
                    const beforeName = req.body.name
                    const AfterName = req.body.changeName
                    const date = Date.now().toString()

                    const serviceId = SMS_service_id;
                    const secretKey = SMS_secret_key;
                    const accessKey = SMS_access_key;
                    const smsPhone = SMS_PHONE;

                    const method = "POST";
                    const space = " ";
                    const newLine = "\n";
                    const url = `https://sens.apigw.ntruss.com/sms/v2/services/${serviceId}/messages`;
                    const url2 = `/sms/v2/services/${serviceId}/messages`;



                    const hmac = CryptoJS.algo.HMAC.create(CryptoJS.algo.SHA256, secretKey);
                    hmac.update(method);
                    hmac.update(space);
                    hmac.update(url2);
                    hmac.update(newLine);
                    hmac.update(date);
                    hmac.update(newLine);
                    hmac.update(accessKey);
                    const hash = hmac.finalize();
                    const signature = hash.toString(CryptoJS.enc.Base64);

                    let authNum = String(Math.floor(Math.random() * 1000000)).padStart(6, "0");

                    const authNumToken = jwt.sign({
                        phone: phoneNumber,
                        name: beforeName,
                        changeName:AfterName,
                        authNum: authNum,
                        userid: req.body.userid,
                    }, access_jwt_secret, {expiresIn: '3m'})


                    res.cookie("authNumToken", authNumToken, {
                        secure: false,
                        httpOnly: true
                    })


                    axios({
                        method:method,
                        json:true,
                        url:url,
                        headers: {
                            "Contenc-type": "application/json; charset=utf-8",
                            "x-ncp-iam-access-key": accessKey,
                            "x-ncp-apigw-timestamp": date
                            ,
                            "x-ncp-apigw-signature-v2": signature,
                        },
                        data:{
                            type:"SMS",
                            countryCode: "82",
                            from: smsPhone,
                            content: `[DoorbellSquare]\n [${phoneSubject} 서비스]\n 인증번호는 [${authNum}] 입니다.`,
                            messages: [{ to: `${phoneNumber}` }],
                        },
                    });
                    return res.status(200).send('인증번호가 전송되었습니다. 인증번호 유효시간은 3분입니다.')
                }
            })
        },

        //프로필-전화번호변경-문자인증
        sendEditPhoneSMS(req,res){

            const data = req.body


            User.findOne({userid:req.body.userid, phone:req.body.phoneNum},function (err,user) {
                if (err) throw err
                if (!user) {

                    res.status(500).send('등록되어있지 않는 아이디(이메일) 또는 핸드폰 번호입니다. 다시 한번 확인해 주세요.')
                }else{

                    const user_phone = req.body.phoneNum
                    const phoneNumber = user_phone.split("-").join("");
                    const phoneSubject = req.body.phoneSubject
                    const beforePhone = req.body.phoneNum
                    const AfterPhone = req.body.phone
                    const date = Date.now().toString()


                    const serviceId = SMS_service_id;
                    const secretKey = SMS_secret_key;
                    const accessKey = SMS_access_key;
                    const smsPhone = SMS_PHONE;


                    const method = "POST";
                    const space = " ";
                    const newLine = "\n";
                    const url = `https://sens.apigw.ntruss.com/sms/v2/services/${serviceId}/messages`;
                    const url2 = `/sms/v2/services/${serviceId}/messages`;




                    const hmac = CryptoJS.algo.HMAC.create(CryptoJS.algo.SHA256, secretKey);
                    hmac.update(method);
                    hmac.update(space);
                    hmac.update(url2);
                    hmac.update(newLine);
                    hmac.update(date);
                    hmac.update(newLine);
                    hmac.update(accessKey);
                    const hash = hmac.finalize();
                    const signature = hash.toString(CryptoJS.enc.Base64);


                    let authNum = String(Math.floor(Math.random() * 1000000)).padStart(6, "0");

                    const authNumToken = jwt.sign({
                        phone: beforePhone,
                        changePhoneNum:AfterPhone,
                        authNum: authNum,
                        userid: req.body.userid,

                    }, access_jwt_secret, {expiresIn: '3m'})


                    res.cookie("authNumToken", authNumToken, {
                        secure: false,
                        httpOnly: true
                    })


                    axios({
                        method:method,
                        json:true,
                        url:url,
                        headers: {
                            "Contenc-type": "application/json; charset=utf-8",
                            "x-ncp-iam-access-key": accessKey,
                            "x-ncp-apigw-timestamp": date
                            ,
                            "x-ncp-apigw-signature-v2": signature,
                        },
                        data:{
                            type:"SMS",
                            countryCode: "82",
                            from: smsPhone,
                            content: `[DoorbellSquare]\n [${phoneSubject} 서비스]\n 인증번호는 [${authNum}] 입니다.`,
                            messages: [{ to: `${phoneNumber}` }],
                        },
                    });
                    return res.status(200).send('인증번호가 전송되었습니다. 인증번호 유효시간은 3분입니다.')
                }
            })
        },



        sendEditPasswordSMS(req,res){
            const data = req.body

            User.findOne({userid:data.userid, phone:data.phone},function (err,user) {
                if (err) throw err
                if (!user) {
                    res.status(500).send('등록되어있지 않는 아이디(이메일) 또는 핸드폰 번호입니다. 다시 한번 확인해 주세요.')
                }else{
                    const user_phone = req.body.phone
                    const phoneNumber = user_phone.split("-").join("");
                    const phoneSubject = req.body.phoneSubject

                    const beforePw = req.body.password
                    const beforeBcryptPwData = bcrypt.hashSync(beforePw, 10)
                    const beforeInsertPwData = {password: beforeBcryptPwData}

                    const AfterPw = req.body.changePassword
                    const afterBcryptPwData = bcrypt.hashSync(AfterPw, 10)
                    const afterInsertPwData = {password: afterBcryptPwData}

                    const date = Date.now().toString()

                    const serviceId = SMS_service_id;
                    const secretKey = SMS_secret_key;
                    const accessKey = SMS_access_key;
                    const smsPhone = SMS_PHONE;


                    const method = "POST";
                    const space = " ";
                    const newLine = "\n";
                    const url = `https://sens.apigw.ntruss.com/sms/v2/services/${serviceId}/messages`;
                    const url2 = `/sms/v2/services/${serviceId}/messages`;



                    const hmac = CryptoJS.algo.HMAC.create(CryptoJS.algo.SHA256, secretKey);
                    hmac.update(method);
                    hmac.update(space);
                    hmac.update(url2);
                    hmac.update(newLine);
                    hmac.update(date);
                    hmac.update(newLine);
                    hmac.update(accessKey);
                    const hash = hmac.finalize();
                    const signature = hash.toString(CryptoJS.enc.Base64);


                    let authNum = String(Math.floor(Math.random() * 1000000)).padStart(6, "0");

                    const authNumToken = jwt.sign({
                        password: beforeInsertPwData,
                        changePassword:afterInsertPwData,
                        authNum: authNum,
                        userid: req.body.userid,

                    }, access_jwt_secret, {expiresIn: '3m'})


                    res.cookie("authNumToken", authNumToken, {
                        secure: false,
                        httpOnly: true
                    })

                    axios({
                        method:method,
                        json:true,
                        url:url,
                        headers: {
                            "Contenc-type": "application/json; charset=utf-8",
                            "x-ncp-iam-access-key": accessKey,
                            "x-ncp-apigw-timestamp": date
                            ,
                            "x-ncp-apigw-signature-v2": signature,
                        },
                        data:{
                            type:"SMS",
                            countryCode: "82",
                            from: smsPhone,
                            content: `[DoorbellSquare]\n [${phoneSubject} 서비스]\n 인증번호는 [${authNum}] 입니다.`,
                            messages: [{ to: `${phoneNumber}` }],
                        },
                    });
                    return res.status(200).send('인증번호가 전송되었습니다. 인증번호 유효시간은 3분입니다.')
                }
            })
        },


        sendJoinSMS(req,res){
            const data = req.body

            User.findOne({phone:data.phone},function (err,user) {

                if (err) throw err
                if (!user) {

                    const user_phone = req.body.phone
                    const phoneNumber = user_phone.split("-").join("");
                    const phoneSubject = req.body.phoneSubject

                    const date = Date.now().toString()


                    const serviceId = SMS_service_id;
                    const secretKey = SMS_secret_key;
                    const accessKey = SMS_access_key;
                    const smsPhone = SMS_PHONE;


                    const method = "POST";
                    const space = " ";
                    const newLine = "\n";
                    const url = `https://sens.apigw.ntruss.com/sms/v2/services/${serviceId}/messages`;
                    const url2 = `/sms/v2/services/${serviceId}/messages`;



                    const hmac = CryptoJS.algo.HMAC.create(CryptoJS.algo.SHA256, secretKey);
                    hmac.update(method);
                    hmac.update(space);
                    hmac.update(url2);
                    hmac.update(newLine);
                    hmac.update(date);
                    hmac.update(newLine);
                    hmac.update(accessKey);
                    const hash = hmac.finalize();
                    const signature = hash.toString(CryptoJS.enc.Base64);


                    let authNum = String(Math.floor(Math.random() * 1000000)).padStart(6, "0");

                    const authNumToken = jwt.sign({
                        authNum: authNum,
                        phone: req.body.phone,

                    }, access_jwt_secret, {expiresIn: '3m'})


                    res.cookie("authNumToken", authNumToken, {
                        secure: false,
                        httpOnly: true
                    })

                    axios({
                        method:method,
                        json:true,
                        url:url,
                        headers: {
                            "Contenc-type": "application/json; charset=utf-8",
                            "x-ncp-iam-access-key": accessKey,
                            "x-ncp-apigw-timestamp": date
                            ,
                            "x-ncp-apigw-signature-v2": signature,
                        },
                        data:{
                            type:"SMS",
                            countryCode: "82",
                            from: smsPhone,
                            content: `[DoorbellSquare]\n [${phoneSubject} 서비스]\n 인증번호는 [${authNum}] 입니다.`,
                            messages: [{ to: `${phoneNumber}` }],
                        },
                    });
                    return res.status(200).send('인증번호가 전송되었습니다. 인증번호 유효시간은 3분입니다.')
                }else{
                    res.status(500).send('이미 등록되어있는 핸드폰번호입니다. 이미 가입하셨다면 아이디/비밀번호찾기를 이용해주세요.')
                }
            })
        },





    }
}