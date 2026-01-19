const express = require("express");
const Page = require("../models/page");
const auth = require("../middleware/auth");

const router = express.Router();

/* ---------------- CREATE PAGE ---------------- */
router.post("/", auth, async (req, res) => {
  try {
    const page = new Page({
      title: req.body.title,
      summary: req.body.summary,
      content: req.body.content,
      author: req.user.id, // 🔥 АВТОМАТИЧНО З JWT
    });

    await page.save();
    res.json(page);
  } catch (e) {
    res.status(400).json({ message: e.message });
  }
});

/* ---------------- GET ALL PAGES ---------------- */
router.get("/", async (req, res) => {
  const pages = await Page.find()
    .populate("author", "firstName lastName email")
    .sort({ createdAt: -1 });

  res.json(pages);
});

/* ---------------- GET SINGLE PAGE ---------------- */
router.get("/:id", async (req, res) => {
  const page = await Page.findById(req.params.id)
    .populate("author", "firstName lastName email");

  if (!page) return res.status(404).json({ message: "Page not found" });
  res.json(page);
});

/* ---------------- UPDATE PAGE ---------------- */
router.put("/:id", auth, async (req, res) => {
  try {
    const page = await Page.findById(req.params.id);
    if (!page) {
      return res.status(404).json({ message: "Page not found" });
    }

    const isAuthor = page.author.toString() === req.user.id;
    const isAdmin = req.user.role === "admin";

    if (!isAuthor && !isAdmin) {
      return res.status(403).json({
        message: "You have no permission to edit this page",
      });
    }

    page.title = req.body.title;
    page.summary = req.body.summary;
    page.content = req.body.content;

    await page.save();
    res.json(page);
  } catch (e) {
    res.status(400).json({ message: e.message });
  }
});


/* ---------------- DELETE PAGE ---------------- */
router.delete("/:id", auth, async (req, res) => {
  const page = await Page.findById(req.params.id);
  if (!page) return res.status(404).json({ message: "Page not found" });

  const isAuthor = page.author.toString() === req.user.id;
  const isAdmin = req.user.role === "admin";

  if (!isAuthor && !isAdmin) {
    return res.status(403).json({
      message: "You have no permission to delete this page",
    });
  }

  await page.deleteOne();
  res.json({ message: "Page deleted" });
});


module.exports = router;
