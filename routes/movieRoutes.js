const express = require('express');
const router = express.Router();
const authController = require('./../controllers/authController');
const movieController = require('../controllers/movieController')

router.use(authController.protect)

router
.route('/')
.get(movieController.getAllShowingMovies);


router.use(authController.restrictTo('admin'))

router
.route('/creatMovieShow')
.post(movieController.creatMovie)





module.exports = router;