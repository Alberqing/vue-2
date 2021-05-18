import { initMixin } from './init';

// options: 用户传入的选项
function Vue(options) {
    this._init(options);  // 初始化操作
}

initMixin(Vue);

export default Vue;
