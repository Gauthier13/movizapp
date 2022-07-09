var mongoose = require('mongoose');

// connexion à la base de données 
var options = {
    connectTimeoutMS: 5000,
    useNewUrlParser: true,
    useUnifiedTopology : true
}

mongoose.connect('mongodb+srv://gauthier:capsule@cluster0.jjauwkt.mongodb.net/mymovizapp?retryWrites=true&w=majority',
    options,
    function (err) {
        console.log(err);
    }
);
