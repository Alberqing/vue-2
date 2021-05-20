import { initState } from "./state";
import { compilerToFunction } from "./compiler/index";
import { mountComponent } from './lifecycle';

export function initMixin(Vue) {
    Vue.prototype._init = function(options) {
        const vm = this;
        vm.$options = options;  // 对options进行拓展

        // 对数据初始化 watch 、 data 、....
        initState(vm);

        // 将数据挂载到模板上
        if(vm.$options.el) {
            vm.$mount(vm.$options.el)
        }
    }

    Vue.prototype.$mount = function(el) {
        const vm = this;
        const options = vm.$options;
        el = document.querySelector(el);
        // 把模板转换成对应的渲染函数  =》虚拟dom  vnode  diff算法 更新虚拟
        // render优先级更高
        if(!options.render) { // 无render  用template
            let template = options.template;
            if(!template && el) {  // 取el内容作为模板
                template = el.outerHTML;
                let render = compilerToFunction(template);  // 把模板变为渲染函数

                options.render = render;
            }
        }

        // 调用render方法 渲染为真实dom 替换掉页面内容


        mountComponent(vm, el);   // 组件挂载流程
    }
}
