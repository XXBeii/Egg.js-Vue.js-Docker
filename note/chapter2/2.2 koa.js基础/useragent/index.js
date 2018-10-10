const Koa = require("koa");
// 代理中间件
const userAgent = require("koa-useragent");
// 使用自己的koa中间件
const log = require("./log");

// 创建服务器
const app = new Koa();

const config = { format: text => `====== ${text} ======` };

// 使用代理
app.use(userAgent);
// 使用自定义中间件
app.use(log(config));

// app.use(async (ctx, next) => {
//     console.log(require("util").inspect(ctx.userAgent));
// })

app.listen(3000);
