const Post = require("../models/postModel");
const cloudinary = require ('cloudinary');


cloudinary.config({

  cloud_name: 'dyepamyzm', 
  api_key: '158529642125964', 
  api_secret: '--cQEDOF2PjOlUnQqoiT_2JnfVI'
  })




const postHandler = async (req, res) => {
  try {
      const {title , caption} = req.body
    
      const image = req.file.path
      const  upload = await cloudinary.v2.uploader.upload( image , {folder :  "myMedia" })
        
    const imageUrl= upload.secure_url
    
    if (imageUrl!==""){
      const  newPost = new Post({title, imageUrl, caption})
      await newPost.save()
    
    res.status(201).json({message : "Post Uploaded"})
      }
      else {
        res.json({message : "select image"})
      }


  } 
  
  catch (error) {
    res.json({ message: error });
    console.log(error);
  }
};

module.exports =  postHandler ;
