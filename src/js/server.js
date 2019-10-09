//后台管理文件 自定义路由
const jsonServer = require('json-server')
const server = jsonServer.create()   //API returns an Express server
const router = jsonServer.router('../../db.json')   //这里定义了基本的数据文件 托管了db.json文件  return JSON Server router
const middlewares = jsonServer.defaults()   //API Returns middlewares used by JSON Server

//使用中间件
server.use(middlewares)

//代码控制添加自定义路由 这个方法可以替代route.js的作用 需要用到jsonServer.rewrite()的方法进行重定向    路由重定向方法一
// server.use(jsonServer.rewriter({
//     '/api/*': '/$1',
//     '/blog/:resource/:id/show': '/:resource/:id'
// }))

// 在此添加自定义的路由 add custom routes before JSON Server router
server.get('/echo', (req, res) => {
    res.jsonp(req.query)
});

server.use(jsonServer.bodyParser);

//设置login.html用户登录的后台处理提交方法 后台
server.post('/authorized', (req, res) => {  //authorized 就是这个hook
    // req.body:username userpwd
    if (req.body.username === 'admin' && req.body.userpwd === '2kanQ1qfgtTvYFp+YGUsa+xhVUk') {   //这串数字是b64_sha()对GOOGLE.COM生成的加密码
        res.jsonp({
            code: 1,
            msg: 'login success!',
            auth_token: 'sdaslask@sdk!sd123sad@sda21SDDSAsda2'
        });
    } else {
        res.jsonp({
            code: 8,
            msg: 'login failed, wrong username or userpwd!'
        });
    }
});

// 给post的请求返回创建时间的属性 这是post数据部分
server.use((req, res, next) => {
    if (req.method === 'POST') {
        req.body.createdAt = Date.now()
    }
    next()
});

//使用一个中间件 进行用户校验 这里只处理'/api'开头的请求
server.use('/api', (req, res, next) => {
    //约定 发送ajax请求:必须带请求头header:Authorization: sdasxasasdkjnmn1asdnmas(加密字符串)
    //加密的字符串是前端登录的时候 后台生成并返回给客户端的一个凭证  所以这里的请求头必须带了Authorization属性才能访问到后台的数据内容
    if (req.get("Authorization")) { //add your authorization logic here
        next() //next()表示执行下一个中间件
    } else {
        // res.sendStatus(401)   //给客户端发送一个未验证的字符串 没有登录成功
        // res.status(401).jsonp({
        //     code: 7,  //约定7是未登录
        //     msg: 'can\'t vist without login'
        // });
        next();
    }
});

//自定义输出内容 包装数据成jsonp的形式 就可以跨域了
router.render = (req, res) => {
    res.jsonp({
        msg: 'ok',
        code: 1,
        data: res.locals.data
    })
};

//这个相当于把当前设置好的router路由器实例挂载到另一个地址下 '/api' 下了
server.use('/api', router)

server.listen(3000, () => {
    console.log('JSON Server is running')
});