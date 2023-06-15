const express = require("express");
const router = express.Router();
const post = require("../models/post");

//rendering home page ---------------------------------------------------------------------------------

router.get("/", async (req, res) => {
 
  try {
    const data = await post.find();
    res.render("index", {data});
  } catch (error) {
    console.log(error);
  }
});

//rendering unique post data------------------------------------------------------------------------

router.get("/post/:id", async (req, res) => {
  try {
    const slug = req.params.id;
    const data = await post.findById({ _id: slug });
    res.render("post", { data });
  } catch (error) {
    console.log(error);
  }
});

//search post in data base---------------------------------------------------------------------------------------

router.post("/search", async (req, res) => {
  try {
    let searchTerm = req.body.searchTerm;
    const searchNoSpecialChar = searchTerm.replace(/[^a-zA-Z0-9 ]/g, "");
console.log(searchNoSpecialChar);
    const data = await post.find({
      $or: [
        { title: { $regex: new RegExp(searchNoSpecialChar, "i") } },
        { body: { $regex: new RegExp(searchNoSpecialChar, "i") } },
      ],
    });

    res.render("search", {
      data,
    });
    console.log(data)
  } catch (error) {
    console.log(error);
  }
});

//rendering about page------------------------------------------------------------------------------------

router.get("/about", (req, res) => {
  res.render("about");
});

module.exports = router;
