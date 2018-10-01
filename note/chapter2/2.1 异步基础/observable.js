/**
 * 创建一个可观察对象
 * @param fn 观察者函数:接收一个observer:{next, compelet, error}的参数的函数
 * 创建过程：将fn的参数的三个属性重新包装再返回fn
 */
function create(fn) {
    let ret = false;
    return (({ next, compelet, error}) => {
        
        // nextFn与外部next属性的函数有同样的参数
        function nextFn(...args) {
            if (ret) {
                return;
            }
            next(...args);
        }

        function compeletFn(...args) {
            compelet(...args);
            ret = true;
        }

        function errorFn(...args) {
            error(...args);
        }

        fn({
            next: nextFn,
            compelet: compeletFn,
            error: errorFn
        });

        return () => (ret = true)
        
    })
}

// observerable指向一个个刚刚被create创建并返回的fn（同上）的函数
let observerable = create(observer => {
    setTimeout(() => {
        observer.next(1);
    }, 1000);
    observer.next(2);
    observer.compelet(3);
});

const subject = {
    next: value => {
        console.log(value);
    },
    // 此处与compelet: value => console.log(value)一样的效果
    compelet: console.log,
    error: console.log
};

// 订阅一个可观察对象
// 向已经被创建好的fn传入一个具有完整的三个属性的名为subject的对象
// fn根据其内部observable的状态来执行subject的属性的函数
let unsubscribe = observerable(subject);

// 总结
// 创建observable的过程就是创建一个步骤顺序，设立执行顺序，有三个坑next, compelet, error，按顺序摆好
// 订阅observable就是把之前设好的步骤上填坑，在next, compelet, error上分别执行什么

// 关键：create步骤内，fn的参数是create给的，但是fn的函数体是外部给的
// 启发：
// 一般情况：参数外部给，函数体固定
// 这里：参数固定，函数体外部给达成可约定执行顺序来执行操作的目的


// 抽象总结

// 以subject视角：

// subject内的next、complete，error被封装了三次：

// 对象封装：
// subject将三者属性封装成一个对象
//   将观察者的三个属性封装成一个对象

// 函数封装：
// subject传入observerable时，将其内部的三个属性又分别封装成 ***Fn
//   将三个属性进行修饰，使其有了一些功能如：记录，再将修饰后的函数作为新的参数传给fn执行

// 路径封装：
// ***Fn传入fn的时候又被fn再次封装
//   在fn内部对传递进来的一些参数做了一些执行路径处理，使得函数可达到异步按序执行的目的


// 以fn视角：
// fn仅被封装过一次：

// 工厂修饰：
// fn是任意的函数，其内部都是用户自身自定义的，可执行任何语句，特殊在于：只接受一个包含三个属性的对象为参数，而这个参数一般称为observer。
// 由于fn自定义，其对执行是不会有任何规则限制的，所以要让fn经过create这个工厂修饰一下，根据其的参数的特殊性，故而在fn传入参数之前对其参数进行修饰，达到观察的目的。
// 对于subject则仅仅是个有三个属性的对象就可以了

// 在以subject的视角里，将所有执行步骤和过程解析，很容易理解，但感觉较为分散，设计很巧妙，却总有中抓不住的感觉
// 在fn视角里，则将包装的思路解析了和subject正好相反，不太容易理解，但是很明显感受到fn，create，subject三者的线索就是同样的“格式”串联其中
// 正反都解析了就很明了其中的思路了。

// 思考：
// 在以后对函数的封装时，可以采用类似的，用一个工厂来将一个 内容不定、参数确定 的函数修饰成一个具有高阶功能的函数，这样可以做到很多不一样的东西
// 解析完之后发现还是蛮简单的，都是函数封装罢了，却也有这种玩法，不得不叹服。