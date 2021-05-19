let oldArrayPrototype = Array.prototype;

export let arrayMethods = Object.create(Array.prototype);

// arrayMethods.__proto__ = Array.prototype;

let methods = [
    'push',
    'shift',
    'unshift',
    'pop',
    'reverse',
    'sort',
    'splice',
]


methods.forEach(method => {
    // 调用的是以上七个方法 会用自己重写 否则用原来的数组方法
    arrayMethods[method] = function(...args) {
        oldArrayPrototype[method]. call(this, ...args)
        let inserted;
        let ob = this.__ob__;
        switch (method) {
            case 'push':
            case 'unshift':
                inserted = args;
                break;
            case 'splice':
                inserted = args.slice(2);
                // break;
            default:
                break;
        }
        // 如果有新增内容 继续劫持 观测数组中每一项
        if(inserted) ob.observeArray(inserted)
    }
})
