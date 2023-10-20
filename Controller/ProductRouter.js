const express=require("express")
const { ProductModel } = require("../Model/productModel")


const productRouter=express.Router()

productRouter.post("/save", async(req,res)=>{
    const payload=req.body
    try{
        const product=new ProductModel(payload)
        await product.save()
        res.status(200).send("Product Save Successfully")

    }catch(error){
        res.status(400).send(error)
    }
})

productRouter.get("/data", async(req, res)=>{
    try{
        let data=await ProductModel.find()
        res.status(200).send(data)

    }catch(err){
        res.status(400).send(err)

    }
})


productRouter.delete("/delete/:id", async(req,res)=>{
    const {id}=req.params
    try{
        let data=await ProductModel.findByIdAndDelete({_id:id})
        res.status(200).send("product delete successfully")

    }catch(err){
        res.status(400).send(err)
    }
})



module.exports={productRouter}