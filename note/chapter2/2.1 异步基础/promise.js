const getName = new Promise((resolve, reject) => {
    setTimeout(() => {
        resolve("nodejs");
    }, 50);
});

const getNumber = Promise.resolve(1);
const getError = Promise.reject("出错啦~");

getError.catch(console.log);

Promise.race([getName, getName])
    .then(name => console.log('race1', name))
    // .then(console.log)
    .catch(console.log);

Promise.all([getName, getName])
    .then(name => console.log('all1', name))
    // .then(console.log)
    .catch(console.log);
    
Promise.race([getName, getName])
    .then(name => console.log('race2', name))
    // .then(console.log)
    .catch(console.log);
    
Promise.all([getName, getName])
        .then(name => console.log('all2', name))
        // .then(console.log)
        .catch(console.log);

getName
    .then(name => {
        console.log('then', name);
        return 20;
    })
    .then(number => {
        console.log(number);
    });
// 总结：
//  同一个promise来源的执行规则（优先级由低到高，高的可以覆盖掉低的）：
//  按代码顺序执行
//  .then的优先级比.all和.race优先级都更高，无论先后关系都是.then先执行
    