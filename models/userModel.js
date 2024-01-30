const mongoose = require ('mongoose')



const User = mongoose.model('User',  {
profilePic : String,
username : String, 
email :String,
password : {type : String} ,
authenticationcode : {type :String }


} )




module.exports = User 