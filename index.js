/**
 * Dependencies
 */
require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const fileUpload = require("express-fileupload");
const expressSession = require("express-session");
const flash = require("connect-flash");

/**
 * Controllers
 */
const newPostController = require("./controllers/newPost");
const homeController = require("./controllers/home");
const getPostController = require("./controllers/getPost");
const storePostController = require("./controllers/storePost");
const newUserController = require("./controllers/newUser");
const storeUserController = require("./controllers/storeUser");
const loginController = require("./controllers/login");
const loginUserController = require("./controllers/loginUser");
const logoutController = require("./controllers/logout");

/**
 * Middleware
 */
const validateMiddleWare = require("./middleware/validationMiddleware");
const authMiddleware = require("./middleware/authMiddleware");
const redirectIfAuthMiddleWare = require("./middleware/redirectIfAuthMiddleWare");

let port = process.env.PORT;
if (port == null || port == "") {
  port = 4000;
}

mongoose
  .connect(
    `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.p6nmvrs.mongodb.net/${process.env.DB_NAME}`,
    {
      family: 4,
    }
  )
  .then(() => console.log("database conection succesfull"))
  .catch((err) => console.log(err));

global.loggedIn = null;

const app = express();
app.set("view engine", "ejs");
app.use(flash());
app.use(express.static("public"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(fileUpload());
app.use("/posts/store", validateMiddleWare);
app.use(
  expressSession({
    secret: "secret key",
    resave: false,
    saveUninitialized: false,
  })
);
app.use("*", (req, res, next) => {
  loggedIn = req.session.userId;
  next();
});

app.get("/", homeController);

app.get("/post/:id", getPostController);
app.get("/posts/new", authMiddleware, newPostController);
app.post("/posts/store", authMiddleware, storePostController);

app.get("/auth/register", redirectIfAuthMiddleWare, newUserController);
app.post("/users/register", redirectIfAuthMiddleWare, storeUserController);

app.get("/auth/login", redirectIfAuthMiddleWare, loginController);
app.post("/users/login", redirectIfAuthMiddleWare, loginUserController);

app.get("/auth/logout", logoutController);

app.use((req, res) => {
  res.render("notfound");
});

app.listen(port, () => {
  console.log(`app listening on port ${port}`);
});
