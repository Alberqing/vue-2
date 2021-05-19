import { isObject } from "../../util/index";
import { arrayMethods } from "./array";

// 数据是对象 将对象不断递归  进行劫持
// 数据是数组 劫持数组方法 对数组中不是基本数据类型进行检测

class Observer {
    constructor(data) {  // 对对象中的所有属性进行劫持
        Object.defineProperty(data, '__ob__', {  // 所有被劫持属性都有__ob__ 且不可枚举
            value: this,
            enumerable: false,
        })
        if(Array.isArray(data)) {   // 数组劫持 对数组原来的方法进行劫持  切片编程
            data.__proto__ = arrayMethods;
            // 如果数组中的数据是对象类型，需要监控对象的变化
            this.observeArray(data);
        } else {
            this.walk(data);  // 对象劫持逻辑
        }
    }
    walk(data) {
        Object.keys(data).forEach(key => {
            defineReactive(data, key, data[key]);
        })
    }
    observeArray(data) {  // 数组中数组、数组中对象劫持
        data.forEach(item => observe(item));
    }
}

function defineReactive(data, key, value) {
    observe(value);   // 对象套对象  递归处理  （性能差）
    Object.defineProperty(data, key, {
        get() {
            return value;
        },
        set(newV) {
            observe(value);  // 用户赋值新类型，要将此类型劫持
            value = newV;
        }
    })
}

export function observe(data) {
    // 是对象才观测
    if(!isObject(data)) {
        return;
    }
    if(data.__ob__) {
        return;
    }
    return new Observer(data);
}
