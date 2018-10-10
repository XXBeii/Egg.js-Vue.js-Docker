module.exports = options => {
    if (!options.format) {
        console.error("需要传递 format 函数");
    }
    // 函数为外部自定义的format
    // ctx参数来自上个中间件
    // 中间件完美衔接二者并实现异步处理
    return async (ctx, next) => {
        // ctx来自上个中间件传递的参数
        console.log(options.format(JSON.stringify(ctx)));
        await next()
    };
};
