module.exports.isloggedIn  = (req ,res ,next)=>{  //user authentication logic is implimented

    if(!req.isAuthenticated()){  //checking if the user is logged in before createing listing
        req.session.redirectUrl = req.originalUrl;
        req.flash("error" , "login to create new listings" );
       return res.redirect("/login");
    }
    next();
}

module.exports.saveRedirectUrl = (req , res , next)=>{
    if(req.session.redirectUrl){
        res.locals.redirectUrl = req.session.redirectUrl;
    }
    next();
};