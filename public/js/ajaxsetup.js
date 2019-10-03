//#region 这一段控制如果没有保存登录的cookie 则报错自动跳转回login.html
//执行了$.ajaxSetup之后 后续的所有ajax请求 都会拥有以下的默认设置 这个例子仅仅设置了headers
$.ajaxSetup({
    headers: {
        'Authorization': Cookies.get('auth_token'),
        'zdy': 'google.com',
    },
    statusCode: {
        '401': function (status, xhr) {
            //没有登录直接发送ajax请求 /api/接口
            $.messager.show({
                timeout: 1500,
                title: 'notice',
                msg: 'please login first! 2s to login-page!',
                closable: true
            });
            //设置跳转的方式
            setTimeout(function () {
                window.location.href = './login.html'
            }, 2000)
        }
    }
});
//#endregion