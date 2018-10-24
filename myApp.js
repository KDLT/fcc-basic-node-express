
var express = require('express');
var app = express();
var bodyParser = require('body-parser');

// --> 7)  Mount the Logger middleware here
app.use(loggerMiddleware); // root level ito kasi app.use() with a single argument points to the root path '/'

function loggerMiddleware(req, res, next) {
  var method = req.method;
  var path = req.path;
  var ip = req.ip;
  console.log(`${method} ${path} - ${ip}`);
  next();
}

// --> 11)  Mount the body-parser middleware  here
app.use(bodyParser.urlencoded({extended: false}))

/** 1) Meet the node console. */

// console.log('Hello World');
// console.log(app);


/** 2) A first working Express Server */

// app.get('/', function(req, res) { // root directory is where the forward slash points to
//   res.send('Hello Express')
// });


/** 3) Serve an HTML file */ // points the get method to the ABSOLUTE path of the html file

var absolutePath = __dirname + "/views/index.html";
// console.log(absolutePath); // '/app/views/index.html'
app.get('/', function(req, res) {
  res.sendFile(absolutePath);
});


/** 4) Serve static assets  */ // this is where stylesheets are added

var assetsPath = __dirname + '/public';
// console.log(assetsPath); // '/app/public'
app.use(express.static(assetsPath)); // express.static(assetsPath) is the middleWare

/** 5) serve JSON on a specific route */

var messageObject = {"message": "Hello json"}
var jsonHandler = messageObject => (
  app.get('/json', (req, res) => (
    res.json(messageObject)
  ))
);
// jsonHandler(messageObject);

/** 6) Use the .env file to configure the app */

var messageStyle = process.env.MESSAGE_STYLE; // uppercase
var capsHandler = (style, messageObject) => {
  if(style === 'uppercase') {
    return jsonHandler({"message": messageObject.message.toUpperCase()});
  } else return jsonHandler(messageObject);
};
capsHandler(messageStyle, messageObject);


/** 7) Root-level Middleware - A logger */ // KAILANGAN MAUNA NITONG loggerMiddleware
//  place it before all the routes !
// SEE TOP OF EDITOR

/** 8) Chaining middleware. A Time server */

app.get('/now', function(req, res, next) {
  req.time = new Date().toString(); // gawa ng time na property ng req object upon request
  next(); // on to the next stack...
}, function(req, res) { // this is the chained middleware that...
  res.json({"time": req.time}) // reponds with a json object using the req.time declared earlier
})


/** 9)  Get input from client - Route parameters */
app.get('/:echo/echo', function(req, res) { // medyo 'di ko pa gets itong echo
  // console.log(req.params);
  res.json(req.params) // same as {'echo': req.params.word}
})

// app.get('/:word/echo', function(req, res) {
//   console.log(req.params);
//   res.json({'echo': req.params.word});
// });

/** 10) Get input from client - Query parameters */
// /name?first=<firstname>&last=<lastname>

// req.query returns {first: "firstname", last: "lastname"}
// app.get('/name', function(req,res) { 
//   let firstName = req.query.first;
//   let lastName = req.query.last;
//   res.json({"name": firstName + " " + lastName})
// });

/** 11) Get ready for POST Requests - the `body-parser` */
// place it before all the routes !
// SEE TOP OF EDITOR!

/** 12) Get data form POST  */
// the form element n index.html page has a method="post"
// it also has an action="/name"
// submit button brings you to the absolutePath/name which displays the correct json object
app.post('/name', function(req, res) {
  let firstName = req.body.first;
  let lastName = req.body.last;
  res.json({"name": firstName + " " + lastName})
}); 


// POST http://localhost:8080/api/users
// parameters sent with 
// app.post('/api/users', function(req, res) {
//     var user_id = req.body.id;
//     var token = req.body.token;
//     var geo = req.body.geo;

//     res.send(user_id + ' ' + token + ' ' + geo);
// });

// This would be part of the basic setup of an Express app
// but to allow FCC to run tests, the server is already active
/** app.listen(process.env.PORT || 3000 ); */

//---------- DO NOT EDIT BELOW THIS LINE --------------------

 module.exports = app;
