# 第三章

## 3.1 什么是计算属性

在文本插值中，我们可以直接输出一个属性，也可以在文本插值中书写简单的表达式来计算应该输出的属性，或者使用过滤器来处理文本插值，但是，代码量越来越大，过多的表达式会导致代码越来越臃肿，可读性不高，于是，提出了计算属性的概念，可以清晰的处理一些复杂属性，代码可维护性也很高。

计算属性一般是直接在`{{}}`中写一个函数的名字，该函数位于相应的实例中的`computed`属性中，函数的返回值将被渲染成文本插值的结果。例如：

```html
<div id="app">
	{{ reversedText }}
</div>
<script>
	var app = new Vue({
	    el:"#app",
	    data:{
	        text:"hello, world"
	    },
	    computed:{
	    	reversedText: function() {
	    		return this.text.split(",").reverse().join(",");
	    	}
	    }
	});
</script>
``` 

一个思考？ 上面的功能实际上在`{{}}`中调用一个函数也可以实现，为什么要使用计算属性呢？？

## 3.2 计算属性的用法
计算属性可以完成各种各样复杂的操作，可以进行运算，调用其他函数等，只要最后返回一个值就可以，计算属性还可以依赖多个Vue实例的属性，其中任何一个值发生改变，计算属性就会重新运行，视图也会跟着更新。
下面是一个计算属性的简单用法

```html
<div id="app">
	总价：{{price}}
</div>
<script>
var app = new Vue({
	el:"#app",
	data:{
		package1:[
			{
				name:"iphone 7",
				price: 7199,
				count:1
			},
			{
				name:"ipad",
				price: 8000,
				count:1
			},
			{
				name:"iphone 7",
				price: 7199,
				count:1
			}
		],
		package2:[
			{
				name:"mac 7",
				price: 666,
				count:1
			},
			{
				name:"cam",
				price: 1000,
				count:2
			},
			{
				name:"ban 7",
				price: 10,
				count:50
			}
		],
	},
	computed:{
		price: function() {
			var prices = 0;
			for(var i=0; i<this.package1.length; i++) {
				prices += this.package1[i].price * this.package1[i].count;
			}
			for(var i=0; i<this.package2.length; i++) {
				prices += this.package2[i].price * this.package2[i].count;
			}
			return prices;
		}
	}
});
</script>
```

以上总价将被渲染为计算后的总价格，package1和package2所有物品的总价格。当package1或者package2中任意商品发生变化时候，都会引起总价的变化。
每一个计算属性中其实包含了一个`setter`和一个`getter`，上面我们使用的默认写法是调用的`getter`，当然，我们也可以指定`getter`和`setter`，例如：

```html
<div id="app">
	名字：{{fullName}}
</div>
<script src="../src/vue.min.js"></script>
<script>
var app = new Vue({
	el:"#app",
	data:{
		firstName:"Tao",
		lastName:"Lin"
	},
	computed:{
		fullName:{
			get: function() {
				return this.firstName + " " + this.lastName;
			},
			set: function(newValue) {
				var names = newValue.split(" ");
				this.firstName = names[0];
				this.lastName = names[names.length-1];
				/*
				* 可以在控制台输入 app.fullName = "A B" 查看结果
				*/
			}
		}
	}
});
</script>
```

其实不使用计算属性，使用`methods`里面的方法也可以达到目的，计算属性是依赖缓存的，书中推荐，**当遍历大数组和做大量计算时，应当使用计算属性**