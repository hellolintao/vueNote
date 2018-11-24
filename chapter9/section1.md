# 第一节 基础

## 什么是Virtual Dom

React和Vue都使用了Virtual Dom，在Vue中，我们把组件的模板数据写到了template中，但是Vue在解析的时候，还是解析成为了Virtual Dom，Virtual Dom真正意义上不是一个真正的DOM，而是一个轻量级的js对象，当状态发生变化的时候，Virtual Dom会进行Diff运算，来更新只需要替换的DOM，而不是全部重新渲染，大大的提高了性能。

使用Virtual Dom创建的JavaScript对象一般会是这样的：

```javascript
var vNode = {
	tag:"div",
	attribute:{
		id:"main"
	},
	children:[
		// 子节点
	]
}
```

以上代码中的vNode使用一些特定的选项描述了真实的DOM结构。

在Vue中，Virtual Dom就是使用vNode这种形式表达的，vNode类中有丰富的属性来描述Virtual Dom，vNode主要可以分为如下几类：

- TextNode 文本节点
- ElementVNode 普通元素节点
- ComponentVNode 组件节点
- EmptyVNode 空的注释节点
- CloneVNode 克隆节点，和其他节点是一样的，区别在于`isCloned`属性为true

在大多数的场景中，我们使用template就够了，但是一些特定的场景下，使用Virtual Dom会更简单。

## 什么是Render函数

Render函数就是使用函数来生成DOM结构的，而不采用template的形式，例如下面这段代码
```html
<div id="app">
	<author :level="2" title="特性">特性</author>
</div>
<script type="text/javascript">
	Vue.component("author",{
		props:{
			level:{
				type:Number,
				require:true
			},
			title:{
				type:String,
				default:" "
			}
		},
		render: function(creatElement){
			return creatElement(
				"h"+this.level,
				[
					creatElement(
						"a",{
							domProps:{
								href:"#"+this.title
							},
							this.$slots.default
						}
					)
				]
			);
		}	
	});
	var app = new Vue({
		el:"#app"	
	});
</script>
```

上面的代码渲染结果为：999
```html
<div id="app">
	<h2><a href="#特性">特性</a></h2>
</div>

```

`createElement`构成了Virtual Dom的模板，是Render中重要的功能，下面我们着重学习使用`createElement`函数