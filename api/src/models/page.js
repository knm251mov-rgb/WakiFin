const mongoose = require("mongoose");

const pageSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      unique: true,
    },
    content: {
      type: String,
      required: [true, 'Content is required'],
    },
    summary: {
      type: String,
      default: "",
    },

    // 👇 АВТОР СТОРІНКИ
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, 'Author is required'],
    },
  },
  { timestamps: true } // <-- опції йдуть сюди
);

module.exports = mongoose.model("Page", pageSchema);
