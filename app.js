var http = require('http');
var express = require('express');
var mongo = require('mongodb');
var mongoose = require('mongoose');
//var MongoStore = require('connect-mongo')(session);
var path = require('path');
var app = express();
var config = require('./config');
app.locals.configuration = config;
mongoose.connect('mongodb://localhost/systemtest',{ useMongoClient: true });
var db = mongoose.connection;
cors = require('cors');
console.log(1);
setImmediate(() => {
  console.log("immediat");
})
setTimeout(() => {
  console.log("setTimeout");
},10000)
console.log(2)
var originsWhitelist = [
    'http://localhost:4200',      //this is my front-end url for development
  ];
  var corsOptions = {
    origin: function(origin, callback){
          var isWhitelisted = originsWhitelist.indexOf(origin) !== -1;
          callback(null, isWhitelisted);
    },
    credentials:true
  }
  //here is the magic
app.use(cors(corsOptions));

app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'public')));
// app.use(express.static(path.join(__dirname, 'public')));
//app.use(express.static(path.join(__dirname, 'node_modules')));
/************Body Parser */
var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: false }));
// parse application/json
app.use(bodyParser.json());
/********************** */

/***************SESSION ************/
var cookieParser = require('cookie-parser');
var session = require('express-session');
app.use(cookieParser());
app.use(session({
    secret: "Node_Js",
    name: "Node_Js",
    proxy: true,
    resave: true,
    saveUninitialized: true
}));
/***************ENDED HERE SESSION */
/********Middleware for Form Validation ***********/
var Auth = require('./middleware/auth');
// app.use('/', Auth.isLoggedIn);
/********Middleware for Auth Validation ENDS here */

/** Express Validator Middleware for Form Validation */
var expressValidator = require('express-validator')
app.use(expressValidator())
var flash = require('express-flash');
app.use(flash());
/************Validation ended here *******************/

//Set User Status local variable
app.locals.UserStatus = config.statusArr; 

/************SETTING PARAMETERS TO USE ON VIEW*********************/
app.use(function (req, res, next) {
    if(req.session.isLoggedIn){
        app.locals.isLoggedIn = req.session.isLoggedIn;
        app.locals.userSession = req.session.userSession;
    }else{
        app.locals.isLoggedIn = false;
        app.locals.userSession = false;
    }
    // app.locals.userSession = ''; // temp variable
    // app.locals.isLoggedIn = false; // temp variable
    app.locals.profilePicLocation = req.protocol + "://" + req.get('host') + '/uploads/'
    app.locals.host = req.protocol + "://" + req.get('host');
    app.locals.assetsLocation = req.protocol + "://" + req.get('host') + '/assets'
    next();
});
/************SETTING PARAMETERS TO USE ON VIEW ENDS HERE **********/

/*************ROTUNG PART GOES HERE */
app.use('/', function(req, res, next){     
    app.locals.routerUsed = '';
    if(req.path.indexOf('dashboard')>0){
        app.locals.routerUsed = 'dashboard';
    }
    next();
});


app.get('/', function(req, res){ // Default redirecting to login page
    res.redirect('/user/login');
});
//Load routes
var userRouter = require('./router/userRouter');
//var dashboardRouter = require('./router/dashboardRouter');
var apiRouter = require('./router/api');
// Use routes
app.use('/api', apiRouter);
app.use('/user', userRouter);
//app.use('/dashboard', dashboardRouter);
/*******ROUTING ENDS HERE */

/************Error HANDLER */
app.use(function (err, req, res, next) {
    // logic
    console.log(err);
    next(err);
})
/************Error HANDLER ENDES HERE*/

var server = http.createServer(app).listen('8000');
console.log('Server is serted and listening on 8000');

