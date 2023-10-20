
const mongoose=require("mongoose")

const authSchema=mongoose.Schema({
    username:String,
    googleId:String,
    email:String
},{
    versionKey:false
})

const AuthModel=mongoose.model("user", authSchema)

module.exports={AuthModel}