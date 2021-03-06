var createError  = require('http-errors');
var express      = require('express');
var path         = require('path');
var cookieParser = require('cookie-parser');
var logger       = require('morgan');
var session      = require('express-session');

const auth       = require('./auth/auth');
var indexRouter  = require('./routes/index');
var usersRouter  = require('./routes/users');
var logsRouter   = require('./routes/logs');
var plansRouter  = require('./routes/plans');
var spotsRouter  = require('./routes/spots');
var groupsRouter = require('./routes/groups');

var app = express();

var RedisStore = require('connect-redis')(session);
var store      = new RedisStore({
  port: 6379,          // Redis port
  host: 'redis',   // Redis host
  pass: 'admin',
  db  : 8
});

app.use(session({
  store : store,
  secret: 'about_oa',
  resave: false,
  cookie: {maxAge: 6000000}//100 min
  // cookie: {maxAge: 30000}//10 min test for session reschedule!
}));

// app.use(session({
//   secret           : 'about_oa',
//   resave           : true,
//   saveUninitialized: true,
//   cookie           : {maxAge: 6000000}//100 min
// }));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
// app.set('views', path.join(__dirname, 'dist'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'dist')));

app.use('/', indexRouter);
app.use('/api/v1/', usersRouter);
// app.use('/api/v1/', logsRouter);
app.use('/api/v1/', plansRouter);
app.use('/api/v1/', spotsRouter);
app.use('/api/v1/', groupsRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error   = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 404);
  return res.json({code: 4, Message: {err: 'not found'}});
  // res.render('error');
});

module.exports = app;