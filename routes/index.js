var express = require('express');
var router = express.Router();
var request = require("sync-request");
var movieModel = require('../models/movies.js')

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

// récupère les films de l'api
router.get('/new-movies', (req,res) => {
  var requete = request("GET", "https://api.themoviedb.org/3/discover/movie?api_key=493ac1c8998e8e4f69743d4a083adb7a&language=fr-FR&region=fr&sort_by=popularity.desc&include_adult=true&include_video=true&page=1&with_watch_monetization_types=flatrate");

  var movieAPI = JSON.parse(requete.body);

  res.json({movieFromAPI : movieAPI.results});
})


// ajouter un film en wishlist 
router.post('/wishlist-movie', async (req,res) => {

  var newMovie = new movieModel({
    name: req.body.name,
    image: req.body.image 
  })

  var movieSave = await newMovie.save();
  
  res.json();
});

// supprimer un film en bdd
router.delete('/wishlist-movie/:name', async (req, res) => {

  var returnDb = await movieModel.deleteOne({ name: req.params.name})

  res.json({ returnDb });
})


// afficher les films en bdd
router.get('/wishlist-movie', async function (req, res, next) {

  var movieList = await movieModel.find();
  
  res.json({movieWishlistBackend : movieList});
});

module.exports = router;

