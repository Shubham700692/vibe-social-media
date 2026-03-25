const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema(
  {
    username: { type: String, required: true },
    userId:   { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    text:     { type: String, required: true, maxlength: 500 },
  },
  { timestamps: true }
);

const postSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    username: {
      type: String,
      required: true, // denormalised for fast feed rendering
    },
    text: {
      type: String,
      maxlength: 1000,
      default: "",
    },
    imageUrl: {
      type: String,
      default: "",
    },
    // Array of usernames who liked — keeps it simple per assignment spec
    likes: {
      type: [String],
      default: [],
    },
    comments: {
      type: [commentSchema],
      default: [],
    },
  },
  { timestamps: true }
);

// At least one of text or image must be present

postSchema.pre("save", async function () {
  if (!this.text && !this.imageUrl) {
    throw new Error("A post must have text or an image.");
  }
});

module.exports = mongoose.model("Post", postSchema);
