import express from 'express';
import path from 'path';
import cookieParser from 'cookie-parser';
import createError from 'http-errors';
import logger from 'morgan';
import indexRouter from './routes/index';
import apiRouter from './routes/api';
import mustacheExpress from 'mustache-express';

const app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

//Set the staic content, for quick implementation use static paths (should be webpack)
app.use(express.static(path.join(__dirname, '../public')));
app.use(express.static(path.join(__dirname, '../node_modules/jquery/dist/')));
app.use(express.static(path.join(__dirname, '../node_modules/bootstrap/dist/js')));
app.use(express.static(path.join(__dirname, '../node_modules/bootstrap/dist/css')));

//Register the routes
app.use('/', indexRouter);
app.use('/api', apiRouter);

// view engine setup
app.set('views', path.join(__dirname, '../views'));
app.engine('mustache', mustacheExpress());
app.set('view engine', 'mustache');



// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

export default app;