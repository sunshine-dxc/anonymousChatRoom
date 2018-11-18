var index = {
    showLoginError: function () {
        var paramStr = location.search.substring(1);
        var param = paramStr.split("&");
        var errMsg = '';
        param.forEach(function (value,index) {
            if(/^le=/.test(value)){
                errMsg = decodeURI(value.split("=")[1]);
                return false;
            }
        });
        if (errMsg) {
            alert(errMsg);
        }
    },
    init: function () {
        this.showLoginError();
    }

} 