var mongoose = require('mongoose');

// schéma d'un film en wishlist
var movieSchema = mongoose.Schema({
    name:String,
    image:String
});

var movieModel = mongoose.model('movies', movieSchema);

module.exports = movieModel;