const Movie = require('../Models/movieModel');
const codeFactory = require('../controllers/codeFactory')


//to show all showing Movies
exports. getAllShowingMovies = codeFactory.getAll(Movie)

//to create Particular Movie Show
exports.creatMovieShow =  codeFactory.createOne(Movie)

//  to update particular movie
exports. updateMovieShow =  codeFactory.updateOne(Movie);
     

//  to delete particular movie
exports.deleteMovieShow = codeFactory.deleteOne(Movie)
