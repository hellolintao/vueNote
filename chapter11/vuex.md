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
- actions: 类似于事件触发器，但是支持异步操作
- getter：数据获取
- modules: store的模块，可以引入其他文件，可用于将配置拆分

### #state

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
<!-- index.vue -->
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

### #mutations

<!-- 在bus中，组件之间互相出发事件，一般都是A组件将事件提交到bus中，`bus.$emit('customEvent', data)`，然后在其他组件中监听该事件，`bus.$on('customEvent', (data) => {})`，这样进行一个跨组件的事件，store中的第二个选项`mutations`的作用类似于上面这个需求。 -->
store中的第二个选项`mutations`的作用简单来说，就是来操作`state`中的值的！

下面我们先在配置文件中完善`mutations`， 增加`count`增加和减少的功能，并且可以根据参数来增加或者减少

```javascript
// main.js
const store = new Vuex.store({
    state: {
        count: 0
    },
    mutations: {
        increment: (state, n=1) => { // 增加函数
            state.count += n;
        },
        decrement: (state, n=1) => { // 减少函数
            state.count -= n;
        }
    }
});
```

在组件中，我们可以使用`this.$store.commit`的形式来触发某一个`mutation`，下面在`index.vue`中增加两个按钮，分别触发`increment`和`decrement`。

```html
<!-- index.vue -->
<template>
    <h1>首页</h1>
    {{ count }}
    <button @click="handleIncrement">+5<button>
    <button @click="handleDecrement">-4<button>
</template>
<script>
    export default {
        computed: {
            count: ()=> {
                // 访问vuex中的count
                return this.$store.state.count;
            }
        },
        methods: {
            handleIncrement: () => {
                // 触发增加事件
                this.$store.commit("increment", 5);
            },
            handleDecrement: () => {
                // 触发减少事件
                this.$store.commit("decrement", 4);
            }
        }
    }
</script>
```

## #高级用法

### #getter

在之前的vuex配置中，我们声明了`count`，在其他组件中，我们可以使用`this.$store.state.count`来获取这个值，将会获取某个数值，如果这个值代表的是**商品总数**，我们希望返回的是**一共有商品count件**，可以通过`getter`来实现这个需求，这样在所有用到这个state的组件中，都会得到**一共有商品count件**，避免每个组件单独去处理这个数据，实现方式如下：

```javascript
// main.js
const store = new Vuex.store({
    state: {
        count: 0
    },
    getters: {
        getCount: (state) => {
            return `一共有商品${state.count}件`;
        }
    }
});
```

在其他组件中使用getter

```html
<template>
    <div>
        <div> {{count}} </div>
    </div>
</template>
<script>
    export default {
        computed: {
            count: () => {
                return this.$store.getters.getCount;
            }
        }
    }
</script>
```

这种形式类似于计算属性，只不过计算过程放在了store中，另外，getter可以依赖其他的getter，可以把getter作为第二个参数，例如，我们假设每个商品10块钱，实现一个getter来获取商品的总价格：

```javascript
// main.js
const store = new Vuex.store({
    state: {
        count:0
    },
    getters: {
        getCount: (state) => {
            return `一共有商品${state.count}件`;
        },
        getPrice: (state, getters) => {
            return `${getters.getCount}，一共${state.count*10}元`;
        }
    }
});
```

在其他组件中使用：`this.$store.getters.getPrice`，将返回`一共有商品n件，一共w元`。

### #actions

已经了解过`mutation`，可以用来触发事件，现在store中声明响应的`mutation`，然后在其他组件中，通过`this.$store.commit('mutationName', value)`，来触发响应的`mutation`，并且传递参数`value`。