# 第四章

## 4.1 了解`v-bind`指令
`v-bind`就是用来绑定html标签中的属性，语法糖形式是一个`:`，例如绑定`img`标签中的`src`属性，`a`标签中的`href`属性。

```html
<img :src="src"/>
<a :href="href"> 这里是一个超链接 </a>
```

## 4.2 绑定`class`的几种方式

- 对象语法

```html
<div id="app">
    <div class="static" :class="{ 'error':isError, 'active': isActive }"></div>
</div>
<script src="../src/vue.min.js"></script>
<script>
    var app = new Vue({
        el:"#app",
        data:{
            isError:true,
            isActive:false
        }
    });
</script>
```

上面的div将会被渲染为`<div class="static error"></div>`, 属性绑定的`class`也可以与普通的`class`共存，除此之外，使用对象语法也可以调用计算属性。例如：

```html
<div id="app">
    <div :class="classes"></div>
</div>
<script src="../src/vue.min.js"></script>
<script>
    var app = new Vue({
        el:"#app",
        data:{
            isError:true,
            isActive:false,
            isWarn:true
        },
        computed:{
            classes: function () {
                return {
                    static:true,
                    active: this.isActive,
                    "warn": this.isWarn 
                }
            }
        }
    });
</script>

```

上面的div将会被渲染为`<div class="static warn"></div>`
- 数组语法

```html
<div id="app">
    <div class="static" :class="[{'active':isActive}, activeCLs, isWarn ? 'warn' : '']"></div>
</div>
<script src="../src/vue.min.js"></script>
<script>
    var app = new Vue({
        el:"#app",
        data:{
            isActive:true,
            activeCLs:"activeCLs",
            errorClas:"error",
            isWarn:true
        }
    });
</script>
```

以上将会渲染为`<div class="static active activeCLs warn"></div>`,同时，数组形式也可以使用计算属性，如下：

```html
<div id="app">
    <button :class="classes">btn</button>
</div>
<script src="../src/vue.min.js"></script>
<script>
    var app = new Vue({
        el:"#app",
        data:{
            size:'large',
            disabled:true
        },
        computed:{
            classes: function () {
                return [
                    'btn',
                    {
                        ['btn-' + this.size]: this.size !== '',
                        ['btn-disabled']: this.disabled
                    }
                ];
            }
        }
    });
</script>
```

以上将会渲染为`<button class="btn btn-large btn-disabled">btn</button>`

- 在组件上使用

在组件中，我们也可以使用上面的方式绑定class，首先声明一个组件，然后就可以使用上面的方式对class进行绑定。

```html
<div id="app">
    <my-component :class="[active]"></my-component>
</div>
<script src="../src/vue.min.js"></script>
<script>
    Vue.component("my-component", {
        template:"<p class='article'></p>"
    });
    var app = new Vue({
        el:"#app",
        data:{
            active:'active'
        }
    });
</script>
```

但是使用这种方式绑定class，该自定义组件必须是一个最外层的根元素，当不满足该条件是，应当借助props来实现（后面的内容）

## 4.3 绑定内联样式

绑定内联样式可以使用对象语法：`<div :style="{'color':color, 'fontSize':fontsize + 'px'}"></div>`，也可以使用数组语法`<div :style="[styleA, styleB]"></div>`，同时，这两种方式都支持计算属性的形式，一般常用的方式也是**计算属性**当使用内联样式的时候，vue会自动的添加前缀。在使用对象语法时，CSS属性使用*驼峰式*命名方式，也可以使用*短横线*的命名方式，但是如果使用计算属性，则必须采用*驼峰式*命名方式。