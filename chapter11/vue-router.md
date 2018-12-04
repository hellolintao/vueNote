# 第一节 前端路由与vue-router

## #什么是前端路由

假如说我们开发一个后台管理系统，大多数业务需求下，后台管理系统都会有菜单切换的功能，每个菜单对应着相应的页面，点击菜单之后，导致页面的跳转，浏览器出现一片空白，重新加载页面，亦或是使用iframe的形式，也会引起iframe中的资源重新加载。

但是在一个SPA应用中，当我们点击一个菜单之后，操作区域会发生改变，但是页面不会整体的刷新，是因为SPA只有一个HTMl，所有的内容都在一个HRML中，所以关于内容的切换，是由JS来处理的，处理内容切换的功能，我们称之为前端路由。

如果要独立开发一个前端路由，需要考虑页面的课插拔，页面的生命周期，内存管理等问题。

## #vue-router的基本用法


首先，通过npm安装路由插件`npm install --save vue-router`

然后，打开`main.js`，使用`Vue.use()`加载插件：

```javascript
// main.js
import Vue from "vue";
import VueRouter from "vue-router";
import App from "./app.vue";

Vue.use(VueRouter);
```

在项目下新建`views`目录，用于存放所有的页面，该目录下一个vue单文件代表一个页面，在该目录下新建三个文件，index.vue、about.vue、user.vue，其中user.vue是可以接受参数的，所以配置有点不一样

```html
<!-- index.vue -->
<template>
    <div>首页</div>
</template>
<script>
    export default {

    }
</script>
```

```html
<!-- about.vue -->
<template>
    <div>介绍页</div>
</template>
<script>
    export default {
        
    }
</script>
```

```html
<!-- user.vue -->
<template>
    <div>{{ $router.params.id }}</div>
</template>
<script>
    export default {
        
    }
</script>
```

然后我们回到入口js文件中，也就是main.js中，配置路由具体属性：

```javascript
// main.js
import Vue from "vue";
import VueRouter from "vue-router";
import App from "./app.vue";

Vue.use(VueRouter);

const Routers = [
    {
        path:"/index",
        component: (resolve) => {
            return require(["./views/index.vue"], resolve);
        }
    }, {
        path:"/about",
        component: (resolve) => require(["./views/about.vue"], resolve);
    }, {
        path: "/user/:id", // 冒号可以传递一些参数
        component: (resolve) => {
            return (["./views/user.vue"], resolve)
        }
    }, {
        path: "*", // 如果访问的路径不存在，那么跳转到index！如果访问127.0.0.1/user没有指定参数的话，也算是不存在的路径！
        redirect: "/index"
    }
];
```

`Routers`中的每一项都是对应一个路由，其中`path`是指定匹配的路径，`component`是映射的组件，webpack在打包的时候，会把每一个路由打包成为一个js文件，在请求该页面时，才去加载这个页面的js，也就是异步实现的懒加载（按需加载），如果非要一次性加载进来的话，可以使用`component: require("./views.index.vue")`这种形式。

在使用webpack中，我们经常看到的一个词，`chunk`，当我们使用异步路由的时候，每个页面被打包成一个单独的js文件，这个文件就是`chunk(块)`，他的默认命名是0.main.js，1.main.js，如果想指定命名格式，可以在webpack配置文件中修改chunk命名形式：

```javascript
// webpack.config.js
output: {
    public: "/dist/",
    filename:"[name].js",
    chunkFilename: "[name].chunk.js"
}
```

如果采用了异步路由，异步路由相对的vue单文件中的样式块是不能被提取出来早一个总css文件中的，是通过动态创建`<style>`标签的形式加载的，如果想把这个异步路由中的样式部分提取出来，编辑配置文件中的`extract-text-plugin`插件信息：

```javascript
// webpack.config.js
plugin: [
    new ExtractTextPlugin({
        filename: "[name].css",
        allChunks: true
    })
]
```

下面我们继续来完善路由的配置，继续编辑main.js

```javascript
// main.js

const RouterConfig = {
    mode: "history", // 采用H5中的History模式
    routes: Routers // 刚才我们配置的路由列表
}

const router = new VueRouter(RouterConfig);
new Vue({
    el:"#app",
    router: router,
    render: (h) => {
        return h(App)
    }
});
```

因为我们说明了路由是`history`模式，所以是通过`/`设置路径，如果不采用`history`的话，将使用`#`设置路径。使用这种模式，必须将所有路由都指向同一个html，或者设置404页面为该html，否则刷新的时候会出现错误，在package.json中修改命令：

```json
// pakeage.json
"scripts": {
    "dev":"webpack-dev-server --open --history-api-fallback --config webpack.config.js"
}
```

上面的命令中增加了`--history-api-fallback`，所有的路由都会指向index.html

现在已经配置好了路由功能了！然后在根实例中添加路由视图，挂载所有的路由组件

```html
<!-- app.vue -->
<template>
    <div>
        <router-view></router-view>
    <div>
</template>
```

## #跳转

路由组件之间可以互相跳转，有两种形式可以互相跳转：

- 组件形式
- router实例形式

### #组件形式

组件形式很简单，使用`<router-link>`组件就可以完成跳转的动作，他会被渲染成为一个`a`标签，例如从index跳转到about：

```html
<!-- index.vue -->
<template>
    <div>
        <h1>首页</h1>
        <router-link to="/about">跳转到about</router-link>
    </div>
</template>
```

`to`指向的就是要跳转的地址，也可以进行数据绑定，`router-link`还有以下可用属性：

- tag
    指定该组件渲染成为什么标签，模式a标签，例子：`<router-link to="/about" tag="li"></router-link>`
- replace
- active-class
## #高级用法

