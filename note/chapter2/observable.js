function create(fn) {
    let ret = false;
    return (({ next, compelet, error}) => {
        
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
    compelet: console.log,
    error: console.log
};

let unsubscribe =observerable(subject);
