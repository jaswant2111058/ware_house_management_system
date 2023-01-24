const jwt = require("jsonwebtoken");
const key="jassi"
function isLoggedIn(req, res, next) {
 
    if(req.user) {
      next()
    } else
    {
      try {
        let token = req.params.token || req.cookies.token;
        if (token) {
          let user = jwt.verify(token,key);
          if (user) {
            req.userid = user.id;
            req.useremail = user.email;
            
            next();
          }
          else
          {
            res.redirect("/")
          }
        } else
        {
          res.redirect("/")
        }
    
      } catch (err) {
        console.log(err);
        res.status(500);
        res.redirect("/");
      }
    }

    } 

    module.exports = isLoggedIn;