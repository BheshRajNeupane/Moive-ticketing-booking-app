

const mongoose = require('mongoose')


const movieSchema = new mongoose.Schema({
    title:{
        type:String,
        required:[true,' must have a  movie name'],
        trim:true,
        maxlength:[40,'A title of movie  have less or equal then 40 character'],
    },

    director:{
        type:String,
        required:[true,' Must have a director name'],
    },
    casts:[String],

    showTimes:{
        type:String
    },
    rRating:{
        type:Number,
        min:[1,'Rating must be above 1'],
        max:[5,'Rating must be below 5'],
    },

    Price:{
        type:Number,
         required:[true,'A movie must have a price']
    },

    script:{
        type:String,
        enum:['English' , 'Nepali' , 'Hindi'],

    }

})


const Movie = mongoose.model('Movie' , movieSchema);

module.exports = Movie;