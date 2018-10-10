/**
 * @param {function[]} middleware 中间件的函数数组
 */
function compose(middleware) {
    // 参数类型判断
    if (!Array.isArray(middleware))
        throw new TypeError("Middleware stack must be an array!");
    for (const fn of middleware) {
        if (typeof fn !== "function")
            throw new TypeError("Middleware must be composed of functions!");
    }
    /**
     * @param {Object} context
     * @return {Promise}
     * @api public
     */
    return function (context, next) {
        // last called middlewar #
        let index = -1;
        return dispatch(0);
        // ：
        /**
         * @name 分发事件
         * @description 通过递归完成middleware的循环
         * @param {number} i middleware下标
         * @returns {Promis<T>} 返回一个promise，完成异步的操作
         */
        function dispatch(i) {
            // 
            if (i <= index)
                return Promise.reject(new Error("next() called multiple times"));
            index = i;
            let fn = middleware[i];
            if (i === middleware.length) fn = next;
            if (!fn)
                return Promise.resolve();
            try {
                return Promise.resolve(
                    // 核心代码将middleware数组里的下一个元素整个放入next()里执行
                    // 即：async function b在这里next()内部完成执行
                    // 等 整个b 完成了才会继续 a 的下一步
                    // 若有下一个，类似的进行嵌套
                    // !!!!!!!!!注：此处没有处理传递参数的情况
                    fn(context, function next() {
                        return dispatch(i + 1);
                    })
                );
            } catch (err) {
                return Promise.reject(err);
            }
        }
    }
}

// 使用
async function a(ctx, next) {
    console.log('a start');
    const hello = await Promise.resolve("hello a compose");
    console.log(hello);
    await next();
    console.log("a end");
}

async function b(ctx, next) {
    console.log('b start');
    const hello = await Promise.resolve("hello b compose");
    console.log(hello);
    await next();
    console.log("b end");
}

compose([a, b])({});