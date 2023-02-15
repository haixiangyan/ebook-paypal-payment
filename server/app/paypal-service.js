const axios = require('axios');
const {getBookDownloadUrl} = require("./book-service");

const { CLIENT_ID, CLIENT_SECRET } = process.env;

const base = 'https://api-m.sandbox.paypal.com';
const axiosInstance = axios.create({
  baseURL: base,
})

// 生成 Access Token
const generateAccessToken = async () => {
  const response = await axiosInstance.request({
    method: 'post',
    url: '/v1/oauth2/token',
    data: 'grant_type=client_credentials',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    auth: {
      username: CLIENT_ID,
      password: CLIENT_SECRET
    }
  })

  return response.data.access_token;
}

// 创建订单
const createOrder = async () => {
  const accessToken = await generateAccessToken();

  const response = await axiosInstance.post('/v2/checkout/orders', {
    intent: "CAPTURE",
    purchase_units: [
      {
        amount: {
          "currency_code": "USD",
          "value": "1.00"
        }
      }
    ],
  }, {
    headers: {
      Authorization: `Bearer ${accessToken}`
    }
  })

  return response.data;
}

// 确认支付
const capturePayment = async (orderId) => {
  const accessToken = await generateAccessToken();

  const response = await axiosInstance.post(`/v2/checkout/orders/${orderId}/capture`, {}, {
    headers: {
      Authorization: `Bearer ${accessToken}`
    }
  })

  if (response?.data?.purchase_units[0].payments.captures[0].status === 'COMPLETED') {
    return {
      orderData: response.data,
      url: getBookDownloadUrl(),
    }
  } else {
    return {
      orderData: response.data,
      url: '',
    }
  }
}

// 生成 client token
const generateClientToken = async () => {
  const accessToken = await generateAccessToken();

  const response = await axiosInstance.post('v1/identity/generate-token', {}, {
    headers: {
      Authorization: `Bearer ${accessToken}`
    }
  })

  return response.data.client_token;
}

module.exports = {
  createOrder,
  capturePayment,
  generateClientToken,
}
