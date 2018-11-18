
var chatRoom = {
    socket:null,
    userJoin: function () {
        //发送连接请求
        this.socket = io.connect("http://127.0.0.1:3000");
        const userName = $("#userName").val();
        this.socket.emit("server_doJoin",{
            roomId: $("#roomId").val(),
            userName:userName
        });
        
    },
    regCallback: function () {
        //加入的时候触发的事件
        this.socket.on("client_welcome",function (data) {
            if (data.msg != null) {
                $.each(data.msg,function(index,obj){
                    chatRoom.showChatContent(obj.msg,obj.userName,obj.sendTime);
                })
            }
           
      
            $.each(data.users,function(index,user){

               $("#userList").append("<li>"+user+"</li>");
            });
            $("#divContent").append(`<p class="text-center" style="color:#555;font-size:12px;">-----------------  ${data.userName}加入聊天室 ------------------`);
            
        });
        //收到消息时的回调
        this.socket.on("client_printMsg",function(data){
            chatRoom.showChatContent(data.msg,data.userName,data.sendTime);
           
        });
        //他人上线通知
        this.socket.on("client_useronline",function (data) {

            $("#userList").append("<li>"+data.userName+"</li>");
            $("#onlineTip").text(`${data.userName} 上线了`).show().fadeOut(2000);
            chatRoom.showToast(`${data.userName} 上线了!`)


        })
        //他人下线通知
        this.socket.on("client_useroffline",function (data) {

            chatRoom.showToast(`${data.userName} 下线了!`)
            var $lis =  $("#userList").find("li");
            $.each($lis,function (index,li) {

                if($(li).text()==data.userName){
                    $(li).remove();
                    return;
                }
              
            });
        })

        
        
    },
    registerUIEvents: function () {

        $("#roomBtnSend").on("click",function () {

            var msg = $("#inputContent").val();
            chatRoom.socket.emit("server_sendMsg",{msg,msg});
            $("#inputContent").val("");
        });
    },
    showToast: function (msg) {

        const $div = $("<div class='toast text-center'/>").text(msg);
        $("#divContent").append($div);

    },
    showChatContent: function (msg,author,data) {

        var $div = $('<div class="chatContent"/>');
        $div.append('<span class="author">'+author+'：</span><span class="msg">'+msg+'</span>'); 
        $div.append('<br><div class="data">'+data+'</div><hr>');
        $("#divContent").append($div);

        
    },
    //初始化
    init: function () {
        this.userJoin();
        this.regCallback();
        this.registerUIEvents();
       
    }
}