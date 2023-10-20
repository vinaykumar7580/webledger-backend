const express=require("express")
const axios = require("axios");
require("dotenv").config();


const apiRouter=express.Router()

apiRouter.post("/search", async (req, res) => {
    const { text } = req.body;
  
    try {
      let response = await axios.get(
        `https://api.spoonacular.com/recipes/complexSearch?apiKey=${process.env.apiKey}&query=${text}`
      );
  
      res.status(200).send(response.data.results);
    } catch (error) {
      res.status(400).send(error);
    }
});

apiRouter.get("/singleproduct/:id", async (req, res) => {
    const { id } = req.params;
  
    try {
      let response = await axios.get(
        `https://api.spoonacular.com/recipes/${id}/information?includeNutrition=false&apiKey=${process.env.apiKey}`
      );
  
      res.status(200).send(response.data);
    } catch (error) {
      res.status(400).send(error);
    }
});



module.exports={apiRouter}

