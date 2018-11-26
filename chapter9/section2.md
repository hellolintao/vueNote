# 第二节 createElement用法

## 基本参数

createElement构成了Vue Virtual Dom的模板，他有三个参数，如下所示：

```javascript
createElement(
	"div", // 必输参数，可以是一个html标签，也可以是一个组件，可以是一个函数
	{
		// 可选参数，是一个数据对象，在template中使用
	},
	[
		// 可选参数，子节点
	]
)
```

关于第二个参数数据对象，具体的选项如下：
```javascript
{
	class:{ // 模板中的v-bind:class
		foo:true,
		bar:false
	},
	style:{ // 模板中的v-bind:style
		color:"red",
		fontSize:"14px"
	},
	attrs:{ // 正常的html属性
		id:"foo"
	},
	props:{ // 组件props
		myProps:"bar"
	},
	domProps:{ // DOM属性
		innerHtml:"baz"
	},
	on:{ // 事件监听，不支持修饰器，需要手动匹配keyCode
		click: this.nativeClickHandler
	},
	directives:[ // 自定义指令
		{
			name:"my-driective",
			value:"2",
			express:"1+1",
			arg:"foo",
			modifiers:{
				bar:true
			}
		}
	],
	scopedSlots:{ // 作用域slot {name:props => VNode | Array<VNode>}
		default: props => h("span", props.text)
	},
	slot:"name-of-slot", // 如果子组件有定义slot名称
	key:"myKey",// 其他顶层属性
	ref:"myRed"

}
```

下面这是一段传统的组件书写方式：

```html
<div id="app">
	<ele><ele>
</div>
<script>
Vue.component("ele", {
	template:`<div id="element" :class="{show: show}" @click="handleClick">文本内容</div>`,
	data:function(){
		return {
			show: true
		}
	},
	methods:{
		handleClick: function(){
			console.log("clicked!");
		}
	}
});

var app = new Vue({
	el:"#app"
});
</script>
```

我们使用`Render`函数改写如下：

```html
<div id="app">
	<ele><ele>
</div>
<script>
	Vue.component("ele",{
		render:function(createElement){
			return createElement(
				"div",{
					class:{
						"show":this.show
					},
					attrs:{
						id:"element"
					},
					on:{
						click: this.handleClick
					}
				}
			);
		},
		data:function(){
			return {
				show: true
			}
		},
		methods:{
			handleClick: function(){
				console.log("clicked!");
			}
		}
	});
	var app = new Vue({
		el:"#app"
	});
</script>
```

说白了，`Render`函数就是使用js来描述html模板的，但是相比之下，使用模板的方式，可读性更高，也更利于维护，所以使用`Render`函数要考虑好使用环境。

## 约束

**所有的组件中，如果`VNode`是组件或含有组件的`slot`，那么`VNode`必须是唯一的**

错误案例一：重复使用组件

```html
<div id="app">
	<ele><ele>
</div>
<script>
	var child = {
		render: function(createElement) {
			return createElement("p", "text");
		}
	}
	Vue.component("ele",{
		render:function(createElement) {
			var ChildNode = createElement(child);
			return createElement("div",[
				ChildNode,
				childNode
			]);
		}
	});
	var app = new Vue({
		el:"#app"
	});
</script>
```

以上代码中，重复使用了`childNode`，属于重复使用组件，是错误的做法。

错误案例二：重复使用含有组件的`slot`

```html
<div id="app">
	<ele>
		<div>
			<Child></Child>
		</div>
	<ele>
</div>
<script>
	Vue.component("child", {
		render:function(createElement) {
			return createElement("p", "text");
		}
	});
	Vue.component("ele", {
		render: function(createElement) {
			return createElement("div",[
				this.$slots.default,
				this.$slots.default
			]);
		}
	});
	var app = new Vue({
		el:"#app"
	});
</script>
```

以上代码中，使用了两次该组件的`this.$slots.default`，其实也相当于变相的调用了两次`Child`组件，也会导致错误。

如果有多次使用同一个组件的场景，可以借助循环来实现：

```javascript
Vue.component("ele",{
		render:function(createElement) {
			var ChildNode = createElement(child);
			return createElement("div",
				Array.apply(null, {
					length:5
				}).map(function(){
					return createElement(Child);
				});
			);
		}
	});
```

对于重复使用`slot`的场景，可以使用深度克隆slot的方式，但是业务逻辑中很少用到，略过，详细可参考书籍第*147*页


## 使用Javascript代替模板功能

在模板中，我么使用到`v-if`和`v-for`等命令，在`Render`函数中，我们可以通过`if-else`和`for`循环等来实现这些功能即可，事件监听写到`on`里面即可。

因为`Render`函数中不支持事件修饰符，我们可以自己实现，可以通过下表来进行快捷操作：

修饰符 | 对应的句柄
------- | -------
.stop | event.stopPropagation();
.prevent | event.preventDefault();
.self | if(event.target !== event.currentTarget) return;
.enter/.13 | if(event.keyCode !== 13) return;
.ctrl .alt .shift .meta | if(event.ctrlKey) return; // 更换ctrlKey即可

对于`.capture`（使用事件捕获方式）和`.once`， Vue提供了特殊前缀：

修饰符 | 前缀
----- | -----
.capture | !
.once | ~
.capture.once 或 .once.capture | ~!

写法如下：
```javascript
on:{
	"!click": this.clickHandle
}
```

`slot`会在render函数中大量使用，但是没有使用slot的时候，页面会显示一个默认的内容，这个地方的逻辑需要自己实现：

```html
<div id="app">
	<ele></ele>
	<ele>
		<p>slot内容</p>
	</ele>
</div>

<script>
Vue.component("ele", {
	render: function(createElement){
		if(this.$slots.default === undefined) {
			return createElement("div","没有使用slot时显示的文本");
		} else {
			return createElement("div", this.$slots.default);
		}
	}
});
</script>
```