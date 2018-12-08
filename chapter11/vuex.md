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

已经了解过`mutation`，可以用来触发事件，现在store中声明响应的`mutation`，然后在其他组件中，通过`this.$store.commit('mutationName', value)`，来触发响应的`mutation`，并且传递参数`value`。但是值得注意的是，在`mutation`中，不能执行异步操作，因为如果要使用`mutation`进行异步操作，当修改了state中的值后，我们可能就要使用了，但是使用异步的形式修改，我们在使用的时候，值可能还未修改成功！为了解决这个问题，我们可以通过`actions`来实现。

`actions`也是通过在其他组件中触发，在`actions`的业务逻辑中，要通过触发`mutation`来实现修改数据的操作：

```javascript
// main.js
const state = new Vuex.store({
    state: {
        count: 0
    },
    mutations: {
        increment: (state, n=1) => {
            state.count += n;
        }
    },
    actions: {
        increment: (context) => {
            // 这里是一个action，在这个action中，接收一个上下文对象，
            // 然后通过这个上下文对象context，触发increment的mutation
            context.commit("increment");
        }
    }
});
```

`actions`的触发方式和`mutation`的方式有点不同，`mutation`使用`commit`来触发，而`actions`通过`dispatch`来触发，具体触发方式：

```html
<!-- index.vue -->
<template>
    <div> {{count}} </div>
    <button @click="handleActionIncrenment">action+1</button>
</template>
<script>
    export default {
        computed: {
            count: () => {
                return this.$store.state.count;
            }
        },
        methods: {
            handleActionIncrenment: () => {
                this.$store.dispath('increament');
            }
        }
    }
</script>
```

以上看上去，触发了一个`increament`的`mutation`，在`actions`里面“转了一圈”，看上去好像多此一举，但是`actions`的优势就在于可以进行异步操作，例如通过Ajax获取了数据进行一些处理之后，然后再去触发响应的`mutation`，就可以实现异步的操作。

```javascript
// main.js
const store = new Vuex.store({
    state: {
        count: 0
    },
    mutations: {
        increment: (state, n=1) => {
            state.count += n;
        }
    },
    actions: {
        asyncIncrement: (context) => {
            return new Promise((resolve) => {
                setTimeout(() => {
                    content.commit('increment');
                    resolve();
                }, 1000);
            });
        }
    }
});
```

在其他组件中的使用方式：

```html
<!-- index.vue -->
<template>
    <div>
        {{count}}
    </div>
    <button @click="handleAysncIncreament">aysnc +1</button>
</template>
<script>
    export default {
        computed: {
            count: () => {
                return this.$store.state.count;
            }
        },
        methods: {
            handleAysncIncreament: () => {
                this.$store.dispatch('asyncIncrement').then(() => {
                    // 异步操作完成之后执行的函数
                    console.log(this.$store.state.count); // 1
                });
            }
        }
    }
</script>
```

### #modules

当你的项目足够大的时候，会有很多的state,getters,mutations,actions, 全都放在一个文件中，不容易维护和阅读，所以我么可以把他们写到不同的文件中，每个文件是一个module，每个module有自己的state，getters，mutations和actions，而且可以多层嵌套。例如下面的示例，我们声明两个module

```javascript

const moduleA = {
    state: {},
    mutations: {},
    actions: {},
    getters: {}
}

const moduleB = {
    state: {},
    mutations: {},
    actions: {},
    getters: {}
}

const store = new Vuex.store({
    modules: {
        a: moduleA,
        b: moduleB
    }
});
```

那么之前没有用modules的时候，我们在其他组件中可以通过`store.state`来获取state的值，那么在使用modules之后，我们可以通过`store.state.a`和`store.state.b`来分别获取两个模块中的state的数据。

在module的mutations和getter中可以接收几个参数，第一个参数是我们之前使用的`state`，第二个参数是依赖的**其他**`state`，第三个参数就是`rootState`，用于访问根节点的状态！例如：

```javascript
const moduleA = {
    state: {
        count: 0
    },
    getters: {
        sumCount: (state, getters, rootState) => {
            //  rootState.count 就是根节点中state下面的count！
            return state.count + rootState.count;
        }
    }
}
```