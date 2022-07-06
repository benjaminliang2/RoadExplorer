const mongoose = require("mongoose")
// import mongoose from "mongoose";


const trip =  {
    title: String,
    origin: {
        name: String,
        coordinates: { lat: Number, lng: Number },
    },
    destination: {
        name: String,
        coordinates: { lat: Number, lng: Number },
    },
    waypoints: []
}


const UserSchema = new mongoose.Schema({
    email: String,
    password: String,
    trips:[trip]
})

const User = mongoose.model('users', UserSchema);

module.exports = User;