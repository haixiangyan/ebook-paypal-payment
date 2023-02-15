// 读取本地 .env 文件
require('dotenv').config();

const Koa = require('koa');
const cors = require('@koa/cors');
const serve = require('koa-static')
const mount  = require('koa-mount')
const path = require('path')

const {routes} = require("./routes");

const app = new Koa();

// 开发本地环境对所有域名去掉跨域限制
app.use(cors({
  origin: 'http://localhost:5173'
}));
app.use(mount('/static', serve(path.join(__dirname, '../static'))));

// API
app.use(routes);

// 错误处理
app.on('error', error => {
  console.error('服务器错误', error);
})

// 监听端口
app.listen(3001);
console.log('服务器开启... 监听 3001 端口');

