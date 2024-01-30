const multer = require ('multer');

const upload = multer({  dest: 'uploads/'  ,  limits: {
    fieldSize: 1024 * 1024 * 10, 
  }, }); 

// const storage = multer.memoryStorage()   //  accesssing the RAM memory 
// const upload = multer({ storage: storage})


  const multMidWare = upload.single('image');



  module.exports = multMidWare;