const jsonServer = require('json-server')
const server = jsonServer.create()
const router = jsonServer.router('db.json')
const middlewares = jsonServer.defaults()

server.use(middlewares);

// 在此添加自定义的路由
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
            auth_token: 'this is the test data-cookie!'
        });
    } else {
        res.jsonp({
            code: 8,
            msg: 'login failed, wrong username or userpwd!'
        });
    }
});

// 给post的请求返回创建时间的属性
server.use((req, res, next) => {
    if (req.method === 'POST') {
        req.body.createdAt = Date.now()
    }
    next()
});

//这是挂载登录校验的中间件 只处理/api开头的地址
server.use('/api', (req, res, next) => {
    //约定 发送ajax请求 必须带一个header: Authorization:xasdasdSasasdasSDass;
    // req.get(Authorization)就是你自己校验的逻辑  Authorization就是需在请求头里面放的东西
    if (req.get('Authorization')) { // add your authorization logic here
        next() // continue to JSON Server router
    } else {
        res.status(401).jsonp({
            code:7,
            msg:'can\'t visit without login'
        });
    }
});

//自定义输出内容jsonp jsonp就是我们输出的数据内容的集合 里面包含了json的数据集合
router.render = (req, res) => {
    res.jsonp({
        msg: 'ok',
        code: 1,
        body: res.locals.data
    })
};

//这个就是相当于把当前所有的路由地址挂载在'/api/router'下
server.use('/api', router);

server.listen(3000, () => {
    console.log('JSON Server is running')
});