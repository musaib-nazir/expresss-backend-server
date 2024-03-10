const express = require('express')       // importing express from node modules in index.js  which is used for creating server 
const mongoose = require('mongoose')     // importing mongoose libarary which is used for connecting mongo db 
const bodyParser = require('body-parser')
const cors = require('cors')
const cookieParser = require('cookie-parser')
const multMidWare = require('./middleware/multer')
const IsAuthenticated = require('./middleware/auth')

const { registerController,
  loginController,
  logoutController,
  forgotpassController,
  changepassController,
  deleteusercontroller,
  usernameUpdateController,
  passwordupdate,
  userdetailscontroller,
  profilepicController,
  followUserHandler,
  getFollowerhandler,
  getFollowinghandler } = require('./controllers/userController')


const { postHandler,
  likeHandler,
  commentHandler,
  deletePostHandler,
  deleteCommentHandler,
  getPosthandler

} = require('./controllers/postController')


const app = express()      //  declaring a variable  app in which express function is called 
// app.use(express.json()) //  using express encoding itself 
app.use(bodyParser.json()) //  using third party libarary 
app.use(cors())
app.use(cookieParser())

// configuring env so that  we can save senstive data in protected file 
require('dotenv').config();
const Port = process.env.PORT      // declaring a variable and passing a value of from env
const url = process.env.MONGO_URL // declaring a variable url and passing a value of from env


// connecting with  mongo db by using mongoose 
if (mongoose.connect(url)) {
  console.log(`Database connected on ${url}`)
} else {
  console.log(`Error connecting ${url}`)
}





// routes 
app.get('/home', (req, res) => { res.send("helloworld") })
app.post('/user/register', registerController)
app.post('/user/login', loginController)
app.post('/user/logout', IsAuthenticated,logoutController)
app.post('/user/forgotPassword', forgotpassController)
app.post('/user/changePassword', changepassController)
app.post('/user/deleteUser', deleteusercontroller)
app.post('/user/updateusername', usernameUpdateController)
app.post('/user/updatepassword', passwordupdate)

app.post('/user/updateProfilePic', multMidWare, profilepicController)

app.post('/user/follow', IsAuthenticated, followUserHandler);

app.get('/user/getFollowers', IsAuthenticated,getFollowerhandler)
app.get('/user/getFollowing',IsAuthenticated,getFollowinghandler)
app.get('/user/userdetails', userdetailscontroller)


// postcontrollersroutes

app.post('/post/new', multMidWare,IsAuthenticated, postHandler)
app.post('/post/likes', IsAuthenticated, likeHandler)
app.post('/post/comment', IsAuthenticated, commentHandler)
app.post('/post/delete', IsAuthenticated, deletePostHandler)
app.post("/post/deleteCommment", IsAuthenticated, deleteCommentHandler)


app.get("/explore" , getPosthandler)

//  starting a server      //console.log   =>template literal
app.listen(Port, console.log(`server conected on localhost : ${Port} `))       