const applyDotenv = dotenv => {
    dotenv.config()
    return{
        mongoUri:process.env.MONGO_URI,
        port:process.env.PORT,
        origin:process.env.ORIGIN,
        NODEMAILER_USER:process.env.NODEMAILER_USER,
        NODEMAILER_PASS:process.env.NODEMAILER_PASS,
        NODEMAILER_SERVICE:process.env.NODEMAILER_SERVICE,
        NODEMAILER_HOST:process.env.NODEMAILER_HOST,
        session_secret : process.env.Session_SECERT,
        db_name:process.env.db_name,
        access_jwt_secret : process.env.ACCESS_SECRET_KEY,
        refresh_jwt_secret : process.env.REFRESH_SECRET_KEY,
        aws_table_name: process.env.AWS_TABLE_NAME,
        aws_region: process.env.AWS_REGION,
        accessKeyId: process.env.AWS_ACCESSKEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESSKEY,
        SMS_service_id:process.env.SMS_SERVICE_API_ID,
        SMS_secret_key:process.env.SMS_API_SECRET_KEY,
        SMS_access_key:process.env.SMS_API_ACCESS_KEY,
        SMS_PHONE:process.env.SMS_PHONE_NUM,
        ADMIN_ID:process.env.ADMIN_ID,
        ADMIN_PASSWORD:process.env.ADMIN_PASSWORD
    }
}

export default applyDotenv