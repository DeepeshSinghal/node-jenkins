var express = require('express');
var router = express.Router();
var User = require('../model/user');
var jwt = require('jsonwebtoken');
router.post('/login', function(req, res) {
  User.getUserByUsername(req.body.email, function(err, user) {
    if (err)
    {
    	res.status(401).send({success: false, msg: err});;
    } 
	else {
	  if(!user){
   		 res.status(401).send({success: false, msg: 'Authentication failed. User Not.'});;
   	   }
      else{
      	 User.comparePassword(req.body.password,user.password, function (err, isMatch) {
        	if (isMatch && !err) {
          // if user is found and password is right create a token
          var token = jwt.sign(user.toJSON(),'1212dsdwqeqwqw321');
          // return the information including token as JSON
          res.json({success: true, token: 'JWT ' + token});
        	} else {
          res.status(401).send({success: false, msg: 'Authentication failed. Wrong password.'});
       	 }
      	});
      }
     
  }
  });
});
router.post('/signup', function (req, res, next) {
    var name = req.body.name;
	var email = req.body.email;
	var password = req.body.password;
	req.checkBody('name', 'Name is required').notEmpty();
	req.checkBody('email', 'Email is required').notEmpty();
	req.checkBody('email', 'Email is not valid').isEmail();
	req.checkBody('password', 'Password is required').notEmpty();
	var errors = req.validationErrors();
	var newUser = new User({
			fullName: name,
			email:email,
			password: password
		});
	if(errors)
	{
		res.status(400).send(errors);
	}else{
		User.createUser(newUser, function(err, user){
			if(err) res.status(500).send(err);
			res.status(200).send({'message':"successfully done"});
		});
		//res.status(200).send({'test':2});
	}
});
router.get('/following', function (req, res, next) {
	 // verifies secret and checks exp
	var token = req.body.token || req.query.token || req.headers['token'];
	//token=token.replace('JWT ','')
	if(token)
	{
		jwt.verify(token, '1212dsdwqeqwqw321', function(err, decoded) {       
			if (err) {
              	 res.status(401).send(err)     
               } else
               {
        			 User.getUser(function(err, user){
						if(err) res.status(500).send(err);
							res.status(200).send(user);
					});
      			}
    });
	}else{
		return res.status(403).send({ 
        	success: false, 
        	message: 'No token provided.' 
    	});

	}
    
   
});
module.exports = router;