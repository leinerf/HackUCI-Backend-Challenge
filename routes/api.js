const express = require('express');
const router = express.Router();
const validator = require('validator');
const low = require('lowdb')
const FileSync = require('lowdb/adapters/FileSync')

const adapter = new FileSync('db.json')
const db = low(adapter)

// Set some defaults (required if your JSON file is empty)
db.defaults({ emails: [], count: 0 })
  .write()


router.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});




/* GET home page. */
router.post('/addEmail', function(req, res, next) {
/*
	The body of this HTTP request will be sent as a  
	x-www-form-urlencoded  string and contains the 
	parameter ‘ email ’. No duplicate or invalid email 
	addresses can be added into the database. You can 
	verify the email address using  Validator . If the 
	email address is successfully added, return 200. 
	Otherwise, return 400 with a custom error message 
	with the reason
*/	req.body.email = req.body.email.trim();
	if(validator.isEmail(req.body.email))
	{
		const emails = db.get('emails')
  			.find({ email:req.body.email })
  			.value()

  		console.log(emails);
		if(emails)
		{
			res.status(400);
			res.send("Email is already in the database");
		}
		else
		{
			// Add a post
			db.get('emails')
			  .push({
			  	id: db.get("count").value(), 
			  	email: req.body.email
			  })
			  .write()

			// Increment count
			db.update('count', n => n + 1)
			  .write()
			res.status(200);
			res.send("success");
		}
	}	
	else{
		res.status(400);
		res.send("Not a valid email");
	}
	
});

router.get('/getEmails', function(req, res, next) {
  //This HTTP request should return all the emails 
  //on the mailing list as a comma separated string.
  const emails = db.get("emails")
  		.value();
  		
  result = ""
  for(var i = 0; i < emails.length; ++i){
  	if(i != (emails.length - 1))
  	{
  		result += emails[i].email + ",";
  	}
  	else
  	{
  		result += emails[i].email 
  	}
  }
  res.send(result)
});

module.exports = router;
