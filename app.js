var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
var cors = require("cors");

var indexRouter = require("./routes/index");
var registerRouter = require("./routes/register");
var loginRouter = require("./routes/login");
var usersRouter = require("./routes/users");
var todoRouter = require("./routes/todo");
var pastewRouter = require("./routes/pastew");

var app = express();

// view engine setup
// app.set('views', path.join(__dirname, 'views'));
// app.set('view engine', 'jade');

app.use(cors());
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/", indexRouter);
app.use("/api/register", registerRouter);
app.use("/api/login", loginRouter);
app.use("/api/users", usersRouter);
app.use("/api/todo", todoRouter);
app.use("/api/pastew", pastewRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);

  res.send(`error, page not found -> ${req.url}`);

  // reactRouterUrls = ["/login", "/register", "/users", "/boards", "/pastew"];

  // let flag = false;

  // for (let i = 0; i < reactRouterUrls.length; i++) {
  //   if (req.url == reactRouterUrls[i]) {
  //     flag = true;
  //   }
  // }

  // if (flag) {
  //   console.log("exec");
  //   res.redirect("/");
  // } else {
  // res.send(`error, page not found - ${req.url}`);
  // }
});

module.exports = app;
