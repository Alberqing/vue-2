// html字符串解析成对应的脚本来触发
import { parserHTML } from "./parserHTML";
import { generate } from "./generate";

// 是否传入了 没传入可能传入的是template\template也没有传递
// 将html词法解析
// =>> ast语法树  用来描述html语法的
// codegen 生成代码


// with:

export function compilerToFunction (template) {
    let root = parserHTML(template);


    let code = generate(root);

    let render = new Function(`with(this){return ${code}}`);   // with（这里面要达到this为vm的效果） + new Function  =>>> 虚拟dom  ==>  真实dom

    return render;
}
