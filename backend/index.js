require('dotenv').config()
const express = require('express');
const app = express();
const cors = require("cors");
const axios = require('axios');
const mongoose = require("mongoose")
const User = require('./models/user')
const bcrypt = require('bcrypt')
const saltRounds = 6


mongoose.connect(process.env.ATLAS_URI)
// For backend and express init
app.use(express.json());
app.use(cors());
app.get('/', (req, res) => { res.send("Server is Running OK") })
app.get("/category/:lat/:lng/:searchCategory", (req, res) => {
  const searchCategory = req.params.searchCategory
  // const searchCategory = 'sup noodle bar'

  const lat = req.params.lat
  const lng = req.params.lng
  const config = {
    method: 'get',
    url: 'https://api.yelp.com/v3/businesses/search?term=' +
      searchCategory +
      '&latitude=' +
      lat +
      '&longitude=' +
      lng +
      '&limit=3&sort_by=review_count',
    headers: {
      'Authorization': process.env.YELP_API
    }
  };

  axios(config)
    .then((response) => {
      res.json(response.data)
      // console.log(response.data);
    })
    .catch((error) => {
      console.log(error);
    });

});
app.get('/businesses/:businessID/reviews', (req, res) => {
  console.log("fetching reviews for specific business")
  const config = {
    method: 'get',
    url: 'https://api.yelp.com/v3/businesses/' + req.params.businessID + '/reviews',
    headers: {
      'Authorization': process.env.YELP_API
    }
  };
  axios(config)
    .then((response) => {
      res.json(response.data)
      // console.log(response.data)
    })
    .catch(error => {
      console.log(error)
    })
})

app.post('/signup', (req, res) => {
  const email = req.body.email
  const plainTextPassword = req.body.password;

  //check if user already exists 
  User.find({ name: email }, (err, existingUser) => {
    if (existingUser.length === 0) {
      bcrypt.hash(plainTextPassword, saltRounds, async (err, hash) => {
        try {
          const user = new User({
            name: email,
            password: hash
          });
          let result = await user.save();
          if (result) {
            console.log("saved successfully")
            res.send(result)
          }

        } catch (e) {
          res.send("Something Went Wrong");
          console.log("something went wrong ---" + e)
        }
      })
    } else {
      //notify user that account exists
    }
  })

})

app.post('/login', (req, res) => {
  const email = req.body.email;
  const plainTextPassword = req.body.password;
  console.log("logging in ")
  User.find({name: email}).limit(1).exec(function(err, existingUser){
    if(existingUser.length === 0){
      //tell user that account doesnt exist
      console.log("account doesnt exist")
    }else{
      console.log(existingUser[0])
      bcrypt.compare(plainTextPassword, existingUser[0].password, function (err, response){
        if(response === true){
          console.log('successfully logged in ')
        } else {
          console.log("incorrect password ")
        }
      })
    }
  }
)
})





let port = process.env.PORT;
if (port == null || port == "") {
  port = 5000;
}
app.listen(port);