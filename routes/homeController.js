const mongoKit = require('../src/common/mongokit');
const ObjectID  = mongoKit.ObjectID;
const newId = mongoKit.objectId.newId;
const homeModels = require('../models/homeModels');

/**
 * 首页
 * @prama req
 * @prama res
 * @prama next
 */
exports.index = async function (req,res,next) {
   try {
        const db = await mongoKit.dbPromise;
        const rooms = db.collection('rooms');
        const users = db.collection("users");
        const data = await rooms.find({"isEnable":true}).toArray();
        const user = await users.findOne({_id:ObjectID(req.session.user_id)});

        res.render("home/index",{
            title:"欢迎进入匿名聊天室",
            data:data,
            user:user
        });
   } catch (err) {
       throw err;
   }
} 
/**
 * 登录
 * @prama req
 * @prama res
 * @prama next
 */
exports.doLogin = async function (req,res,next) {

    if (req.body.loginout=="true") {

        req.session.destroy();
        res.redirect("/home/index");
        return false

    }
    try {
        //查找数据
        const db = await mongoKit.dbPromise;
        const users = db.collection('users');
        const user = await users.findOne({name:req.body.username,pass:req.body.userpass});
        if (user) {
            req.session.user_id = user._id;
            res.redirect("/home/index")
        }else{
            res.redirect("/home/index?le=登录失败")
        }
    } catch (err) {
        throw err;
    }
};

/**
 * 注册
 * @prama req
 * @prama res
 * @prama next
 */
exports.registor = function (req,res,next) {
    res.render("home/registor");
}
 /**
 * 注册提交
 * @prama req
 * @prama res
 * @prama next
 */
exports.doRegistor =async function (req,res,next) {
    let user = homeModels.userModel
    user._id = newId();
    user.name = req.body.account;
    user.nick = req.body.nick;
    user.pass = req.body.pw2;

   try {
       //插入数据
        const db = await mongoKit.dbPromise;
        const users = db.collection("users");
        users.insertOne(user);
        req.session.user_id = user._id;
        res.redirect("/home/index");

   } catch (err) {
       throw err
   }
    
}
/**
 * 聊天室列表
 * @prama req
 * @prama res
 * @prama next
 */
exports.roomList = function (req,res,next) {
    res.render("home/roomList");
}

/**
 * 进入聊天室
 * @prama req
 * @prama res
 * @prama next
 */
exports.joinRoom = async function (req,res,next) {
    if (!req.session.user_id) {
        res.render("home/customErr",{type:"notLogin"});
    }
    try {
        const roomId = req.params.id;
        const db = await mongoKit.dbPromise;
        const rooms = db.collection("rooms");
        const users = db.collection("users");
        const doc = await rooms.findOne({_id:ObjectID(roomId)});
        const user = await users.findOne({_id:ObjectID(req.session.user_id)});
        if (doc) {

            res.render("home/room",{
                title:doc.name,
                roomId: doc._id,
                roomTitle: doc.name,
                roomSubject: doc.subject,
                userName:user.name
            });
            
        } else {
            res.render("home/404");
        }
        
    } catch (err) {

        res.render("home/500",{msgErr:err.message});
        
    }
}


