# 第四节 slot内容分发

## 1 什么是solt

想让组件混合使用，混合父组件的内容与子组件的模板，会用到solt，这个过程叫做内容分发。

props传递数据，events触发事件和solt内容分发构成了Vue组件的3个API来源，再复杂的组件也是由这三部分构成的。

## 2 作用域

以下代码：

```html
<my-component v-show="isShow">
    {{message}}
</my-comonent>
```

其中，`message`和`isShow`都是父组件中的数据，如果要现实子组件中的`message`
和`isShow`，应该这样写：

```html
<my-component></my-comonent>
<script>
    Vue.component("my-component",{
        template:"<div v-show='isShow'> {{message}} </div>",
        data:function(){
            return {
                isShow:true
            }
        }
    });
</script>
```

以上就是作用域的不同，第一段代码在编译的时候，是在父组件的作用域内编译，第二段则是在子组件内编译。

`slot`作用域在父组件上。

## 3 slot用法

### 单个slot

在子组件中，可以使用`<slot>`标签开启一个插槽，在父组件模板中，所有的内容都会代替子组件`<slot>`标签中的内容。举个栗子：
```html
<div id="app">
    <my-component>
        <p>分发内容一</p>
        <p>分发内容二</p>
    </my-component>
</div>
<script>
    var app = new Vue({
        el:"#app"
    });
    Vue.component("my-component",{
        template:`<div> <slot><p>如果没有元素被插入，那么我就会出现</p></slot> </div>`
    });
</script>
```
以上代码渲染结果为:
```html
<div>
<p>分发内容一</p>
<p>分发内容二</p>
<div>
```

### 具名slot

所谓具名，则是在`<slot name='slotA'>`标签上，声明`name`属性，在父组件进行分发的时候，声明元素指向的`slot`，例如`<p slot='slotA'>分发到slotA上的元素</p>`

具名使用方式和单个使用方式差不多，当单个使用slot的时候，所有“不具名”的元素将被渲染在这里，具名的元素渲染到对应的位置上。
```html
<div id="app">
    <my-component>
        <div slot="slotA">
            内容分发A
        </div>
        <p>分发内容一</p>
        <p>分发内容二</p>
        <div slot="slotB">
            内容分发B
        </div>
    </my-component>
</div>
<script>
var app = new Vue({
    el:"#app"
});
vue.component("my-component", {
    template:`<div><slot name='slotA'></slot><slot></slot><slot name='slotB'></slot></div>`
});
</script>
```

以上代码渲染结果为：

```html
<div>
<div>
    内容分发A
</div>
<p>分发内容一</p>
<p>分发内容二</p>
<div>
    内容分发B
</div>
</div>
```

## 4 作用域插槽

作用域插槽说白了，就是把子组件的数据通过`slot`传递个父组件，由一个临时变量来保存，在父组件进行渲染时，使用该数据，描述起来比较难懂，看一个简单的例子就知道了：
```html
<div id="app">
    <my-component>
        <template scope="props">
            <p>来自父组件的数据</p>
            <p>{{props.message}}</p>
        </template>
    </my-component>
</div>
<script type="text/javascript">
    var app = new vue({
        el:"#app"    
    });
    Vue.component("my-component",{
        template:"<div><slot message='来自子组件的数据'><slot></div>"    
    });
</script>
```

以上代码的渲染结果为：

```html
<div>
    <p>来自父组件的数据</p>
    <p>来自子组件的数据</p>
</div>
```

从字面的意思来理解作用域插槽，就是把子组件的变量传递到父组件的作用域中，方便父组件中使用子组件的数据。

## 5 访问slot

访问slot类似于访问父组件或者访问子组件，Vue会提供一个变量`$slot`来访问slot，如下代码：
```html
<div id="app">
    <my-component>
        <div slot="slotA">
            内容分发A
        </div>
        <p>分发内容一</p>
        <p>分发内容二</p>
        <div slot="slotB">
            内容分发B
        </div>
    </my-component>
</div>
<script>
var app = new Vue({
    el:"#app"
});
vue.component("my-component", {
    template:`<div><slot name='slotA'></slot><slot></slot><slot name='slotB'></slot></div>`,
    mounted:function() {
        var slotA = this.$slot.slotA;
        var slotB = this.$slot.slotB;
        var slots = this.$slots.default; // 未具名的slot都会在这个里面，是一个数组
    }
});
</script>
```

值得注意的是，访问slot是在子组件中！另外，在业务中，很少会用到这个功能，但是在render函数中，创建组件的时候会用到这个功能。