const Movie = require('../Models/movieModel');
const codeFactory = require('../controllers/codeFactory')



exports. getAllShowingMovies = codeFactory.getAll(Movie)

exports.creatMovie =  codeFactory.createOne(Movie)
 