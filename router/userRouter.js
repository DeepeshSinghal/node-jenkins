var express = require('express');
var User = require('../model/userModel');
var passwordHash = require('password-hash');
var fs = require('fs');
var mail = require('../email');
var generator = require('generate-password');
var fileUploader = require('../middleware/fileUploader');
var xlsx = require('node-xlsx').default;
var router = express.Router();

// User Index Page
router.get('/', (req, res, next) => {
    let  userData = {};
    User.getUsers(userData, (err,result) => {
        if(err)
          throw err;
        res.render('user', {
            userList: result
        });
    });
});

//save user data
router.all('/add', (req,res)=>{
    postData = req.body;    
    delete postData.action; //remove action 
    let password = postData.password = generator.generate({
        length: 10,
        numbers: true
    });
    postData.password = passwordHash.generate(password);//generate pwd hash to save in table
    //validation apply
    req.assert('first_name', 'First Name should not be empty.').notEmpty();
    req.assert('last_name', 'Last Name should not be empty.').notEmpty();
    req.assert('email', 'Email should not be empty.').notEmpty();
    req.assert('status', 'Please select Status.').notEmpty();
    req.assert('user_role_id', 'Please select Role.').notEmpty();
    if(postData.user_role_id == 1){   
        if(postData.reptManagerLength > 1){ // If dropdown have any data
            req.assert('manager_id', 'Please select Reporting Manager.').notEmpty();
        }
    }
    delete postData.reptManagerLength;
    let errors = req.validationErrors();
    if(errors.length>0){
        res.send({errors:errors});
    }else{   
        if(postData.manager_id == ''){
            postData.manager_id = 0    
        }
        if(req.session.isLoggedIn){
            postData.created_by = req.session.userSession.id;
            postData.modified_by = req.session.userSession.id;
        }
        if(typeof postData.id === 'undefined'){
            postData.created =  new Date();        
        }
        postData.modified = new Date();
        //user already exist checking by email
        ucondition =   `email = '${postData.email}'`;
        if(typeof postData.id !== 'undefined'){
            ucondition += ` and id != ${postData.id}`;
        }
        User.isUserExists(ucondition, function(err, result){
            if(err){
                console.log(err.message);
            }            
            if(result[0].count > 0){  
                 res.send({msg:'Email-Id already exist!',status:'error'});   
            }else{
                if(typeof postData.id !== 'undefined'){ //update record
                    conditions = {id:postData.id};
                    User.updateUser(postData, conditions, (err, result)=>{
                        if(err) 
                        throw err;  
                        res.send({msg:'User has been updated successfully.',status:'success'});                  
                    }) 
                }else{ //add record
                    User.saveUser(postData, (err,result)=>{
                        if(err)
                            throw err;   
                            //Email Send Process
                        if(result.affectedRows > 0){                        
                                name = postData.first_name +' '+postData.middle_name+ ' '+postData.last_name;
                                let message = `Hello ${name}, <br>
                                            Your email and password is following:<br>
                                            E-mail: ${postData.email}. <br>
                                            Your new password : ${password} <br>
                                            Now you can login with this email and password.`;
                                let mailOptions = {
                                    from: ' "Pushpendra Rajput" <rajput.pushpendra62@gmail.com>', // sender address
                                    to: postData.email, // list of receivers
                                    subject: 'Account Created', // Subject line
                                //  text: message, // plain text body
                                    html: message // html body
                                };
                                mail.sendMail(mailOptions, (error, info) => {
                                    if (error) {
                                        return console.log(error);
                                    }
                                    console.log('Message sent: %s', info.messageId);
                                });                      
                        }   
                        res.send({msg:'User has been added successfully.',status:'success'});                        
                    });        
                }
            }
        });
    }
});

/**************LOGIN FUNCTION STARTS HERE ************/
router.all('/login', function (req, res, next) {
    console.log("hello");
    res.locals.msg = 'mmm';
    if (req.method == 'GET') {
        let UserData = {
            email: '',
            password: ''
        };
        if(req.cookies.rememberme !==undefined){
            UserData.email = req.cookies.rememberme.email;
            UserData.password = req.cookies.rememberme.password;
        }
        res.render('user/login', {data: UserData})
    } else {
        req.assert('email', 'A valid email id is required.').isEmail();
        req.assert('password', 'Passwors is required.').notEmpty();
        var errors = req.validationErrors();
        if (errors) {
            errors.forEach(function (error) {
                req.flash(error.param, error.msg)
            });
            res.render('user/login', { data: req.body });
        } else {
            User.getUserForLogin(req.body, function (err, result) {
                if (err) {
                    console.log(err);
                } else {
                    if (result.length > 0 && passwordHash.verify(req.body.password, result[0].password)) {
                        sess=req.session;
                        sess.isLoggedIn = true;
                        sess.userSession = result[0];
                        if(req.body.RememberMe){
                            let path = req.path;
                            let domain = req.get('host');
                            res.cookie('rememberme',{email:req.body.email, password:req.body.password},{expires: new Date(Date.now() + 86400*1000)});
                        }
                        res.redirect('/dashboard/');
                    } else {
                        res.locals.msg = 'Invalid Email OR Password.';
                        res.render('user/login', { data: req.body });
                    }
                }
            })
        }
    }
})
/**************LOGIN FUNCTION ENDS HERE ************/


