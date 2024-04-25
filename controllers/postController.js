const Post = require("../models/postModel");
const cloudinary = require("../utility/cloudinary");
const User = require("../models/userModel");
const transporter = require("../utility/nodemailer");

const postHandler = async (req, res) => {
  try {
    const { title, caption } = req.body;

    const image = req.file.path;
    const { _id } = req.info;

    const upload = await cloudinary.v2.uploader.upload(image, {
      folder: "myMedia",
    });

    const imageUrl = upload.secure_url;

    if (imageUrl !== "") {
      const newPost = new Post({
        author: _id,
        title: title,
        imageUrl,
        caption,
      });
      await newPost.save();
      const postId = newPost._id;
      await User.findByIdAndUpdate(_id, { $push: { posts: postId } });

      res.status(201).json({ message: "Post Uploaded", postId });
    } else {
      res.json({ message: "select image" });
    }
  } catch (error) {
    res.json({ message: error });
    console.log(error);
  }
};

const likeHandler = async (req, res) => {
  const userId = req.info._id;
  console.log(userId);
  const { postId } = req.query;

  const post = await Post.findById(postId);

  if (post) {
    const existinglike = post.likeCounts.findIndex(
      (user) => user.user._id.toString() === userId
    );
    // const existinglike = post.likeCounts.some(like => like.user.toString() === userId);
    console.log(existinglike);
    if (existinglike === -1) {
      await post.likeCounts.push({ user: userId }); // simple javascript array method
      const updatePost = await post.save();

      if (updatePost) {
        res.json({ message: "you sent a like" });
      }
    } else {
      await post.likeCounts.pull({ user: userId }); // simple javascript array method
      await post.save();
      res.json({ message: "post unlikeed" });
    }
  } else {
    res.json({ message: "post not found" });
  }

  // const liked = await Post.findByIdAndUpdate(_id, { $push: { likeCounts: username } })  //mongodb method due to find on

  //    // const unlike = await Post.findByIdAndUpdate(_id, { $pull: { likeCounts: username } })

  //     //   if (unlike) { res.json({ message: "post unliked" }) }
  //     // }
};

const commentHandler = async (req, res) => {
  try {
    const userId = req.info._id;

    const comment = req.body.comment;
    const { postId } = req.query;
    const user = await User.findById(userId);

    const post = await Post.findById(postId);
    // const Id = post.comments._id
    // console.log(Id)
    if (post) {
      await post.comments.push({ comment: comment, user: userId });
      await post.save(); // Save the post after updating comments
      // await user.findByIdAndUpdate(userId,{$push:{userComments:post.comments._id}})
      // await user.userComments.push( post.comments._id)
      // const updtateUser = await user.save()
      res.json({ message: "Comment Added" });
    } else {
      res.json({ message: "Post not found!" });
    }
  } catch (error) {
    console.log(error);
    res.json({ message: "Some Error" });
  }
};

const deletePostHandler = async (req, res) => {
  try {
    const userId = req.info._id;
    const { postId } = req.query;
    const isUser = await User.findById(userId);
    if (isUser) {
      const deletePost = await Post.findByIdAndDelete(postId);
      const delpostfromArr = await User.findByIdAndUpdate(userId, {
        $pull: { posts: postId },
      });
      if (deletePost && delpostfromArr) {
        res.json({ message: "Post Deleted" });
      } else {
        res.json({ message: "Some Error : may be post is already deleted " });
      }
    } else {
      res.json({ message: "user not found " });
    }
  } catch (error) {
    console.log(error);
  }
};

const deleteCommentHandler = async (req, res) => {
  try {
    const { commentId } = req.query;
    const { userId } = req.info._id;
    const { postId } = req.query;

    const post = await Post.findById(postId);
    if (post) {
      //   const index = post.comments.findIndex((object)=>object._id.toString()===commentId)

      const delComment = await post.comments.pull({ _id: commentId });

      await post.save();

      if (delComment) {
        res.json({ message: "comment deleted" });
      }
    } else {
      res.json({ message: "post not found" });
    }
  } catch (err) {
    console.log(err);
  }
  // alternative method of doing it by finding index
  // const indexOfdelComment = await post.comments.findIndex(
  //   (comment) => comment._id.toString() === commentId
  // );

  // console.log(indexOfdelComment);

  // const delComment = await post.comments.splice(indexOfdelComment, 1);
};

const getPosthandler = async (req, res) => {
  try {
    const allposts = await Post.find().populate([
      { path: "author", model: "User" },

      { path: "likeCounts.user", model: "User" },

      { path: "comments.user", model: "User" },

      { path: "shareCounts", model: "User" },
    ]);

    if (allposts) {
      res.json({ message: "Posts Found!", allposts });
    } else {
      res.json({ message: " No posts found  " });
    }
  } catch (err) {
    console.log(err);
  }
};

const getfollPosts = async (req, res) => {
  try {
    const userId = req.info._id;
    const user = await User.findById(userId);

    if (user) {
      const following = user.userFollowing.map((element) => element.user);
      
      const posts = await Post.find({author:following}).populate(

        [
          { path: "author", model: "User" },
    
          { path: "likeCounts.user", model: "User" },
    
          { path: "comments.user", model: "User" },
    
          { path: "shareCounts", model: "User" },
        ]



      )
      
      if (posts.length!==0) {
        res.json({ message: "Posts Found!", posts });
      }else{res.json({message:"no posts found"})}
    } else {
      {
        res.json({ message: "user not found" });
      }
    }
  } catch (error) {
    console.log(error);
  }
};
const getallLikes = async (req, res) => {
  const { postId } = req.query;
  const post = await Post.findById(postId);
  console.log(post);

  if (post) {
    const allLikes = await post.likeCounts.map((likes) => likes.user);

    console.log(allLikes);

    const LikesUser = await User.find({ _id: allLikes });

    res.json({ message: "ussers found", LikesUser });
  }
};

module.exports = {
  postHandler,
  likeHandler,
  commentHandler,
  deletePostHandler,
  deleteCommentHandler,
  getPosthandler,
  getfollPosts,
  getallLikes,
};
