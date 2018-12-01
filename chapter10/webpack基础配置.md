# 第二节 webpack基础配置

## #安装webpack和webpack-server

1 新建一个目录

2 使用npm初始化目录 `npm init`

3 安装webpack和webpack-sever `npm install --save-dev webpack webpack-server`

## #就是一个js文件而已

webpack就是一个.js配置文件而已，一个项目的架构好坏！都在这个项目里面！

使用webpack一般都会在package.json中新增一个 快速启动的脚本：

```json
{
    "scripts": {
        "dev":"webpack-dev-serve --open --config webpack.config.js"
    }
}
```

上面代码的含义就是当运行`npm run dev`的时候，会执行`webpack-dev-serve --open --config webpack.config.js`这个命令，webpack开发服务启动，配置文件是webpack.config.js

当然，我们可以指定服务的地址和端口号，`webpack-dev-serve --host 10.23.25.14 --port 3000 --open --config webpack.config.js`

webpack.config.js作为配置文件，主要的关键信息都在这个文件里面配置，这个配置文件主要由四大部分组成：

- 入口（entry）
- 出口（output）
- 加载器（loader）
- 插件（plugin）

### #入口和出口

入口告诉webpack从哪里开始寻找依赖，并且编译，出口则用来配置文件存储位置和文件名。

一个简单的具备入口和出口配置的配置文件：

```javascript
var path = require("path");

var config = {
    entry: {
        main: "./main" // 单入口
    },
    output: {
        path: path.join(__dirname, "./dist"), // 打包后文件输出目录
        publicPath: "/dist/", // 指定资源文件引用的目录，如果资源在cdn上，可以写cdn的地址
        filename:"main.js" // 打包后文件输出名
    }
};

module.exports = config;
```

当我们使用`webpack-dev-serve --host 10.23.25.14 --port 3000 --open --config webpack.config.js`命令在运行webpack后，会有很多多余的代码，是因为webpack-dev-serve的功能，在开发环境下有效果，在生产环境下编译就不会有过多多余的代码，编译环境下，可以使用`webpack --progress --hide-modules`

### #loader

在webpack中，每个文件都是一个模块，加载解析模块使用的就是loader，加载不同的文件使用的是不同的loader，使用loader的步骤：

1 安装要使用的loader

2 在webpack配置文件中配置

例如，我们要配置一个css文件的loader，首先要安装需要的loader：

```shell
npm install css-loader --save-dev
npm install style-loader --save-dev
```

安装完成后，在webpack配置文件中配置loader

```javascript
var config = {
    module:{
        rule:[
            {
                test:/\.css$/, // 匹配css文件
                use:[
                    "style-loader","css-loader" // 先使用css-loader处理文件，然后在使用style-loader处理文件
                ]
            }
        ]
    }
};

module.exports = config;
```

假如我现在有一个style.css文件：

```css
/* style.css */
#app {
    color: red;
}
```

我在之前说明的入口文件main.js文件中引用这个css文件：

```javascript
// main.js

import "./style.css";
```

当main.js文件被打包的时候，webpack会判断这个js文件中引入了css文件，会先使用css-loader处理这个文件，然后在使用style-loader将最后生成的css文件，创建成为`<style></style>`元素的样式，插入到引用main.js的html文件中。

刚才我们说到的js、css、html以及webpack打包文件的清单如下：

**html**

```html
<!DOCTYPE html>
<html>
    <head>
        <meta charset="utf-8">
        <title>webpack App</title>
    </head>
    <body>
        <div id="app">
        </div>
        <script src="/dist/main.js"></script>
    </body>
</html>
```

**js**

```javascript
// mian.js
import "./style.css";
document.getElementById("app").innerHtml = "hello world";
```

**css**

```css
/* style.css */
#app {
    color: red;
}
```

**webpack.config.js**

```javascript
var path = require("path");

var config = {
    entry: {
        main: "./main" // 单入口
    },
    output: {
        path: path.join(__dirname, "./dist"), // 打包后文件输出目录
        publicPath: "/dist/", // 指定资源文件引用的目录，如果资源在cdn上，可以写cdn的地址
        filename:"main.js" // 打包后文件输出名
    },
    module:{
        rule:[
            {
                test:/\.css$/, // 匹配css文件
                use:[
                    "style-loader","css-loader" // 先使用css-loader处理文件，然后在使用style-loader处理文件
                ]
            }
        ]
    }
};

module.exports = config;
```

**最后经过webpack编译后的运行在浏览器中的dom结构**

```html
<!DOCTYPE html>
<html>
    <head>
        <meta charset="utf-8">
        <title>webpack App</title>
        <style>
        #app {
            color: red;
        }
        </style>
    </head>
    <body>
        <div id="app">
            hello world
        </div>
        <script src="/dist/main.js"></script>
    </body>
</html>
```

通过上一段代码我们发现，编译之后的css文件，是以`<style></style>`的形式插入到文档中，这说明，在项目编译过程中，已经将css中的内容编译到js文件中了，过于占用js文件的体积，还不能做缓存，这个时候，我们想将散落在各个文件中的css文件汇总到一起，生成一个总的css文件，这种需求是无法通过loader来实现的，因为loader只能编译某种特定的文件，所以要实现这个需求，就要使用到webpack中的插件（plugin）

### #插件

下面我们使用一个插件`extract-text-webpack-plugin`来吧散落在各地的文件汇总到一起，生成为一个main.css文件。

首先，使用npm安装这个插件：

```shell
npm install --save-dev extract-text-webpack-plugin
```

然后配置webpack配置文件

```javascript
// webpack.config.js

// 导入该插件
var ExtractTextPlugin = require("extract-text-webpack-plugin");

var config = {
    module:{
        rules:[
            {
                test: /\.css$/,
                use: ExtractTextPlugin({ // 这条规则要使用这个插件，并传递一个参数
                    use:"css-loader", // 参数说明先使用css-loader编译这个文件
                    fallback:"style-loader" // 然后调用style-loader
                })
            }
        ]
    },
    plugin:[ // 然后配置插件的信息
        new ExtractTextPlugin("main.css") // 使用这个插件，将输入到这个插件中的数据汇总到main.css中
    ]
};

module.exports = config;
```

使用这个配置文件编译成功的dom结构如下

```html
<!DOCTYPE html>
<html>
    <head>
        <meta charset="utf-8">
        <title>webpack App</title>
        <link ref="stylesheet" type="text/css" href="/dist/main.css">
    </head>
    <body>
        <div id="app">
            hello world
        </div>
        <script src="/dist/main.js"></script>
    </body>
</html>
```
