// var assert = require("assert");
const express = require('express');
const router = express.Router();
const admin = require("./adminController");
const home = require("./homeController");
const adminAuthFiter = require('../fiters/adminAuthFiter');
//Multer 是一个 node.js 中间件，用于处理 multipart/form-data 类型的表单数据，
//它主要用于上传文件。它是写在 busboy 之上非常高效。
const multer = require('multer');




//后台登录页面
router.get('/login',admin.login);
router.post('/login',admin.doLogin);
//后台管理首页
router.get('/admin',adminAuthFiter.authorize,admin.index);
router.get('/admin/',adminAuthFiter.authorize,admin.index);
router.get('/admin/index',adminAuthFiter.authorize,admin.index);

//后台管理页面 -- 聊天室管理

router.get('/admin/roomList',adminAuthFiter.authorize,admin.roomList);

//后台管理页面 -- 添加聊天室

const upLoad = multer({dest:"./templeFiles/"});
router.post('/admin/addroom/',upLoad.any(),adminAuthFiter.authorize,admin.doAddRoom)

//后台管理页面 -- 编辑聊天室
router.get('/admin/editRoom',adminAuthFiter.authorize,admin.editRoom)
//后台管理页面 -- 更新聊天室
router.post('/admin/editRoom',adminAuthFiter.authorize,admin.doEditRoom)

//********************************注册前台路由信息

//首页 
router.get("/",home.index)
router.get("/home",home.index)
router.get("/home/",home.index)
router.get("/home/index",home.index)
//登录
router.post("/home/login",home.doLogin);
//注册
router.get("/home/registor",home.registor);
//注册提交
router.post("/home/registor",home.doRegistor);

//聊天室列表
router.get("/home/room",home.roomList);
//进入聊天室
router.get("/home/room/:id",home.joinRoom);





module.exports = router;