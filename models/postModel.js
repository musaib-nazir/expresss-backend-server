const mongoose = require('mongoose')



const postschema = mongoose.Schema({

    author: String,


    title: String,
    imageUrl: String,
    caption: String,
    likeCounts: [

        {
          user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
          },
        },
      ],
    comments: [
        {
            comment: String,
            user: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User",
            }
        }
    ],
    shareCounts: [ {user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",}
  },]

})








const Post = mongoose.model('Post', postschema)


module.exports = Post