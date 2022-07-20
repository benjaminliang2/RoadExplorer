require('dotenv').config()
const express = require('express');
const app = express();
const cors = require("cors");
const axios = require('axios');
const mongoose = require("mongoose")
const User = require('./models/user')
const session = require('express-session')
const bcrypt = require('bcrypt')
const MongoStore = require('connect-mongo')
const saltRounds = 6


mongoose.connect(process.env.ATLAS_URI)
// console.log(mongoose.rsconnection)

app.use(express.json());
app.use(cors({
  origin: ["http://localhost:3000"],
  methods: ["GET", "POST"],
  credentials: true
}))
// app.use(express.urlencoded())
app.set('trust proxy', 1) // trust first proxy
app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false },
  store: MongoStore.create({
    mongoUrl: process.env.ATLAS_URI,
    // collectionName: 'users'
  })
}))

// not used or relevant 
// app.get('/', (req, res) => {
//   res.send("Server is Running OK")
//   console.log(req.session.id)

// })
app.get("/category/:lat/:lng/:searchCategory", (req, res) => {
  const searchCategory = req.params.searchCategory
  // console.log(req.session.id)

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
  User.find({ email: email }, (err, existingUser) => {
    if (existingUser.length === 0) {
      bcrypt.hash(plainTextPassword, saltRounds, async (err, hash) => {
        try {
          const user = new User({
            email: email,
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

//verify if user is ALREADY auth'd
app.get('/login', (req, res) => {
  // console.log(req.session + ' ' + req.session.id)
  if (req.session.user) {
    // console.log('already authenticated')
    // console.log(req.session.id)
    res.send({ loggedIn: true })
  } else {
    res.send({ loggedIn: false })
  }

})

app.post('/login', (req, res) => {
  // let sess;
  const email = req.body.email;
  const plainTextPassword = req.body.password;
  User.find({ email: email }).limit(1).exec(function (err, existingUser) {
    if (existingUser.length === 0) {
      //tell user that account doesnt exist
      console.log("account doesnt exist")
    } else {
      // console.log(existingUser[0])
      bcrypt.compare(plainTextPassword, existingUser[0].password, function (err, response) {
        if (response === true) {
          console.log('successfully logged in ')
          req.session.user = existingUser[0]._id
          res.json(req.session.user)
        } else {
          console.log("incorrect password ")
        }
      })
    }
  }
  )
})

app.get('/logout', (req, res) => {
  req.session.destroy(() => {
    console.log("session has been deleted")
    res.send({ loggedIn: false })
  })
})

//save single trip
app.post('/user/trip', async (req, res) => {
  const trip = req.body.trip
  console.log(trip._id);
  if (!trip._id) {
    trip._id = new mongoose.Types.ObjectId()
    try {
      let result = await User.findOneAndUpdate(
        { _id: req.session.user, },
        { $push: { trips: trip } },
        { new: true }
      )
      if (result) {
        res.json(trip._id)
      }
    } catch (error) {
      console.log("Error adding new trip to user trips array. Code: \n " + error)
      res.send(error)
    }

  } else {
    try {
      let exisitingTrip = await User.findOneAndUpdate(
        { '_id': req.session.user, 'trips._id': trip._id },
        { $set: { 'trips.$': trip } },
        { new: true }
      )
      if (exisitingTrip) {
        res.json(trip._id)
      }
    } catch (error) {
      console.log("Error updating existing trip. Code: \n " + error)
      res.send(error)
    }
  }
})

//get data of a single trip of user
app.get('/user/trip/:id', async (req,res) => {
  let id = req.params.id
  console.log(id)
  try {
    // let result = await User.aggregate([
    //   {$match: {_id: req.session.user}},
    //   {$unwind: '$trips'},
    //   {$match: {"trips._id":id }}
    // ])
    let result = await User.findOne({_id: req.session.user},
      {trips: {$elemMatch: {_id: id}}}
    )

    res.json(result)
  } catch (error) {
    res.send(error)
    console.log(error)
  }
})


//get list of user's trips
app.get('/user/trips', async (req, res) => {
  try {
    const result = await User.find({_id: req.session.user},
      { "trips.title": 1, "trips._id": 1}
    )
    res.json(result)
  } catch (error) {
    console.log("Fetching trips failed. error code: " + error)
  }

})


let port = process.env.PORT;
if (port == null || port == "") {
  port = 5000;
}
app.listen(port);
