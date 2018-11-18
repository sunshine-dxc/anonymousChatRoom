var index = {
    /**
     * 注册UI相关事件
     */
    registerUIEvents: function () {
        $('li.submenu').on('click',function (e) {
           
            const $self = $(this);
            const $ul = $self.find(">ul");
            if($self.hasClass("open")){
                $ul.slideUp(250);
                $self.removeClass("open");
            }else{
                $ul.slideDown(250);
                $self.addClass("open");

            }
            return false;
        });
        /**
         * 左边二级菜单点击事件
         */
        $('li.submenu>ul>li').on('click',function (e) {
            const $self = $(this);
            const $parent = $self.parent("li");
            $parent.siblings().removeClass("active");
            $parent.addClass("active");
            const href = $self.find('a:eq(0)').attr("href");
            index.common.changeNewPage(href);
            return false
        });
        /**
         * 左边一级菜单点击事件
         */
        $('#sidebar > ul > li:not(.submenu)').on('click',function (e) {
            
            e.preventDefault();
            const $self = $(this);
            $self.siblings().removeClass("active");
            $self.addClass("active")
            const href = $self.find('a:eq(0)').attr('href');
            index.common.changeNewPage(href);
            return false;
        });

        /**
         * 注销登录确认框
         */
        $('#logout').on('click',function(e){
            if(!confirm('您确定要注销登录吗？')) {
                e.preventDefault();
            }
        })
        /**
         * 添加聊天室
         */
        $("#content").on("click","#addRoom",function () {
            const d = dialog({
                id: "add_room_dialog",
                skin: 'min-dialog tips',
                title: '添加聊天室',
                content: $('#add_room').html(),
                width:500,
                height:300
            });
            d.showModal();
        })
        /**
         * 编辑聊天室
         */
        $("#content").on("click",".edit-room",function () {
            $.ajax({
                url:"/admin/editRoom",
                type:"get",
                data:{"_id":$(this).data("id")},
                success: function(data){
                    const d = dialog({
                        id: "edit_room_dialog",
                        skin: 'min-dialog tips',
                        title: '更新聊天室',
                        content: data,
                        width:500,
                        height:300
                    });
                    d.showModal();
                }
            })
            
        });
        /**
         * 更新聊天室内容
         */
        $(document).on("click","#btn_edit_room",function(e){
            console.log($("#form_edit_room").serialize());
            $.ajax({
                url:"/admin/editRoom",
                type:"post",
                data:$("#form_edit_room").serialize(),
                success:function (data) {    
                    console.log(data);
                    const result =JSON.parse(data);
                    if (result.isSuccess) {
                        index.common.changeNewPage("/admin/roomList");  
                                   
                    }else{
                        console.log(result.errMsg)
                    }
                }
            });
            const dialogEdit = dialog.get("edit_room_dialog");
            dialogEdit.close().remove();   
           
            return false;
        })

    },
    /**
     * 页面公共事件
     */
    common:{
        changeNewPage:function (url) {
            if (url=="/admin/index") {
                location.href="/admin/index";
                return;
            }
            $.ajax({
                url: url,
                cache: false,
                type: "get",
                success: function (data) {
                    $("#content").html(data);
                }
            })
        }
    },
    /** 
     * 页面脚本初始化
     * */ 
    init: function(){
        this.registerUIEvents();
    }
    
}