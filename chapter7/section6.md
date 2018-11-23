# 第六节 其他

## 1 $nextTick

在业务中，我们可能要计算一个容器的高度，从而对该容器进行一些操作，但是，操作Vue组件的一些数据，可能会引起该容器内的元素发生变化，容器的大小也会发生改变，或者使用`v-if``v-show`导致容器不渲染，这种情况下，获取容器的大小获取不到或者数据不准确，那么，这种情况下，要如何获取准确的容器大小呢？

Vue观察到数据变化的时候，不会直接去更新DOM，而是开启一个更新队列，并且缓冲*同一个事件循环*中所有数据的改变，除去重复数据，避免重复的DOM操作，然后将数据改变重新渲染DOM，呈现视图，`$nextTick`就是来知道什么时候，下一次视图更新完成的！在使用这个功能的时候，开发人员一定要去判断这个事件循环是否只有一次，要判断最后一次视图更新。

了解了`$nextTick`之后，就可以解决我们刚才提出的问题了，当所有的数据改变完成后，视图更新完成之后，再去计算就可以了，代码如下：

```javascript
this.$nextTick(function(){
	// 计算逻辑	
});
```

## 2 X-Template

声明一个组件的时候，书写模板都是在`template`中，组件逻辑复杂，维护起来真的很不方便，于是Vue提出了`X-Template`，可以直接在html文件中书写模板，但是，尽量不要使用这种方式，示例代码如下：

```html
<div id="app">
	<my-component></my-component>
	<script type="text/x-template" id="my-component">
		<div>
			这里是模板的内容
		</div>
	</script>
</div>
<script type="text/javascript">
	Vue.component("my-component",{
		template:"#my-componwent"	
	});
	var app = new Vue({
		el:"#app"
	});
</script>
```
## 手动挂载实例

我们现在创建的实例，都是使用`new Vue()`语法来创建出来，并且挂载到相应的元素上，Vue允许我们先创建实例，然后再手动的挂载，可以使用`Vue.extend`创建一个实例，使用`$mount()`手动挂载实例，这个方法返回实例本身，所以我们可以链式调用。示例代码：

```html
<div id=app>
<div>
<script>
	var AppCom = Vue.extend({
		template:"<p>hello {{name}}</p>",
		data:function(){
			return {
				name:"lintao"
			}
		}
	});

	new AppCom().$mount("#app"); // 手动挂载
</script>
```

另外，使用另外两种方式手动挂载也可以：

```javascript
// 第一种
new AppCom({
	el:"#app"
});

// 在文档之外渲染并且随后加载
var App = new AppCom().$mount(); // 渲染
document.gelElementById("app").appendChild(App.$sel); // 渲染已经完成，响应的DOM元素已经存在，使用该语法将元素追加到指定元素中，实现加载的功能。
```