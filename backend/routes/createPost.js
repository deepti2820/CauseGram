const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const requireLogin = require("../middleware/requireLogin");
const postModel = require("../models/postModel");
const getTrendingHashtags = require("../middleware/trendingHashtag");

router.post("/createPost", requireLogin, async (req, res) => {
  const { photo, body,hashtag } = req.body;
  // console.log(hashtag.split('#'))
  if (!photo || !body) {
    return res
      .status(422)
      .json({ success: false, message: "Please add all filed" });
  }
  try {
    const newPost = postModel({ photo, body, postedBy: req.user,hashtags: hashtag.split('#')});
    await newPost.save();
    res.json({ success: true, message: "Posted Successfully" });
  } catch (error) {
    res.json({ success: false, message: "Error" });
  }
});

router.get("/allposts", requireLogin, async (req, res) => {
  let limit = req.query.limit;
  let skip = req.query.skip;
  const posts = await postModel
    .find({})
    .populate("postedBy", "_id name Photo")
    .populate("comments.postedBy", "_id name Photo")
    .sort("-createdAt")
    .limit(parseInt(limit));
  if (posts) {
    res.json({ success: true, posts: posts });
  } else {
    res.json({ success: false, message: "Error" });
  }
});

router.get("/myposts", requireLogin, async (req, res) => {
  const posts = await postModel
    .find({ postedBy: req.user._id })
    .populate("postedBy", "_id name Photo")
    .populate("comments.postedBy", "_id name Photo")
    .sort("-createdAt");
  if (posts) {
    res.json({ posts: posts, success: true });
  }
});

router.put("/like", requireLogin, async (req, res) => {
  const post = await postModel
    .findByIdAndUpdate(
      req.body.postId,
      {
        $push: { likes: req.user._id },
      },
      { new: true }
    )
    .populate("postedBy", "_id name Photo")
    .populate("comments.postedBy", "_id name Photo");

  res.json(post);
});

router.put("/unlike", requireLogin, async (req, res) => {
  const post = await postModel
    .findByIdAndUpdate(
      req.body.postId,
      {
        $pull: { likes: req.user._id },
      },
      { new: true }
    )
    .populate("postedBy", "_id name Photo email")
    .populate("comments.postedBy", "_id name Photo");
  res.json(post);
});

router.put("/comment", requireLogin, async(req, res) => {
  const comment = {
    comment: req.body.text,
    postedBy: req.user._id,
  };
  postModel
    .findByIdAndUpdate(
      req.body.postId,
      {
        $push: { comments: comment },
      },
      {
        new: true,
      }
    )
    .populate("comments.postedBy", "_id name Photo")
    .populate("postedBy", "_id name Photo")
    .then((result) => {
      
      // req.io.emit('receiveNotification', {
      //   type: 'comment',
      //   postId: req.body.postId,
      //   comment: req.body.text,
      //   postedBy: req.user.name, // Assuming you have the user's name in the req.user object
      // });
      res.json(result)
    })
    .catch((error) => res.json(error));
});

router.delete("/deletePost/:postId", requireLogin, async (req, res) => {
  const postId = req.params.postId;
  try {
    const post = await postModel
      .findById({ _id: postId })
      .populate("postedBy", "_id");
    if (!post) {
      return res.json({ success: false, message: "There is no post" });
    }
    if (post.postedBy._id.toString() == req.user._id.toString()) {
      try {
        await postModel.findByIdAndDelete({ _id: postId });
        return res.json({
          success: true,
          message: "Delete Succesfully",
          post: post,
        });
      } catch (e) {
        return res.json({ success: false, message: e });
      }
    }
  } catch (e) {
    res.json({ success: false, message: e });
  }
});

// router.get("/post/:id",requireLogin,async(req,res)=>{
//     const id=req.params.id;
//     try{
//       const post =await postModel.findById({_id:id}).populate("postedBy","_id name Photo").populate("comments.postedBy", "_id name Photo")
//       res.json(post);
//     }catch(err){
//         res.json(err)
//     }
// })

router.get("/post/:id", requireLogin, async (req, res) => {
  const id = req.params.id;
  try {
    const post = await postModel
      .findById(id)
      .populate("postedBy", "_id name Photo") // Ensure "photo" is correct here
      .populate("comments.postedBy", "_id name Photo"); // Ensure "photo" is correct here

    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }

    res.json(post);
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ error: "An error occurred while fetching the post" });
  }
});

//to show my folloeing post

router.get("/myfollowingpost", requireLogin, async (req, res) => {
  try {
    const posts = await postModel
      .find({ postedBy: { $in: req.user.following } })
      .populate("postedBy", "_id name Photo")
      .populate("comments.postedBy", "_id name Photo");
    res.json({ posts: posts });
  } catch (err) {
    res.json(err);
  }
});

//Trending post
router.get("/explore", requireLogin, getTrendingHashtags, async (req, res) => {
  try {
    const trendingHashtags = req.trendingHashtags;
    console.log(trendingHashtags)
    if (trendingHashtags.length == 0) {
      const posts = await postModel
        .find({})
        .populate("postedBy", "_id name Photo")
        .populate("comments.postedBy", "_id name Photo")
        .sort("-createdAt")
      if (posts) {
        return res.json({ success: true, posts: posts });
      } else {
        return res.json({ success: false, message: "Error" });
      }
    }

    // Example: Fetch posts based on trending hashtags
    const posts = await postModel
      .find({
        hashtags: { $in: trendingHashtags },
      })
      .populate("postedBy", "_id name")
      .populate("comments.postedBy", "_id name");
    res.status(200).json(posts);
    console.log(posts);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Failed to fetch explore posts" });
  }
});

module.exports = router;
