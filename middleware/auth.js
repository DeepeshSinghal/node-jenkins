

var Auth = {
    isLoggedIn: function (req, res, next) {
        if (req.session.isLoggedIn == undefined) {
            req.session.isLoggedIn = false;
        }
        if (req.url == '/user/login') {
            next();
        } else {
            if (req.session.isLoggedIn) {
                next();     //If session exists, proceed to page
            } else {
                return res.redirect('/user/login')
                //next();  //Error, trying to access unauthorized page! //Here nor need to call next as user has bee redirected to the login page.
            }
        }
    }
}

module.exports = Auth;