const jsonServer = require('json-server')
const server = jsonServer.create()
const router = jsonServer.router('db.json')
const middlewares = jsonServer.defaults()

server.use(middlewares)

server.use(jsonServer.rewriter({'/api/*':'/$1', '/blog/:resource/:id/show':'/:resource/:id'}));

// 在此添加自定义的路由
server.get('/echo', (req, res) => {
  res.jsonp(req.query)
})

server.use(jsonServer.bodyParser)

// 给post的请求返回创建时间的属性
server.use((req, res, next) => {
  if (req.method === 'POST') {
    req.body.createdAt = Date.now()
  }
  next()
})

//自定义输出内容jsonp jsonp就是我们输出的数据内容的集合 里面包含了json的数据集合
router.render = (req, res) => {
    res.jsonp({
      msg:'ok',
      code:1,
      body: res.locals.data
    })
}

server.use(router)
server.listen(3000, () => {
  console.log('JSON Server is running')
})