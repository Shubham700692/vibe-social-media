const express = require("express");
const Post = require("../models/Post");
const { protect } = require("../middleware/authMiddleware");
// const upload = require("../config/cloudinary");
const { upload, uploadToCloudinary } = require("../config/cloudinary");

const router = express.Router();

// GET /api/posts — public feed, newest first, with pagination
// Query params: page (default 1), limit (default 10)
router.get("/", async (req, res) => {
  const page  = Math.max(1, parseInt(req.query.page)  || 1);
  const limit = Math.min(50, parseInt(req.query.limit) || 10);
  const skip  = (page - 1) * limit;

  try {
    const [posts, total] = await Promise.all([
      Post.find()
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      Post.countDocuments(),
    ]);

    res.json({
      posts,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      totalPosts: total,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /api/posts — create a post (auth required)
// Accepts optional image file via multipart/form-data field "image"
// router.post("/", protect, upload.single("image"), async (req, res) => {
//   const { text } = req.body;
// const imageUrl = req.file?.secure_url || req.file?.path || "";
// console.log("req.file:", req.file);

//   if (!text && !imageUrl) {
//     return res.status(400).json({ message: "Post must have text or an image" });
//   }

//   try {
//     const post = await Post.create({
//       userId:   req.user._id,
//       username: req.user.username,
//       text:     text || "",
//       imageUrl,
//     });

//     res.status(201).json(post);
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// });
router.post("/", protect, upload.single("image"), async (req, res) => {
  const { text } = req.body;
  let imageUrl = "";

  // If a file was uploaded, send it to Cloudinary
  if (req.file) {
    try {
       console.log("📤 Uploading to Cloudinary...");
      imageUrl = await uploadToCloudinary(req.file.buffer);
      console.log("✅ Cloudinary upload successful:", imageUrl);
    } catch (err) {
      console.error("❌ Cloudinary upload error:", err);
      return res.status(500).json({ message: "Image upload failed: " + err.message });
    }
  }

  if (!text && !imageUrl) {
    return res.status(400).json({ message: "Post must have text or an image" });
  }

  try {
    console.log("💾 Creating post in DB...");
    const post = await Post.create({
      userId:   req.user._id,
      username: req.user.username,
      text:     text || "",
      imageUrl,
    });
    console.log("✅ Post created:", post);
    res.status(201).json(post);
  } catch (err) {
    console.error("❌ Post creation error:", err);
    res.status(500).json({ message: err.message });
  }
});

// PATCH /api/posts/:id/like — toggle like (auth required)
router.patch("/:id/like", protect, async (req, res) => {
  try {
    const post     = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: "Post not found" });

    const username  = req.user.username;
    const alreadyLiked = post.likes.includes(username);

    // Toggle: add or remove the username from likes array
    if (alreadyLiked) {
      post.likes = post.likes.filter((u) => u !== username);
    } else {
      post.likes.push(username);
    }

    await post.save();

    // Return just the updated likes so the frontend can patch state
    res.json({ likes: post.likes });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /api/posts/:id/comment — add a comment (auth required)
router.post("/:id/comment", protect, async (req, res) => {
  const { text } = req.body;

  if (!text || !text.trim()) {
    return res.status(400).json({ message: "Comment text is required" });
  }

  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: "Post not found" });

    const comment = {
      userId:   req.user._id,
      username: req.user.username,
      text:     text.trim(),
    };

    post.comments.push(comment);
    await post.save();

    // Return the newly added comment (last item) so the UI can append it
    const savedComment = post.comments[post.comments.length - 1];
    res.status(201).json({ comment: savedComment, totalComments: post.comments.length });
  } catch (err) {
    console.error("❌ post ERROR FULL:", err);
    res.status(500).json({ message: err.message });
  }
});

// DELETE /api/posts/:id — delete own post (auth required)
router.delete("/:id", protect, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: "Post not found" });

    if (post.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorised to delete this post" });
    }

    await post.deleteOne();
    res.json({ message: "Post deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;