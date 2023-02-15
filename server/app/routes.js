const Router = require('koa-router');
const {createOrder, capturePayment, generateClientToken} = require("./paypal-service");

const router = new Router();

// 创建订单
router.post('/api/orders', async (ctx) => {
  ctx.body = await createOrder();
})

// 确认订单
router.post('/api/orders/:orderId/capture', async (ctx) => {
  const { orderId } = ctx.params;
  ctx.body = await capturePayment(orderId);
})

// 生成 client token
router.get('/api/client_token', async (ctx) => {
  const clientToken = await generateClientToken()
  ctx.body = {
    clientId: process.env.CLIENT_ID,
    clientToken,
  };
})

module.exports = {
  routes: router.routes()
};
