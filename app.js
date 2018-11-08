var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var morgan = require('morgan');

//cors {Cross Origin Request}
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers",
        "Origin,X-Requested-With,Content-Type, Accept, Authorization");
    if (req.method === 'OPTIONS') {
        res.header('Access-Control-Allow-Methods', 'PUT,DELETE,PATCH,POST,GET');
        return res.status(200).json({});;
    }
    next();
});

// Routes
const ArtisanRoutes = require('./routes/Artisian'); 
const UserRoutes = require('./routes/User');

//middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(express.static(__dirname + '/client'));
app.use(morgan('dev'));


//connecting to mongoose
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost:27017/Artisan', { useNewUrlParser: true })


//route for homepage
app.get('/', (req, res) => {
    res.send(' Use the /api/artisan endpoint');
});

app.use('/artisians', ArtisanRoutes);
app.use('/user', UserRoutes);

app.use((req, res, next) => {
    const error = new Error('Not Found');
    error.status = 404;
    next(error);
})

app.use((error, req, res, next) => {
    res.status(error.status || 500);
    res.json({
        error: {
            message: error.message
        }
    });
})

const port = process.env.PORT || 4000;

app.listen(port, () => {
    console.log(`Server running on port ${port}`)
});
