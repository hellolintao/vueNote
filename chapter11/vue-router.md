
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
	使用replace不会留下History记录，所以导航后不能用返回键返回到上一个页面，例如：`<router-link to="/about" replace></router-link>`

- active-class
	当路由跳转成功的时候，会给绑定路由点击的元素一个class，默认是`router-lin-active`，当然，也可以自定义：`<router-link to="/about" tag="li" active-class="myclass"></router-link>`，但是一般情况下，使用默认的class就好了

### #router实例形式

有的时候，需要通过js来完成跳转页面，类似于`window.location.href`，这时可以使用router实例的形式：

```html
// about.vue
<template>
	<div>
		<h1>介绍页</h1>
		<button @click="handleClick">跳转到user</button>
	</div>
</template>
<script>
	export default {
		methods: {
			handleClick: () => {
				this.$router.push("/user/123");
			}
		}
	}
</script>
```

`$router`还有2个常用方法

- replace 类似于组件中的relpace，效果也一样，`this.$router.replace("/user/123")`

- go 类似于`window.history.go()`，可以指定前进或者后退的步数，例如前进一页：`this.$router.go(1)`，后退两页：`this.$router.go(-2)`

## #高级用法

vue-router提供了两个钩子函数，`beforeEach`和`afterEach`，分别会在路由即将改变之前和改变之后触发，我们可以利用这两个钩子函数完成一系列的操作。

当路由改变的时候，页面的标题也要改变，但是SPA只有一个title标签，可以在每个路由组件中去改变title标签中的内容，但是效率低下，每个文件都要写这个代码，所以维护起来也麻烦，这个时候可以借助`befroeEach`来完成这个操作：

```javascript
// main.js
const router = new VueRouter(RouterConfig);
router.beforeEach((to, from, next) => {
	window.document.title = to.meta.title;
	next();	
});
```

上面的钩子函数有三个参数：

- to: 即将进入的目标的路由对象

- from: 当前导航即将要离开的路由对象

- next: 调用该方法后，才能进入下一个钩子

还有一种业务场景就是，一个页面很长，我在浏览这个页面中间的部分的时候，跳转到了另外一个页面，这个时候，另外一个页面也出于中间的部分，用户体验不好，这个时候，可以通过`afterEach`钩子来满足这个需求：跳转到新页面之后，将页面滚动到最上面

```javascript
// main.js
router.afterEach((to, from, next) => {
	window.scrollTo(0, 0);
})
```

参数和上一个钩子函数一样，不做解释。

另外，next()函数可以传参的，传递某个路由地址可以跳转到相应的页面，传递false，可以取消导航，利用这一点，我们可以执行某些操作，例如验证登陆的操作：

```javascript
// main.js
const router = new VueRouter(RouterConfig);
router.beforeEach((to, from, next) => {
	window.document.title = to.meta.title;
	if (window.localStorage.getItem('token')) {
		next();
	} else {
		next("/login");
	}
});
```

上述代码是，如果用户未登录，那么跳转到登陆页
