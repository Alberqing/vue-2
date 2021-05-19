import { isFunction } from "../util/index";
import { observe } from "./observe/index";

export function initState(vm) {
    const opts = vm.$options;

    // if(opts.props) {
    //     initProps();
    // }
    // if(opts.methods) {
    //     initMethods();
    // }
    if(opts.data) {
        initData(vm);
    }
    // if(opts.computed) {
    //     initComputed();
    // }
    // if(opts.watch) {
    //     initWatch();
    // }
}

function proxy(vm, source, key) {
    Object.defineProperty(vm, key, {
        get() {
            return vm[source][key];
        },
        set(newVal) {
            vm[source][key] = newVal;
        }
    })
}

function initData(vm) {
    let data = vm.$options.data;
    // vue2 对data中数据进行数据劫持 object.defineProperty

    // _data进行关联
    data = vm._data = isFunction(data) ? data.call(vm) : data;

    // vm.xx ===> vm._data.xx
    for(let key in data) {
        proxy(vm, '_data', key)
    }

    observe(data);

}
