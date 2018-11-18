/**
 * 管理员验证权限
 * @param req
 * @param res
 * @param next
 */
const app = require('./../app');

exports.authorize = function (req,res,next) {

    app.logInfo("default").warn(`IP:${req.ip},非法请求后台！`);
    if(!req.session.adminInfo){
        res.redirect('/login');
    }else{
        next();
    }

}