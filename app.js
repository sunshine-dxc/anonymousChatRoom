const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const lessMiddleware = require('less-middleware');
const logger = require('morgan');

//日志
const log4js = require('log4js');

log4js.configure({

    appenders: {
        out: { type: 'console' },
        task: {
            type: 'dateFile',
            filename: 'logs/task',
            pattern: '-dd.log',
            alwaysIncludePattern: true,
            replaceConsole:true
        },
        errorFile:{
            type: "file",
            filename:"logs/errFile.log",
            replaceConsole:true
        }
    },
    categories: {
        default: {appenders: [ 'out','task'], level: 'info' },
        task: {appenders:['errorFile'],level:'info'}
    }

});

// const loggerLog4js = log4js.getLogger('console');
// console.log = loggerLog4js.info.bind(loggerLog4js);
const app = express();

app.logInfo = log4js.getLogger;

module.exports = app;

const router = require('./routes/routeManager');


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(log4js.connectLogger(log4js.getLogger('default')));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
// app.use(multer({dest:"./templeFiles/"}));
app.use(session({
    secret:'user_secret_session',
    resave:false,
    saveUninitialized:false
}));

app.use(lessMiddleware(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', router);


// catch 404 and forward to error handler
// app.use(function(req, res, next) {
//   next(createError(404));
// });

// error handler

//服务端错误
app.use(function (err,req,res,next) {
    if(err){
        log4js.getLogger('task').error(err.stack);
        // res.send(500,"服务器错误！") 过期了
        res.status(500).send("服务器错误!" + err.message)
    }else {
        next();
    }
});
//客户端
app.use(function (err,req,res,next) {
    if (req.xhr) {
        log4js.getLogger('task').error(err.stack);
        // res.send(500,"出错啦");过期了
        res.status(500).send("出错了!");
    }else{
        next();
    }
});
//进程出错
process.on('uncaughtException',function (err) {
    log4js.getLogger('task').error('未处理的异常：' + err.stack);
});



// app.use(function(err, req, res, next) {
//   // set locals, only providing error in development
//   res.locals.message = err.message;
//   res.locals.error = req.app.get('env') === 'development' ? err : {};

//   // render the error page
//   res.status(err.status || 500);
//   res.render('error');
// });


