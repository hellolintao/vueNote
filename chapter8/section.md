# 第八章 自定义指令

声明一个指令，和声明一个组件差不多，可以全局声明，也可以局部声明。

- 全局注册

```javascript
Vue.directive("focus",{
	// 指令选项
});
```

- 局部注册

```javascript
var app = new Vue({
	el:"#app",
	directives:{
		foces:{
			// 指令选项
		}
	}	
});
```

自定义指令中的选项，是由钩子函数组成的，每个钩子函数都是可选的，可选的钩子函数如下

- `bind` 只调用一次，指令第一次绑定到这个元素时调用，用这个函数可以定义一个在绑定时执行一次的初始化动作
- `inserted`  被绑定元素插入父节点时调用，父节点存在即可调用，不一定要存在于document中
- `update` 被绑定的元素在模板更新的时候调用，而不论绑定值是否变化，通过比较更新前后的绑定值，可以忽略不必要的模板更新
- `componentUpdated` 被绑定元素素在模板完成一次更新周期时调用
- `unbind` 只调用一次，指令与元素解绑时调用

实现一个`focus`指令，实现元素插入父节点时候，聚焦的功能，可以这样写：

```html
<div id="app">
	<input type="text" v-focus>
</div>
<script type="text/javascript">
	Vue.directive("focus",{
		inserted: function(el) {
			el.focus();
		}	
	})
	var app = new Vue({
		el:"#app"	
	});
</script>
```

如上段代码，我们使用到了`el`，这个参数代表指令所绑定的元素，可以直接用来操作DOM，另外，钩子函数的可选参数如下：

- `el` 指令绑定的元素，可以直接操作dom
- `binding` 一个对象，包含以下属性：
	 1. `name` 指令的名字，不包含v-前缀
	 2. `value` 指令的绑定值，例如`v-my-directive="1+1"`, `value`的值是2
	 3. `oldValue` 在`update`和`componentUpdated`时，会涉及到值得更新，这个属性是用来访问指令绑定的前一个值，不论值知否改变都可以访问
	 4. `expression` 绑定值得字符串形式，例如`v-my-directive="1+1"`，`expression`的值是“1+1”
	 5. `arg` 传给指令的参数，例如`v-my-directive:foo`, `arg`的值是`foo`
	 6. `modifiers` 一个包含修饰符的对象，例如`v-my-directive.foo.bar`，修饰符对象的值是`{foo:true,bar:true}`
- `vnode` Vue编译生成的虚拟节点
- `oldValue` 上一个虚拟节点，仅在`update`和`componentUpdated`中可用

在大多数的场景下，我们会在`bind`中使用document的`addEventListener`绑定一些事件，在`unbind`事件中使用`removeEventListener`解绑