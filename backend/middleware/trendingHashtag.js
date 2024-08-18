// middleware/getTrendingHashtags.js

const Post = require('../models/postModel');

const getTrendingHashtags = async (req, res, next) => {
  try {
    // Get posts within a certain time frame (e.g., last 24 hours)
    const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000); // Calculate 24 hours ago

    const posts = await Post.find({
      createdAt: { $gte: twentyFourHoursAgo } // Filter posts within the last 24 hours
    });

    // Count hashtag occurrences
    let hashtagCount = {};
    posts.forEach(post => {
      post.hashtags.forEach(hashtag => {
        if(hashtag.length>0){
          hashtag=hashtag.trim()
        if (hashtagCount[hashtag]) {
          
          hashtagCount[hashtag] += 1;
        } else {
          hashtagCount[hashtag] = 1;
        }
      }
      });
    });

    // Convert hashtagCount object to array and sort by frequency
    const trendingHashtags = Object.keys(hashtagCount).sort((a, b) => hashtagCount[b] - hashtagCount[a]).slice(0, 10); // Get top 10 trending hashtags

    // Attach trending hashtags to request object for use in route handler
    req.trendingHashtags = trendingHashtags;
    next(); // Call next to proceed to the route handler
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch trending hashtags' });
  }
};

module.exports = getTrendingHashtags;
