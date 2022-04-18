require('dotenv').config()
const express = require('express');
const app = express();
const cors = require("cors");
const axios = require('axios');

// For backend and express init
app.use(express.json());
app.use(cors());
app.get('/', (req,res)=>{res.send("Server is Running OK")})
app.get("/:lat/:lng", (req, res) => {
    console.log("GET Request on LocalHost 5000")
    const lat = req.params.lat
    const lng = req.params.lng


    var config = {
      method: 'get',
      url: 'https://api.yelp.com/v3/businesses/search?term=hikes'+
      '&latitude='+
      lat+
      '&longitude='+
      lng+
      '&limit=3&sort_by=review_count',
      headers: { 
        'Authorization': process.env.YELP_API
      }
    };
    
    axios(config)
    .then((response) => {
        res.json(response.data)
        console.log(response.data);
    })
    .catch((error) => {
      console.log(error);
    });
    
});



app.listen(5000);