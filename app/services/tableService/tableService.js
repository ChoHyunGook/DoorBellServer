import applyDotenv from "../../lambdas/applyDotenv.js";
import dotenv from "dotenv";
import db from "../../models/index.js";
import getDatabase from "../../lambdas/getDataBase.js";
import jwt from "jsonwebtoken";
dotenv.config()

export default function TableService(){

    const {mongoUri ,port, db_name, access_jwt_secret, refresh_jwt_secret } = applyDotenv(dotenv)

    const Table = db.Table
    const dbo = getDatabase()
    const dbConnect = dbo.getDb()

    return{
        create(req,res){
            try {
                Table.findOne({contract:req.body.contract},function (err,tables){
                    if(err) throw err
                    if(!tables){
                        const bodyData = req.body;
                        new Table(bodyData).save((err)=>{
                            if(err){
                                return res.status(400).send(err)
                            }else {
                                return res.status(200).send('계약자가 추가 되었습니다.')
                            }
                        })
                    }else {
                        res.status(400).send('이미 존재하는 계약번호 입니다. 다시 한번 확인해 주세요.')
                    }
                })
            }catch (e){
                if(e.name === 'TokenExpiredError'){
                    res.status(500).send('로그인 시간이 만료되었습니다.')
                }
            }

        },

        read(req,res){
            const data = req.body
            let searchType = data.selectBox
            const searchTarget = data.searchText


            const token = req.cookies.accessToken
            const tokenData = jwt.verify(token,access_jwt_secret)

            try {
                jwt.verify(token,access_jwt_secret,(err)=>{
                    if(err){
                        res.status(400).send('로그인 후 사용해주세요')
                    }
                    else {
                        if(searchType === 'contract'){
                            Table.find({contract:searchTarget}, function (err,board){

                                if(board && board.length === 0){
                                    res.status(400).send('일치하는 계약번호가 없습니다.')
                                }else{
                                    let comp = board.find(item => item.contractName)
                                    if(tokenData.company === comp.contractName){
                                        res.status(200).json(board)
                                    }else if(err){
                                        res.status(400).send('일치하는 계약번호가 없습니다.')
                                    }else{
                                        res.status(400).send('일치하는 계약번호가 없습니다.(회사틀림)')
                                    }
                                }
                            })
                        }

                        else if(searchType === 'terminalNum'){

                            Table.find({terminalNum:searchTarget}, function (err,board){

                                if(board && board.length === 0){
                                    res.status(400).send('일치하는 단말기번호가 없습니다.')
                                }else{
                                    let comp = board.find(item => item.contractName)
                                    if(tokenData.company === comp.contractName){
                                        res.status(200).json(board)
                                    }else if(err){
                                        res.status(400).send('일치하는 단말기번호가 없습니다.')
                                    }else{
                                        res.status(400).send('일치하는 단말기번호가 없습니다.(회사틀림)')
                                    }
                                }
                            })
                        }

                        else if(searchType === 'contractName'){

                            Table.find({contractName:searchTarget}, function (err,board){

                                if(board && board.length === 0){
                                    res.status(400).send('일치하는 계약자명이 없습니다.')
                                }else{
                                    let comp = board.find(item => item.contractName)
                                    if(tokenData.company === comp.contractName){
                                        res.status(200).json(board)
                                    }else if(err){
                                        res.status(400).send('일치하는 계약자명이 없습니다.')
                                    }else{
                                        res.status(400).send('일치하는 계약자명이 없습니다.(회사틀림)')
                                    }
                                }
                            })
                        }

                        else if(searchType === 'phoneNum'){

                            Table.find({phoneNum:searchTarget}, function (err,board){

                                if(board && board.length === 0){
                                    res.status(400).send('일치하는 연락처가 없습니다.')
                                }else{
                                    let comp = board.find(item => item.contractName)
                                    if(tokenData.company === comp.contractName){
                                        res.status(200).json(board)
                                    }else if(err){
                                        res.status(400).send('일치하는 연락처가 없습니다.')
                                    }else{
                                        res.status(400).send('일치하는 연락처가 없습니다.(회사틀림)')
                                    }
                                }
                            })
                        }

                        else if(searchType === 'serviceType'){

                            Table.find({serviceType:searchTarget}, function (err,board){
                                if(board && board.length === 0){
                                    res.status(400).send('일치하는 서비스종류가 없습니다.')
                                }else{
                                    let comp = board.find(item => item.contractName)
                                    if(tokenData.company === comp.contractName){
                                        res.status(200).json(board)
                                    }else if(err){
                                        res.status(400).send('일치하는 서비스종류가 없습니다.')
                                    }else{
                                        res.status(400).send('일치하는 서비스종류가 없습니다.(회사틀림)')
                                    }
                                }
                            })
                        }

                        else if(searchType === 'id'){
                            Table.find({id:searchTarget}, function (err,board){
                                if(board && board.length === 0){
                                    res.status(400).send('일치하는 ID가 없습니다.')
                                }else{
                                    let comp = board.find(item => item.contractName)
                                    if(tokenData.company === comp.contractName){
                                        res.status(200).json(board)
                                    }else if(err){
                                        res.status(400).send('일치하는 ID가 없습니다.')
                                    }else{
                                        res.status(400).send('일치하는 ID가 없습니다.(회사틀림)')
                                    }
                                }
                            })
                        }
                    }
                })
            }
            catch (e){
                if(e.name === 'TokenExpiredError'){
                    res.status(500).send('로그인 시간이 만료되었습니다.')
                }
            }
        },

        update(req,res){
            try {
                const data = req.body

                Table.findOneAndUpdate({contract:data.contract},
                    {$set:data},
                    function (err,board){
                        if(err){
                            res.status(400).send('데이터 오류. 새로고침 후 사용해주세요.')
                        }else{
                            res.status(200).json({data:board, message:'수정 성공'})
                        }
                    })
            }catch (e){
                if(e.name === 'TokenExpiredError'){
                    res.status(500).send('로그인 시간이 만료되었습니다.')
                }
            }

        },

        delete(req,res){
            try {
                const data = req.body
                let idMapper = data.map(id => id.id)
                let contractMapper = data.map(contract=>contract.contract)
                let phoneNumMapper = data.map(phoneNum=>phoneNum.phoneNum)
                let terminalNumMapper = data.map(terminalNum=>terminalNum.terminalNum)

                Table.deleteMany({id:idMapper,contract:contractMapper,phoneNum:phoneNumMapper,terminalNum:terminalNumMapper}, function (err){
                    if(err){
                        return res.status(400).send('데이터가 없습니다. 새로고침하여 다시 한번 확인해주세요.')
                    }else {
                        return res.status(200).send('삭제 성공')
                    }
                })
            }catch (e){
                if(e.name === 'TokenExpiredError'){
                    res.status(500).send('로그인 시간이 만료되었습니다.')
                }
            }

        },

        excelUpload(req,res){
            try {
                const bodyData = req.body;

                Table.bulkWrite(
                    bodyData.map((item) =>
                        ({
                            updateOne: {
                                filter: {contract: item.contract},
                                update: {$set: item},
                                upsert: true
                            }
                        })
                    )
                    , function (err, board) {
                        if (err) {
                            res.status(400).send('데이터 오류. 새로고침 후 사용해주세요.')
                        } else {
                            res.status(200).json({data: board, message: '수정 성공'})
                        }
                    })
            }catch (e){
                if(e.name === 'TokenExpiredError'){
                    res.status(500).send('로그인 시간이 만료되었습니다.')
                }
            }

        },

        tableByCompany(req,res){
            try {
                const token = req.cookies.accessToken
                const data = jwt.verify(token,access_jwt_secret)
                Table.find({contractName:data.company},function (err,board){
                    try{
                        res.status(200).send(board)
                    }
                    catch (err){
                        res.status(400).json({message:"실패"})
                    }
                })
            }catch (e){
                if(e.name === 'TokenExpiredError'){
                    res.status(500).send('로그인 시간이 만료되었습니다.')
                }
            }
        },

        readMobile(req,res){
            const data = req.body
            let searchType = data.selectBox
            const searchTarget = data.searchText


            const token = req.cookies.accessToken
            const tokenData = jwt.verify(token,access_jwt_secret)

            try {
                jwt.verify(token,access_jwt_secret,(err)=>{
                    if(err){
                        res.status(400).send('로그인 후 사용해주세요')
                    }
                    else {
                        if(searchType === 'contract'){
                            Table.find({contract:searchTarget}, function (err,board){

                                if(board && board.length === 0){
                                    res.status(400).send('일치하는 계약번호가 없습니다.')
                                }else{
                                    let comp = board.find(item => item.contractName)
                                    if(tokenData.company === comp.contractName){
                                        const dbDataToken = jwt.sign({
                                            userData: board
                                        },access_jwt_secret)

                                        res.cookie('dbDataToken',dbDataToken,{
                                            secure:false,
                                            httpOnly:true
                                        })
                                        res.status(200).send('Success')
                                    }else if(err){
                                        res.status(400).send('일치하는 계약번호가 없습니다.')
                                    }else{
                                        res.status(400).send('일치하는 계약번호가 없습니다.(회사틀림)')
                                    }
                                }
                            })
                        }

                        else if(searchType === 'terminalNum'){

                            Table.find({terminalNum:searchTarget}, function (err,board){

                                if(board && board.length === 0){
                                    res.status(400).send('일치하는 단말기번호가 없습니다.')
                                }else{
                                    let comp = board.find(item => item.contractName)
                                    if(tokenData.company === comp.contractName){
                                        const dbDataToken = jwt.sign({
                                            userData: board
                                        },access_jwt_secret)

                                        res.cookie('dbDataToken',dbDataToken,{
                                            secure:false,
                                            httpOnly:true
                                        })
                                        res.status(200).send('Success')
                                    }else if(err){
                                        res.status(400).send('일치하는 단말기번호가 없습니다.')
                                    }else{
                                        res.status(400).send('일치하는 단말기번호가 없습니다.(회사틀림)')
                                    }
                                }
                            })
                        }

                        else if(searchType === 'contractName'){

                            Table.find({contractName:searchTarget}, function (err,board){

                                if(board && board.length === 0){
                                    res.status(400).send('일치하는 계약자명이 없습니다.')
                                }else{
                                    let comp = board.find(item => item.contractName)
                                    if(tokenData.company === comp.contractName){
                                        const dbDataToken = jwt.sign({
                                            userData: board
                                        },access_jwt_secret)

                                        res.cookie('dbDataToken',dbDataToken,{
                                            secure:false,
                                            httpOnly:true
                                        })
                                        res.status(200).send('Success')
                                    }else if(err){
                                        res.status(400).send('일치하는 계약자명이 없습니다.')
                                    }else{
                                        res.status(400).send('일치하는 계약자명이 없습니다.(회사틀림)')
                                    }
                                }
                            })
                        }

                        else if(searchType === 'phoneNum'){

                            Table.find({phoneNum:searchTarget}, function (err,board){

                                if(board && board.length === 0){
                                    res.status(400).send('일치하는 연락처가 없습니다.')
                                }else{
                                    let comp = board.find(item => item.contractName)
                                    if(tokenData.company === comp.contractName){
                                        const dbDataToken = jwt.sign({
                                            userData: board
                                        },access_jwt_secret)

                                        res.cookie('dbDataToken',dbDataToken,{
                                            secure:false,
                                            httpOnly:true
                                        })
                                        res.status(200).send('Success')
                                    }else if(err){
                                        res.status(400).send('일치하는 연락처가 없습니다.')
                                    }else{
                                        res.status(400).send('일치하는 연락처가 없습니다.(회사틀림)')
                                    }
                                }
                            })
                        }

                        else if(searchType === 'serviceType'){

                            Table.find({serviceType:searchTarget}, function (err,board){
                                if(board && board.length === 0){
                                    res.status(400).send('일치하는 서비스종류가 없습니다.')
                                }else{
                                    let comp = board.find(item => item.contractName)
                                    if(tokenData.company === comp.contractName){
                                        const dbDataToken = jwt.sign({
                                            userData: board
                                        },access_jwt_secret)

                                        res.cookie('dbDataToken',dbDataToken,{
                                            secure:false,
                                            httpOnly:true
                                        })
                                        res.status(200).send('Success')
                                    }else if(err){
                                        res.status(400).send('일치하는 서비스종류가 없습니다.')
                                    }else{
                                        res.status(400).send('일치하는 서비스종류가 없습니다.(회사틀림)')
                                    }
                                }
                            })
                        }

                        else if(searchType === 'id'){
                            Table.find({id:searchTarget}, function (err,board){
                                if(board && board.length === 0){
                                    res.status(400).send('일치하는 ID가 없습니다.')
                                }else{
                                    let comp = board.find(item => item.contractName)
                                    if(tokenData.company === comp.contractName){
                                        const dbDataToken = jwt.sign({
                                            userData: board
                                        },access_jwt_secret)

                                        res.cookie('dbDataToken',dbDataToken,{
                                            secure:false,
                                            httpOnly:true
                                        })
                                        res.status(200).send('Success')
                                    }else if(err){
                                        res.status(400).send('일치하는 ID가 없습니다.')
                                    }else{
                                        res.status(400).send('일치하는 ID가 없습니다.(회사틀림)')
                                    }
                                }
                            })
                        }
                    }
                })
            }
            catch (e){
                if(e.name === 'TokenExpiredError'){
                    res.status(500).send('로그인 시간이 만료되었습니다.')
                }
            }
        },




    }

}