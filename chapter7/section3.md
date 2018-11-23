# 第三节 组件通信

在Vue中，组件之间通信有多种情况：

- 父组建 --> 子组件，使用props
- 子组件 --> 父组件，使用$emit
- 组件 <--> 组件
- 跨级组件通信

## 1 自定义事件

前面学习到，一个组件可以有事件，例如点击事件，键盘事件等。

给一个按钮绑定点击事件可以这样写：`<button @click="clickFun"></button>`，那么，绑定一个自定义事件要怎么写呢？很简单，直接在标签中绑定事件名即可，例如在一个组件中声明一个`addNum`事件：`<my-component @addNum="addNum"></my-component>`,这样便可以绑定事件了，完整代码：

```html
<div id="app">
	<my-component @addNum="addNum"></my-component>
</div>
<script type="text/javascript">
	Vue.component("my-component", {
		template:"<div></div>"	
	});
	var app = new Vue({
		el:"#app",
		methods:{
			addNum: function() {
				// 当addNum事件发生时，执行当前函数
			}
		}	
	});
</script>
```

以上代码显而易见，当`my-component`中的`addNum`事件被调用的时候，会调用相关的方法，和绑定一个`click`事件没什么不同，那么，我们该如何触发这个事件呢？答案是使用**$emit**，$emit不仅可以用来触发事件，还可以用来子组件向父组件传递数据。

### $emit

$emit可以把他理解为一个*触发器*，可以在子组件中执行这个触发器，触发父组件的事件。例如，父组件中一个`eventA`事件，在子组件中，可以使用`this.$emit('eventA')`来触发这个事件，同时，该触发器的第二个参数还可以用来传递数据，`this.$emit('eventA',mydata)`。

下面是一个简单的例子：
```html
<div id="app">
	<my-component @eventA="eventA"></my-component>
</div>
<script type="text/javascript">
	Vue.component("my-component",{
		template:"<button @click='btnClick'>click me<button>",
		data:{
			message:"这里是子组件的数据"
		},
		methods:{
			btnClick:function() {
				console.log("按钮被点击");
				this.$emit("eventA", this.message); // 触发父组件的eventA事件，并且传递数据
			}
		}	
	});
	var app = new Vue({
		el:"#app",
		methods:{
			eventA: function(message){
				console.log("eventA事件被触发：传递进来的数据为");
				console.log(message); // 输出“这里是子组件的数据”
			}
		}
	});
</script>
```
## 2 使用`v-model`

父子组件可以进行input事件的绑定，如下所示：

```html
<div id="app">
    <my-component @input="handleInput"></my-component>
</app>
<script>
    Vue.component("my-component", {
        template: "<div @click='handleClick'>子组件信息</div>",
        data: function () {
            return {
                childData: "子组件数据"
            }
        },
        methods: {
            handleClick: function () {
                console.log("子组件的按钮被点击");
                this.$emit("input", this.childData);
            }
        }
    });
    var app = new Vue({
        el: "#app",
        data: {
            parentData: ""
        },
        methods: {
            handleInput: function (childData) {
                console.log("input事件被触发");
                this.parentData = childData;
                console.log(this.parentData); // 输出“子组件数据”
            }
        }
    });
</script>
```

关于input事件，Vue中有语法糖的形式，也就是`v-model`，使用方式如下：
```html
<div id="app">
    <my-component v-model="parentData"></my-component>
</app>
<script>
    Vue.component("my-component", {
        template: "<div @click='handleClick'>子组件信息</div>",
        data: function () {
            return {
                childData: "子组件数据"
            }
        },
        methods: {
            handleClick: function () {
                console.log("子组件的按钮被点击");
                this.$emit("input", this.childData);
            }
        }
    });
    var app = new Vue({
        el: "#app",
        data: {
            parentData: ""
        }
    });
</script>
```
以上的代码中，子组件通过$emit触发了父组件的事件，但是父组件中没有input事件，但是数据仍然可以实时更新，因为v-model是input事件的一种特殊语法糖。这种形式只能是子组件传递的数据引起父组件数据的改变，反之不行，那么我们如何实现数据的双向绑定呢？答案是借助props来实现。

