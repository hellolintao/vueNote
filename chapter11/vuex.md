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
```
## #高级用法

