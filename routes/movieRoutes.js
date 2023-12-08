const express = require('express');
const router = express.Router();
const authController = require('./../controllers/authController');
const movieController = require('../controllers/movieController')

router.use(authController.protect)

router
.route('/getAllMovieShow')
.get(movieController.getAllShowingMovies);


router.use(authController.restrictTo('admin'))

router
.route('/creatMovieShow')
.post(movieController.creatMovieShow)

router
.route('/updateMovieShow/:id')
.patch(movieController.updateMovieShow)

router
.route('/deleteMovieShow/:id')
.delete(movieController.deleteMovieShow)





module.exports = router;