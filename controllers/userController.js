const User = require("../models/userModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const cloudinary = require('cloudinary')
const secretKey = process.env.SECRET_KEY;


cloudinary.config({

  cloud_name: 'dyepamyzm',
  api_key: '158529642125964',
  api_secret: '--cQEDOF2PjOlUnQqoiT_2JnfVI'
})


//register function whenever this function will be called it will accept payload in json username ,email......
//password and save that data in mongo document User

const registerController = async (req, res) => {
  try {
    const { username, email, password, authenticationcode } = req.body;
    const existingUser = await User.findOne({ email });
    if (username && email && password && authenticationcode !== "") {
      if (!existingUser) {

        const hashedcode = await bcrypt.hash(authenticationcode, 13)
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({ username, email, password: hashedPassword, authenticationcode: hashedcode });

        await newUser.save();
        res.status(201).json({ message: "User created!!...Please remember your authentication code for security purposes " });
      } else {
        res.json({ message: "User Already Exits" });
      }
    } else {
      res.status(401).json({ message: "All credentials Required" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server Error" });
  }
};

const loginController = async (req, res) => {
  try {
    const { username, password } = req.body;
    const isUser = await User.findOne({ username });
    if (username !== "" && password !== "") {
      if (isUser) {
        const passVerify = await bcrypt.compare(password, isUser.password);
        if (passVerify) {
          const token = await jwt.sign(
            { appUser: isUser.username },
            `${secretKey}`
          );

          res.cookie("username", username, { httpOnly: true });

          res.json({ message: "Logged In", token });
        } else {
          res.json({ message: "Password Doesnot Match" });
        }
      } else {
        res.json({ message: "User Not Found" });
      }
    } else {
      res.json({ message: "All Credentials Required" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server Error" });
  }
};
const logoutController = async (req, res) => {
  try {
    const token = req.cookies.token;


    if (token) {
      const decode = await jwt.verify(token, `${secretKey}`)

      if (decode) {
        res.clearCookie("token");
        res.json({ message: "logged Out succesfuly" });
      }
      else {
        res.json({ message: "some thing Went wrong " })
      }
    }

    else {
      res.json({ message: "missing token" });
    }
  }


  catch (error) {
    console.log(error);
    res.json({ message: "internal server Error " });
  }
};


const forgotpassController = async (req, res) => {

  try {
    const { email, authenticationcode } = req.body; // u can take answer of the security question for further validation
    const isUser = await User.findOne({ email });
    const _id = isUser._id

    if (email && authenticationcode !== "") {
      if (isUser) {
        const codeverify = await bcrypt.compare(authenticationcode, isUser.authenticationcode)


        if (codeverify) { res.json({ message: "Kindly change Ur password With newOne ", _id }); }


        else { res.json({ message: "CODE DOES NOT MATCH...TRY AGAIN!!!!!!!!!" }) }



        // console.log(isUser._id);
        // security Question  validation here
        // redirection to the new page in which new password can be saved
      } else {
        res.json({ message: "No user Found" });
      }
    } else {
      res.json({ message: "all credentials required!" });
    }
  } catch (error) {
    console.log(error);
  }
};


// const validationcontroller =async(req,res ) => {
// const {securityquestion }= req.isUser.securityquestion
// const {rightAnswer} = req.body
// if (securityquestion,rightAnswer) {

// const answerVerify = await bcrypt.compare(rightAnswer, isUser.rightAnswer)
//  if (answerVerify){   res.json ( {message: "verified kindly change your password" })               } 
//  else {   res.json({message:"verification failed"})                     }




// }else { res.json({message: "something went wrong"})          }












// redirection to the new page in which new password can be saved










const changepassController = async (req, res) => {
  try {
    const { _id, newpassWord } = req.body;
    const hashedPassword = await bcrypt.hash(newpassWord, 10);

    // const changePassword =await User.findByIdAndUpdate( _id ,  {password : hashedPassword})

    //  test the above example in postman 
    const validUser = await User.findById({ _id });
    if (validUser) {
      validUser.password = hashedPassword;

      await validUser.save();

      res.json({ message: " password changed " });
    } else {
      res.json({ message: " something Went Wrong" });
    }
  } catch (error) {
    console.log(error);
  }
}

const deleteusercontroller = async (req, res) => {


  const { password } = req.body;
  const username = req.query.username;
  // const token =  req.cookies.token
  try {

    if (password !== "") {

      const finduser = await User.findOne({ username })

      if (finduser) {

        const verifypass = await bcrypt.compare(password, finduser.password)


        if (verifypass) {
          const deleteuser = await User.deleteOne({ username: username });


          if (deleteuser) {
            res.json({ message: "User successfully deleted!!!" })
          }
          else { res.json({ message: "process failed...try again !!!" }) }




        } else { res.json({ message: "Verification failed!!!!!" }) }

      } else { res.json({ message: "user not found!!!" }) }

    } else { res.json({ message: "please submit alll the required details!!!" }) }

  }
  catch (error) {
    console.log(error)
  }
}

const usernameUpdateController = async (req, res) => {
  try {

    const username = req.query.username

    const { newusername } = req.body
    if (newusername !== "") {

      const updatename = await User.findOneAndUpdate({ username: username }, { username: newusername });

      if (updatename) {


        res.json({ message: "username updated successfully" });
      } else {
        res.json({ message: "something went wrong" });
      }




    } else { res.json({ message: "please provide new username" }) }



  } catch (error) { console.log(error) }








}







const passwordupdate = async (req, res) => {
  const { password, updatedpassword, confirmpassword } = req.body

  const username = req.query.username;

  const finduser = await User.findOne({ username })
  if (finduser) {




    if (password && updatedpassword && confirmpassword !== "") {


      const passverify = await bcrypt.compare(password, finduser.password)

      if (passverify) {
        if (updatedpassword == confirmpassword) {
          const hashedpass = await bcrypt.hash(updatedpassword, 10)
          if (hashedpass) {


            const newpass = await User.updateOne({ password: hashedpass })
            if (newpass) {

              res.json({ message: " password updated successfully" })


            } else { res.json({ message: "something went wrong" }) }

          } else {
            res.json({ message: "process failed" })
          }

        } else { res.json({ message: "passwords doesnot match" }) }

      } else { res.json({ message: "wrong password!!" }) }

    } else { res.json({ message: "all credentials required" }) }


  } else { res.json({ messsage: "user not found" }) }



}

const userdetailscontroller = async (req, res) => {
  try {

    const username = req.cookie.username;

    const user = await User.findOne({ username })
    if (user) {
      const userDetails = { username: user.username, email: user.email, password: user.password }


      res.json({ userDetails })


    } else (res.json({ message: "user not found" }))

  }
  catch (error) { console.log({ error }) }

}


const profilepicController = async (req, res) => {
  try {


    const _id = req.query.user

    const image = req.file.path

    if (image !== "") {


      const upload = await cloudinary.v2.uploader.upload(image, { folder: "profilepics" })

      const imageUrl = upload.secure_url


      if (imageUrl !== "") {


        const UpdateprofileUrl = await User.findByIdAndUpdate(_id, { $push: { profilePic: imageUrl } })

        if (UpdateprofileUrl) {

          res.json({ message: "Profile picture uploaded" })
        }



      } else (res.json({ message: "something went wrong" }))


    } else (res.json({ message: "Select image " }))








  } catch (error) { console.log({ error }) }




}








module.exports = {
  registerController,
  loginController,
  logoutController,
  forgotpassController,
  changepassController,
  deleteusercontroller,
  usernameUpdateController,
  passwordupdate,
  userdetailscontroller,
  profilepicController
};