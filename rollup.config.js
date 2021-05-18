import babel from 'rollup-plugin-babel';

export default {
    input: './src/index.js',
    output: {
        format: 'umd',     // window.Vue  amd、commonjs
        name: 'Vue',
        file: 'dist/vue.js',
        sourcemap: true,   // es5->es6源代码

    },
    plugins: [
        babel({   // 使用babel转换
            exclude: 'node_modules/**'   // glob语法
        })
    ]
}


// 打包不同类型 可以写列表