/********************LOGOUT FUNCTION ***************/
router.all('/logout', function (req, res, next) {
    if (req.session.isLoggedIn) {
        req.session.userSession = false;
    }
    res.redirect('/user/login');
})
/*******************ENDS HERE LOGOUT****************/

/************GET USER ROLES LIST ***************/
 router.all('/roles', function (req, res, next) { 
    User.getRoles(function (err, result) {
        if (err) {
            console.log(err);
        } else {
            res.send(result);         
        }
    });
});

/************END GET USER ROLES LIST ***************/
router.all('/profile', fileUploader.single('profile_pic'), function(req, res, next){
    var UserId = req.session.userSession.id;
    if(req.method === 'GET'){
        User.getUsers({id:UserId}, function(err, result){
            if(err) return next(err);
            let userData = result[0];
            
            let userRoleId = userData.user_role_id;
            switch (userRoleId) {
                case 3:
                    res.render('user/profile.ejs', {data:userData});
                    break;
                case 4:
                    Client.getClient('txt_address, v_city, v_state, v_country, v_zip, v_contactname, v_othercontact, v_email, v_altemail, v_phone, v_fax', {i_clientid:userData.client_id}, function(err, result){
                        if(err) return next(err);
                        let clientData = result[0];
                        res.render('user/client_profile.ejs', {data:userData, clientData:clientData});
                    })
                    break;
                case 2:
                    res.render('user/l2_profile.ejs', {data:userData});
                    break;
                default:
                    res.render('user/profile.ejs', {data:userData});
                    break;
            }
        });
    }
    
    if(req.method === 'POST'){
        let userData = {
            first_name: req.body.first_name,
            middle_name: req.body.middle_name,
            last_name: req.body.last_name,
            email: req.body.email
        }

        if(req.body.password){
            userData.password = passwordHash.generate(req.body.password);
        }

        if(req.file){
            userData.profile_pic = req.file.filename;
        }

        req.assert('first_name','First name is required.').notEmpty();
        req.assert('last_name','Last name is required.').notEmpty();
        req.assert('email','A valid email id is required.').isEmail();
        
        let errors = req.validationErrors();
        if(errors){
            errors.forEach(error => {
                req.flash(error.param, error.msg);
            });
            res.render('user/profile.ejs', {data:req.body});
        }else{
            User.updateUser(userData,{id:UserId}, function(err, result){
                if(err) return next(err);
                if(result.affectedRows > 0){
                    if(req.file){
                        fs.rename(req.file.path, 'public/assets/images/users/profile/'+req.file.filename, (err) =>{
                            if(err) return next(err);  
                            res.redirect('/user/login');
                        });
                    }else{
                        res.redirect('/user/login');
                    }
                }
            });
        }
    }
});

router.all('/forgot-password',function(req, res, next){
    if (req.method==='GET') {
        res.render('user/forgot.ejs' , {data:{}});
    }

    if (req.method === 'POST') {
        req.assert('email', 'A valid email id is required.').isEmail();
        let errors = req.validationErrors();

        if(errors){
            errors.forEach((error)=>{
				console.log(error.param)
				console.log(error.msg)
                req.flash(error.param, error.msg);
            });
            res.render('user/forgot.ejs', {data: req.body});
        }else{
            User.isUserExists('email = "'+req.body.email+'"', function(err, result){
                if(err) return next(err);
                let IsExist = result[0];
                if (IsExist.count > 0) {
                    let UserId = IsExist.id;
                    User.getUsers({id:UserId}, function(err, result){
                        if(err) return next(err);
                        let UserInfo = result[0];
                        let password = generator.generate({
                            length: 10,
                            numbers: false
                        });
                        User.updateUser({password:passwordHash.generate(password)}, {id:UserId}, function(err, result){
                            if(err) return next(err);
                            if (result.affectedRows > 0) {
                                name = UserInfo.first_name +' '+UserInfo.middle_name+ ' '+UserInfo.last_name;
                                let message = `Hello ${name}, <br>
                                            Your email and password is following:<br>
                                            E-mail: ${UserInfo.email}. <br>
                                            Your new password : ${password} <br>
                                            Now you can login with this email and password.`;

                                let mailOptions = {
                                    from: ' "Pushpendra Rajput" <rajput.pushpendra62@gmail.com>', // sender address
                                    to: UserInfo.email, // list of receivers
                                    subject: 'Forgot Password', // Subject line
                                //  text: message, // plain text body
                                    html: message // html body
                                };
                                mail.sendMail(mailOptions, (error, info) => {
                                    if(error) return next(error);
                                    req.flash('successMessage', 'Thank you, New password has been sent to your registered email address.');
                                    res.render('user/forgot.ejs', {data:''});
                                }); 
                            }
                        })
                    })
                }else{
                    req.flash('errorMessage', 'Sorry, Email does not register with us.');
                    res.render('user/forgot.ejs', {data:''});
                }
            })
        }
    }
})

module.exports = router;