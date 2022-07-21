// import {Trip} from './trip.js'
const mongoose = require("mongoose")
// import mongoose from "mongoose";


const Trip = {
    title: String,
    origin: {
        name: String,
        coordinates: { lat: Number, lng: Number },
    },
    destination: {
        name: String,
        coordinates: { lat: Number, lng: Number },
    },
    businessesSelected: [{id: String}]
}


const UserSchema = new mongoose.Schema({
    email: String,
    password: String,
    trips: [Trip],
})

const User = mongoose.model('users', UserSchema);

module.exports = User;
// export {User, Trip}