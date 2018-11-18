const fs = require("fs");
const mongokit = require("../src/common/mongokit");
const objectId = mongokit.objectId;
const models=require("../models/adminModels");


//登录页1面获取
exports.login = function (req,res,next) {
    req.session.destroy();
    res.render('admin/login',{title:"欢迎登录匿名聊天室"})
   

};
//登录页面
exports.doLogin =async function (req,res,next) {
    try{
        const name=req.body.username;
        const pass=req.body.password;
        const db = await mongokit.dbPromise;
        const admin = db.collection('admin');
       
        const count = await admin.countDocuments({"name":`${name}`,"password":`${pass}`});

        if (count > 0) {
            req.session.adminInfo = name;
            res.redirect('admin/index');
        }else{
            res.render('admin/login',{title:'欢迎登录匿名聊天室',err:'用户或者密码不正确'})
        }
        next();
    }catch(err){
        throw err;
    }
}
//后台管理首页获取
exports.index = function (req,res,next) {
    res.render('admin/index',{title:"后台管理 - 匿名聊天室"});
}

//后台管理 -- 聊天室管理
exports.roomList =async function(req,res,next){
    try {
        const db = await mongokit.dbPromise;
        const rooms = db.collection("rooms");
        //Cursor
        const cursor=rooms.find({});
        const data = await cursor.toArray();
        console.log(data);
        res.render('admin/partialRoomList',{data:data});
    } catch (error) {
        throw error;
    }
}

//后台管理 -- 添加聊天室
exports.doAddRoom =async function (req,res,next) {
    try{
        const roomModel = models.roomModel;
        roomModel._id = objectId.newId();
        roomModel.name = req.body.roomname;
        roomModel.maxSize = req.body.roommaxsize;
        roomModel.subject = req.body.roomsubject;
        const files = req.files;
        files.forEach((file,index) => {
            if (index==0) {
                const oldPath = file.path;
                const targetPath = `./public/images/${file.originalname}`;
                fs.renameSync(oldPath,targetPath)
                roomModel.photoUrl =targetPath.replace(/^.\/public/,"");
            }
           
        });
       
        //存入数据库
        const db = await mongokit.dbPromise;
        const rooms = db.collection("rooms");
        rooms.insertOne(roomModel);
        res.redirect('/admin/index');


    }catch(err){
        throw err
    }
}

/**
 * 编辑聊天室
 * @param req
 * @param res
 * @param next
 */

 exports.editRoom = async function (req,res,next) {
       
    try {
        //按照_id查找数据
        const db = await mongokit.dbPromise;
        const rooms = db.collection("rooms");
        const objectID = mongokit.ObjectID;
        const data = await rooms.findOne({_id:objectID(req.query._id)});
        res.render("admin/partialEditRoom",{data:data});

    } catch (error) {
        throw error;
    }

 }
 
/**
 * 更新聊天室
 * @param req
 * @param res
 * @param next
 */

 exports.doEditRoom = async function (req,res,next) {
     //更新数据
    console.log(req.body.hideId)    
    try {

        const db = await mongokit.dbPromise;
        const rooms = db.collection("rooms");
        const objectID = mongokit.ObjectID;
        const param = req.body;
        const options={
            name: param.roomname,
            maxSize: param.roommaxsize,
            subject: param.roomsubject
        };
        const result = await rooms.updateOne({_id:objectID(param.hideId)},{"$set":options});

        res.send(JSON.stringify({"isSuccess":true,"errMsg":null}));

    } catch (err) {
        res.send(JSON.stringify({"isSuccess":false,"errMsg":err.message}));    
    }
  
 }