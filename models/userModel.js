const mongoose = require("mongoose");
const Post = require("./postModel");

const User = mongoose.model("User", {
  profilepIcUrl: String,
  username: String,
  email: String,
  password: { type: String },

  posts: [{ type: mongoose.Schema.Types.ObjectId, ref: "Post" }],
 
  userFollowers: [
    {
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    },
  ],
  userFollowing: [
    {
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    },
  ],
});

module.exports = User;
