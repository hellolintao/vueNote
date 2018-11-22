# 第二章

## 2.1 Vue实例与数据绑定
### 2.1.1 实例与数据
#### 如何挂载一个Vue实例

例如有一个html片段：

```html
<div id="app">
</div>
```

使用下面的语句即可以将Vue实例挂载到该元素上

```javascript
var app = new Vue({
	el:"#app"
});
```

其中，**el**是必不可少的一个选项，它表示该实例挂载到哪个元素上，可以使用CSS选择器，也可以使用`document.getElementById('app')`来挂载实例。

我们可以使用`app.$el`来访问该元素。

可是像下面一样vue中的数据

```javascript
var app = new Vue({
	el:"#app",
	data:{
		a:1
	}
});
```

也可以指向一个已有的变量，例如：

```javascript
var myData = {
	a:1
}
var app = new Vue({
	el:"#app",
	data:myData
});
```

在上面，我通过`myData.a`或者`app.a`都可以访问到`a`，原理上访问的是同一个内存中的地址，所以，使用一种方式访问这个值并修改，另外一个值也会跟着变化。

#### 一些思考

	- 在挂载Vue实例的时候，推荐使用CSS选择器，更加直观高校
	- 在当前学习阶段，不知道Vue赋予数据时，何种情况下应该指向外部已经存在变量，指向外部已经存在的变量，势必会有不小心修改数据的风险，有待后面补充与思考

### 2.1.2 生命周期

生命周期是vue实例从创建到销毁，存在的一些周期，比较常用的有：

- `create` 实例创建完成后直接调用，也就是数据已经就绪，但是还未挂载到实例上，`$el`不可用，需要初始化数据的时候会使用
- `mounted` el挂载到实例后调用此方法，一般第一个业务逻辑通常在这里
- `beforeDestroy` 实例销毁之后调用，主要解绑一些事件监听器

以上这些函数可以成为**钩子**，在这些函数中，可以使用`this`，指向调用它的实例。书写方式如下

```javascript
var app = new Vue({
    el:"#app",
    data:{
        a:1
    },
    create: function() {
        console.log("这里是创建完成");
    },
    mounted: function() {
        console.log("这里是实例加载完成");
        console.log(app.a); // 1
    }
});
```

### 2.1.3 插值表达式

Vue中的文本插值类似于模板语法，类似于[Liquid](https://liquid.bootcss.com/),应该掌握该模板语法，因为很多项目都采用了这个语法，例如**jekyll**

在Vue中，文本插值一般在html标签中，使用``来进行文本插值的操作，例如下面最基础的用法

```html
<div id="add">
	{{ title }}
</div>
<script>
var app = new Vue({
	el:"#app",
	data:{
		title:"《唐诗三百首》"
	}
});
</script>
```

上面的`{{ title }}`中的`title`会被替换为《唐诗三百首》，这里的`title`会被渲染成纯文本
如果我想展示html，而不是解析之后的纯文本，那么我们可以使用`v-html`指令来完成，例如:

```html
<div id="add">
	<span v-html="link"></span>
</div>
<script>
var app = new Vue({
	el:"#app",
	data:{
		link:"<a href='www.baidu.com'>一个链接</a>"
	}
});
</script>
```

上面的`link`被渲染完成后，将被渲染成为一个可以被点击的a标签,使用该指令要预防**XSS**攻击，一般讲将`<>`转义处理。
如果要显示`{{}}`标签，而不是用作文本插值符号，那么可以使用`v-pre`指令来完成该操作，例如：

```
<span v-pre> {{ 这里的内容是不会被编译的 }} </span>
```

在`{{}}`中可以书写js语句，进行简单的计算，例如三元运算，取整，数组排序等

### 2.1.4 过滤器

在文本插值中，我们可以对文本插值进行过滤，自定义过滤器过滤数据，并且多个过滤器可以串联，过滤器主要使用管道符`|`来实现。例如我们设计一个页面，页面将字符转成大写字母显示，可以像下面这样操作:

```html
<div id="app">
    {{ title | toUp}}
</div>
<script src="../../../src/vue.min.js"></script>
<script>
    var app = new Vue({
        el:"#app",
        data:{
            title:"hello world"
        },
        filters: {
            toUp: function(val) {
                return val.toUpperCase();
            }
        }
    });
</script>
```

另外，过滤器是可以接受参数的,例如`{{ title | toUp('arg1')}}`,其中，`arg1`将被作为第二个参数传递给过滤器函数，因为第一个参数是数据本身。
同时，过滤器是可以串联的，力图`{{ title | filA | filB }}`, 数据被`filA`处理过之后，被`filB`处理，最后插值渲染被`filB`处理过后的值。

**提示** 过滤器应当作为一些简单的文本处理，大型的属性计算应该使用*计算属性*


## 2.2 指令与事件

Vue中很多指令，这些指令都是以`v-`开头，并且常用指令提供了*语法糖*，之前接触过的指令与常用德指令如下

- v-html
- v-pre
- v-if 判断指令
- v-for 循环指令
- v-bind 属性绑定指令，例如绑定`img`标签中的`src`属性可以这样写`<img v-bind:src="imgUrl">`，其中的`imgUrl`是相应的Vue实例中的数据，相应的语法糖形式为一个冒号，例如`<img :src="imgUrl">`
- v-on 事件绑定指令，例如绑定一个按钮的点击事件为`<button v-on:click="btnClick"></button>`，其中的`btnClick`为相应的Vue实例中的一个方法，在`methods`中指定，并且可以传递参数，点击事件默认的参数是`event`,为避免出错，一般默认传递第一个参数为`$event`, 然后在传递其他参数，例如：`<button v-on:click="btnClick($event, '第二个参数')"></button>`，同时，该指令的语法糖为一个`@`符号，例如：`<button @click="btnClick"></button>`