实现一个具有双向绑定的`v-model`组件要有两个要求：
- 接收一个value属性
- 在有新的value的时候触发input事件

根据以上要求，我们书写的代码如下：
```html
<div id="app">
    <h4>总数: {{total}} </h4>
    <my-component v-model="total"></my-component>
    <button @click="handleReduce">-1</button>
</div>
<script>
    Vue.component("my-component",{
       props:["total"],
       template:"<input :value='props' @input='updateValue'></input>",
       methods:{
           updateValue:function(event){
               this.$emit("input", event.target.value);
           }
       }
    });
</script>
```

## 3 非父子组件通信

有一种解决非父子组件通信的方案，可以实现兄弟组件和跨级组件的通信，就是事件总线的方式（bus），该方式通过一个空的Vue实例来传递事件，某个组件触发事件，某个组件捕获事件，简单的使用方式如下：
```html
<div id="app">
    {{message}}
    <my-component></my-component>
</div>
<script>
    var bus = new Vue();
    Vue.component("my-component",{
        template:"<button @click='handleClick'>传递事件</button>",
        methods:{
            handleClick: function(){
                bus.$emit("on-message", "来自组件my-component的内容");
            }
        }
    });

    var app = new Vue({
        el:"#app",
        data:{
            message:""
        },
        mounted:function(){
            var _this = this;
            bus.on("on-message", function(msg) {
                _this.message = msg;
            })
        }
    });
</script>
```

上面的数据传递通过了中间件*事件总线*bus来实现，这种方式很灵活，可以配合data，methods，computed等选项，完成更多的功能，例如协同开发中，用户的各种信息，均可以保存在总线中，在SPA（单页面富应用）中，是很实用的一个功能。

除了总线的方式，通过父链和子组件索引的方式可以实现组件通信

### 父链

在子组件中，可以通过`this.$parent`访问组件的父组件或者父实例，在父组件中，可以通过`this.$children`访问组件的所有子组件，可以通过递归向上或者向下无限访问，直到访问到根实例或者子组件的最内层。

通过`this.$parent`访问父组件数据：
```html
<div id="app">
    {{ message }}
    <my-component></my-component>
</div>
<script>
    Vue.component("my-component",{
        template:"<button @click="handleEvent">通过父链直接修改数据</button>",
        methods:{
            handleEvent: function(){
                console.log("子组件点击事件触发，修改父组件数据");
                this.$parent.message = "来自子组件的数据";
            }
        }
    });
    var app = new Vue({
        el:"#app",
        data:{
            message:""
        }
    });
</script>
```

Vue允许这样的操作，但是在业务中，应该避免这样直接修改父组件的数据，这样使组价耦合度太高了，可能意外情况下修改了父组件数据，引起组件不稳定，所以一般我们只允许组件修改自己的数据。

### 子组件索引

通过`this.$children`的方式可以用来遍历子组件，但是子组件的序列是不固定的，使用这种方式查找子组件是相对繁琐的，于是Vue提供了子组件索引的方式，可以方便的查找子组件，实例代码如下：

```html
<div id="app">
    <button @click="handleRef">通过父组件修改子组件的数据</button>
    <my-component ref="comA"></my-component>
</div>
<script>
    Vue.component("my-component", {
        template:"<div>子组件</div>",
        data:function(){
            return {
                message:"子组件的数据"
            }
        }
    });
    var app = new Vue({
        el:"#app",
        methods:{
            handleRef:function(){
                console.log(this.$refs.comA.message) // 来自子组件的数据;
            }
        }
    });
</script>
```

**`$refs`只有等到组件渲染完成后才填充，而且他不是响应式的，它只作为一个直接访问子组件的应急方案，应当避免在模板或者计算属性汇总直接使用。**

观察一下代码会输出什么
```html
<div id="app">
    <button @click="handleRefs">输出refs</button>
    <p ref="p">内容</p>
    <my-component ref="child"></my-component>
</div>
<script>
    Vue.component("my-component", {
        template:"<div>子组件数据</div>"
    });
    var app = new Vue({
        el:"#app",
        methods:{
            handleRefs: function(){
                console.log(this.$refs.p); // <p>内容</p>
                console.log(this.$refs.child); // 子组件的Vue对象
            }
        }
    });
</script>
```