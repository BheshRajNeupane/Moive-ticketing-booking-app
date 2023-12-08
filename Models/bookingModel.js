
const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
 movie:{
     type:mongoose.Schema.ObjectId,
     ref:'Movie',
     required:[true , 'Booking must belong to a Movie!']
 },
 user:{
     type:mongoose.Schema.ObjectId,
     ref:'User',
     required:[true , 'Booking must belong to a User!']
 },
 my_seat:{
     type:Number,
    required:[true , 'Booking must have seatso!']
 },
 price:{
    type:Number,
    required:[true , 'Booking must have a price.']
},
 createdAt:{
     type:Date,
     default:Date.now()
 },
 paid:{
     type:Boolean,
     default:true
 }
});

bookingSchema.pre(/^find/ , function(next){
    this.populate('user').populate({
        path:'movie',
        select:'name'
    })
    next();
})


const Booking = mongoose.model('Booking' , bookingSchema);

module.exports = Booking;