import dotenv from "dotenv";
import mongoose from "mongoose";
import UserModel from "./User.js"
import TableModel from './Table.js'

const db = {}
db.mongoose = mongoose
db.url = dotenv.MONGO_URI
db.User=new UserModel(mongoose)
db.Table=new TableModel(mongoose)
export default db