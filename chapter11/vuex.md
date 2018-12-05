# 第二节 状态管理与Vuex

## #状态管理与Vuex

在之前的章节中，我们进行非父子组件沟通的时候，采用的是中央事件总线的形式(bus)来进行的，可以触发事件和交换数据，Vuex是一个插件，他的作用和bus类似，但是Vuex更加的高效。

## #Vuex基本用法

首先，安装Vuex插件：

```shell
npm install --save vuex
```

然后，打开入口js文件（main.js），通过`Vue.use()`使用Vuex

```javascript
import Vue from "vue";
import VueRouter  from "vue-router";
import Vuex from "vuex";
import App from "./app.vue";

Vue.use(VueRouter);
Vue.use(Vuex);

// 忽略路由配置

const store = new Vuex.store({
    // vuex的配置
});

new Vue({
    el:"#app",
    router: router,
    store:store, // 这个就是vuex！！
    render: (h) => {
        return h(App);
    }
});
```

`store`中的数据是通用的，任何组件使用store都会引起数据和视图的更新。

Vuex的配置在`new Vuex.store({})`中书写，其中，配置文件提供了四个选项：

- state: 数据
- mutations: 事件触发器
- getter：数据获取
- modules: store的模块，可以引入其他文件，可用于将配置拆分

`state`设置了值之后，任何组件都可以通过`$store.state.***`来获取设置的值，例如在`index.vue`内：

```javascript
// main.js
// 先补充一下vuex的配置
const store = new Vuex.store({
    state: {
        count: 0
    }
});
```

```html
<template>
    <h1>首页</h1>
    {{ count }}
</template>
<script>
    export default {
        computed: {
            count: ()=> {
                // 访问vuex中的count
                return this.$store.state.count;
            }
        }
    }
</script>
```
## #高级用法

