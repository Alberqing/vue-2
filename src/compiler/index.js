const attribute = /^\s*([^\s"'<>\/=]+)(?:\s*(=)\s*(?:"([^"]*)"+|'([^']*)'+|([^\s"'=<>`]+)))?/     //  a=b a="b" a='b'
const dynamicArgAttribute = /^\s*((?:v-[\w-]+:|@|:|#)\[[^=]+\][^\s"'<>\/=]*)(?:\s*(=)\s*(?:"([^"]*)"+|'([^']*)'+|([^\s"'=<>`]+)))?/
const ncname = `[a-zA-Z_][\\-\\.0-9_a-zA-Z]*`;          // 标签名 abc-name
const qnameCapture = `((?:${ncname}\\:)?${ncname})`     // <aa:xxx></aa:xxx>
const startTagOpen = new RegExp(`^<${qnameCapture}`)   // 匹配开始标签
const startTagClose = /^\s*(\/?)>/     // 单标签
const endTag = new RegExp(`^<\\/${qnameCapture}[^>]*>`) //闭合标签
const doctype = /^<!DOCTYPE [^>]+>/i
// #7298: escape - to avoid being pased as HTML comment when inlined in page
const comment = /^<!\--/
const conditionalComment = /^<!\[/
const defaultTagRE = /\{\{((?:.|\r?\n)+?)\}\}/g;   // {{aaaaa}}


// 将解析后的结果 组装成树结构   栈

function createElementAst(tagName, attrs) {
    return {
        tag: tagName,
        type: 1,
        children: [],
        parent: null,
        attrs,
    }
}

let root = null;
let stack = [];
function parserHTML(html) {
    function start(tagName, attributes) {
        let parent = stack[stack.length - 1];  // 取最后一个
        let element = createElementAst(tagName, attributes);
        if(!root) {
            root = element;
        }
        element.parent = parent;    // 放入栈中时 记录父亲是谁
        if(parent) {
            parent.children.push(element);
        }
        stack.push(element);
    }

    function end(tagName) {
        let last = stack.pop();
        if (last.tag !== tagName) {
            throw new Error('标签有误');
        }
    }

    function chars(text) {
        text = text.replace(/\s/g, '');
        let parent = stack[stack.length - 1];
        if (text) {
            parent.children.push({
                type: 3,
                text
            })
        }
    }

    function advance(len) {
        html = html.substring(len);
    }

    function parseStartTag() {
        const start = html.match(startTagOpen);
        if(start) {
            const match = {
                tagName: start[1],
                attrs: [],
            }
            advance(start[0].length);
            let end;
            // 如果没有遇到标签结尾就不停的解析
            let attr;
            while(!(end = html.match(startTagClose)) && (attr = html.match(attribute))) {
                match.attrs.push({name: attr[1], value: attr[3] || attr[4] || attr[5]})
                advance(attr[0].length);
            }
            if(end) {
                advance(end[0].length)
            }
            return match;
        }
        return false;  // 不是开始标签
    }

    while(html) {  //要解析的内容是否存在，如果存在不停解析
        let textEnd = html.indexOf('<');   // 当前解析的开头
        if (textEnd === 0) {
            const startTagMatch = parseStartTag(html);  // 解析开始标签
            if(startTagMatch) {
                start(startTagMatch.tagName, startTagMatch.attrs);
                continue;
            }

            const endTagMatch = html.match(endTag);

            if(endTagMatch) {
                end(endTagMatch[1]);
                advance(endTagMatch[0].length)
            }
        }
        // 处理文本
        let text;
        if(textEnd > 0 ) {
            text = html.substring(0, textEnd)
        }
        if(text) {
            advance(text.length);
            chars(text);
        }
    }
}

// html字符串解析成对应的脚本来触发
export function compilerToFunction (template) {
    parserHTML(template);
}
