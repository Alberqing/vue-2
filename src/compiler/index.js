// html字符串解析成对应的脚本来触发
import { parserHTML } from "./parserHTML";
import { generate } from "./generate";

export function compilerToFunction (template) {
    let root = parserHTML(template);


    let code = generate(root);
    console.log(code, '===>code');
    // 生成代码
    // function render() {
    //     return _c('div', {id: 'app', a: 1}, 'hello')
    // }
}
