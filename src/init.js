import { initState } from "./state";

export function initMixin(Vue) {
    Vue.prototype._init = function(options) {
        const vm = this;
        vm.$options = options;  // 对options进行拓展

        // 对数据初始化 watch 、 data 、....
        initState(vm);
    }
}
