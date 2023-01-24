const bcrypt = require("bcrypt");

    const jassi =bcrypt.hash("yes", 12, async function (err, hash)
        {
          console.log(hash);
        return hash;
        })
bcrypt.compare(jassi, "yes", function(err, res) {
        if (err){
          console.log(err)
        }
        if (res) {
          console.log("verified");
        } else {
          // response is OutgoingMessage object that server response http request
          console.log("no");
          
          //return response.json({success: false, message: 'passwords do not match'});
        }
      });