import { isObject } from "../../util/index";

class Observer {
    constructor(data) {  // 对对象中的所有属性进行劫持
        console.log(data, 'kdjhj');
        this.walk(data);
    }
    walk(data) {
        Object.keys(data).forEach(key => {
            defineReactive(data, key, data[key]);
        })
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
    return new Observer(data);
}
