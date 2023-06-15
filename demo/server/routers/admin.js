const express = require("express");
const router = express.Router();
const post = require("../models/post");
const user = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const jwtsecret = process.env.jwtsecrets;
const adminlayouts = "../views/layouts/admin.ejs";

//middleware----------------------------------------------------------------------------------------------------

const authMiddleware = (req, res, next) => {
  const token = req.cookies.token;
 // console.log(token);
  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    const decoded = jwt.verify(token, jwtsecret);
    req.userI = decoded.userI;
    //console.log(req.userI, decoded.userI);
    next();
  } catch (error) {
    res.status(401).json({ message: "Unauthorized" });
  }
};
//ADMIN WORKS================================================================================================================

//admin page rendering-------------------------------------------------------------------------------------
router.get("/admin", async (req, res) => {
  try {
   

    res.render("admin/index", {  layout: adminlayouts });
  } catch (error) {
    console.log(error);
  }
});
//regiserting user in database---------------------------------------------------------------------------------
router.post("/register", async (req, res) => {
  try {
    const { username, password } = req.body;
    const hasedpassword = await bcrypt.hash(password, 10);
    try {
      const data = await user.create({ username, password: hasedpassword });
      //console.log(data)
      res.status(201).json({ data });
    } catch (error) {
      if (error.code === 11000) {
        res.json({ message: "user already in use" });
      }
      res.json({ message: "internal server error" });
    }
  } catch (error) {}
});


//admin login form -----------------------------------------------------------------------------------
router.post("/admin", async (req, res) => {
  try {
    const { username, password } = req.body;

    const userId = await user.findOne({ username });
    //console.log(userId);
    if (!userId) {
      res.status(401).json({ message: "the data is invalid" });
    }
    const ispassword = await bcrypt.compare(password, userId.password);
    if (!ispassword) {
      res.status(401).json({ message: "the data is invalid" });
    }

    const token = jwt.sign({ userI: userId._id }, jwtsecret);
    res.cookie("token", token, { httpOnly: true });

    res.redirect("dashboard");
  } catch (error) {
    console.log(error);
  }
});
//dashboard creation and also finding data in db---------------------------------------------------------------
router.get("/dashboard", authMiddleware, async (req, res) => {
  try {
    const data = await post.find();
    res.render("admin/dashboard", { data, layout: adminlayouts });
   // console.log(data);
  } catch (error) {
    console.log(error);
  }
});

//adding new post-------------------------------------------------------------------------------------

router.get("/addpost",authMiddleware, async (req, res) => {
  res.render("admin/addpost");
});

router.post("/addpost", async (req, res) => {
  try {
    const newpost = new post({
      title: req.body.title,
      body: req.body.body,
    });
    const data = await post.create(newpost);
    //console.log(data);
    res.redirect("/dashboard");
  } catch (error) {
    console.log(error);
  }
});
//edit the post-----------------------------------------------------------------------------------------

router.get("/editpost/:id", authMiddleware, async (req, res) => {
  try {
    const data = await post.findOne({ _id: req.params.id });
   // console.log(data);
    res.render("admin/editpost", { data, layout: adminlayouts });
  } catch (error) {
    console.log(error);
  }

  res.render("admin/editpost");
});
router.put("/editpost/:id", authMiddleware, async (req, res) => {
  try {
    await post.findByIdAndUpdate(req.params.id, {
      title: req.body.title,
      body: req.body.body,
    });
    // res.redirect(`/editpost/${req.params.id}`);
    res.redirect("/dashboard");
    // console.log(data);
  } catch (error) {
    console.log(error);
  }
});
//delete post------------------------------------------------------------------------------------------
router.delete("/deletepost/:id", authMiddleware, async (req, res) => {
  try {
    await post.deleteOne({ _id: req.params.id });
    res.redirect("/dashboard");
  } catch (error) {
    console.log(error);
  }
});

//logout page to home--------------------------------------------------------------------------------------
router.get("/logout", (req, res) => {
  res.clearCookie("token");
  res.redirect("/");
});

module.exports = router;
