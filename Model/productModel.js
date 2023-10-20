const mongoose=require("mongoose")

const productSchema=mongoose.Schema({
    id:Number,
    title:String,
    image:String,
    imageType:String
    
},{
    versionKey:false
})

const ProductModel=mongoose.model("product", productSchema)

module.exports={ProductModel}