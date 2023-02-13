import jwt from "jsonwebtoken";
import applyDotenv from "../../lambdas/applyDotenv.js";
import dotenv from "dotenv";
dotenv.config()


export default function AuthHomeCheckService(){
    const {
        access_jwt_secret,ADMIN_ID,ADMIN_PASSWORD
    } = applyDotenv(dotenv)


    return{
        authHomeCheck(req,res){
            try {
                const token = req.cookies.authLoginToken
                const data =jwt.verify(token,access_jwt_secret)
                jwt.verify(token,access_jwt_secret,(err)=>{
                    if(err){
                        res.status(400).json({message:'auth 인증이 되어있지 않습니다.'})
                    }else{
                        res.status(200).send('auth 인증 되어있음')
                    }
                })
            }catch (e){
                if(e.name === 'TokenExpiredError'){
                    res.status(500).send('auth 인증시간이 만료되었습니다.')
                }
            }
        },

        authLogin(req,res){
                const data =req.body
                const authId = data.authId
                const password = data.password

                if(authId !== ADMIN_ID){
                    res.status(400).send('관리자 아이디가 틀렸습니다.')
                }else {
                    if(password !== ADMIN_PASSWORD){
                        res.status(400).send('관리자 비밀번호가 틀렸습니다.')
                    }else{
                        const authLoginToken = jwt.sign({
                            adminId: authId
                        },access_jwt_secret,{expiresIn:'60m'})

                        res.cookie('authLoginToken',authLoginToken,{
                            secure:false,
                            httpOnly:true
                        })
                        res.status(200).send('관리자 로그인 성공')
                    }
                }
        }

    }

}