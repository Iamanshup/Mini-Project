const express = require("express");
const mongoose = require("mongoose");
const mongoURI = require("./config/keys");
const passport = require("passport");
const bodyParser = require("body-parser");
const session = require("express-session");
const methodOverride = require("method-override");
const multer = require("multer");
const app = express();
const exphbs = require("express-handlebars");
const path = require("path");
const cookieParser = require("cookie-parser");
require("./models");
const flash = require("connect-flash");
const users = require("./routes/users");
const items = require("./routes/items");
const index = require("./routes/index");
const {
  truncate,
  formatDate,
  select,
  stripTags,
  ifCon,
  editIcon
} = require("./helpers/hbs");
require("./config/passport")(passport);

mongoose.Promise = global.Promise;
mongoose
  .connect(mongoURI, {
    useNewUrlParser: true
  })
  .then(() => {
    console.log("Connected to Database..");
  })
  .catch(err => console.log(err));

app.engine(
  "handlebars",
  exphbs({
    helpers: {
      truncate: truncate,
      formatDate: formatDate,
      select: select,
      stripTags: stripTags,
      ifCon: ifCon,
      editIcon: editIcon
    },
    defaultLayout: "main"
  })
);

const fileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'images')
  },
  filename: (req, file, cb) => {
    cb(null, new Date().toISOString() + '-' + file.originalname);
  }
});

app.set("view engine", "handlebars");

app.use(cookieParser());

app.use(
  session({
    secret: "secret",
    resave: true,
    saveUninitialized: true
  })
);
app.use(
  bodyParser.urlencoded({
    extended: false
  })
);

app.use(bodyParser.json());
app.use(multer({
  storage: fileStorage
}).single('image'));

app.use(passport.initialize());
app.use(passport.session());

app.use(flash());
app.use(function (req, res, next) {
  res.locals.success_msg = req.flash("success_msg");
  res.locals.error_msg = req.flash("error_msg");
  res.locals.error = req.flash("error");
  res.locals.user = req.user || null;
  next();
});

app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "public")));
app.use("/users", users);
app.use("/items", items);
app.use("/", index);
const port = process.env.PORT || 5000;

app.listen(port, () => {
  console.log(`Server running on port ${port}..`);
});