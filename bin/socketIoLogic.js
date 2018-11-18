const mongoKit = require('../src/common/mongokit');
const ObjectID  = mongoKit.ObjectID;
const newId = mongoKit.objectId.newId;

function getTime () {
		var now = new Date();
		var today = new Array('星期日','星期一','星期二','星期三','星期四','星期五','星期六');
		return `${now.getFullYear()}-${now.getMonth()+1}-${now.getDate()} ${today[now.getDay()]} ${now.getHours()}:${now.getMinutes()}:${now.getSeconds()}`;
}

exports.registerSocketIoLogic = function (io) {
	let  roomInfo = {};
	io.sockets.on('connection', function (socket) {
		let user;
		let roomID;
		//服务器
		socket.on('server_doJoin', function (data) {

			roomID = data.roomId;

			if (!roomInfo[roomID]) {

				roomInfo[roomID] = [];
			}
			user = data.userName;
		
			roomInfo[roomID].push(user);
			socket.join(roomID);
			mongoKit.dbPromise.then(function (db) {

				const rooms = db.collection("rooms");
				rooms.findOne({_id: ObjectID(roomID)},{projection: {message:1}},function (err,result) {
					console.log(result);
					socket.emit('client_welcome',{
						users: roomInfo[roomID],
						userName: user,
						msg: result.message
					});

				});
			})


			//广播上线通知
			socket.to(roomID).emit('client_useronline',{userName:user});

		});
		//下线时触发
		socket.on("disconnect",function () {
			// 从房间名单中移除
			console.log(roomInfo[roomID])
			if (roomInfo[roomID]) {

				const index = roomInfo[roomID].indexOf(user);
				if (index !== -1) {
				roomInfo[roomID].splice(index, 1);
				}
				socket.leave(roomID); // 退出房间

			}
			
			//广播下线通知
			socket.to(roomID).emit("client_useroffline",{userName:user});
				
		})


		//发送消息
		socket.on('server_sendMsg', function (data) {
				let msgObj = {
					userName: user || '游客',
					sendTime: getTime(),
					msg: data.msg
				}
				mongoKit.dbPromise.then(function (db) {

					const rooms = db.collection("rooms");
					rooms.updateOne({_id: ObjectID(roomID)},{$push:{message:msgObj}},function (err,result) {
						console.log(result);
					});
				})


				socket.emit('client_printMsg', msgObj);
				//广播
				socket.to(roomID).emit('client_printMsg',msgObj);

		});


	});	
}
