# 第五节 组件高级用法

## 1 递归组件

给组件设置了`name`属性之后，就可以递归调用该组件，例如：

```html
<div id="app">
	<my-component></my-component>
</div>
<script type="text/javascript">
	Vue.component("my-component",{
		name:"my-component",
		props:{
			count:{
				type:number,
				default:1
			}	
		},
		template:"<div><my-component :count="count +1" v-if="count < 3"></my-component></div>"	
	});
</script>
```

在递归使用组件的时候，一定要对递归数量进行限制，否则会报错。

## 2 内联模板

一般情况下，组件的模板都是定义在`template`属性内，但是如果模板过于复杂，这个维护起来很困难，书写起来也很困难，Vue提供了内联模板的功能，只要在组件标签中声明`inline-template`即可使用内联模板，如下所示：

```html
<div id="app">
	<my-component inline-template>
		<p>在父组件中定义的内联模板</p>
		<p>{{message}}</p>
		<p>{{msg}}</p>
	</my-component>
</div>
<script type="text/javascript">
	var app = new Vue({
		el:"#app",
		data:{
			message:"这里是父组件的数据"
		}	
	});
	Vue.component("my-component",{
		data:function(){
			return {
				msg:"这里是父组件的数据"
			}
		}	
	});
</script>
```

以上代码渲染结果为：

```html
<div>
	<p>在父组件中定义的内联模板</p>
	<p>这里是父组件的数据</p>
	<p>这里是父组件的数据</p>
</div>
```

这虽然是一个很好的功能，但是作用域很难理解，如果父组件与子组件有名字一样的参数，那么优先使用子组件的数据，在开发中尽量少使用这种功能。

## 3 动态组件

Vue中提供了特殊的标签`component`，对这个标签设置`is`属性，Vue会自动的渲染成相应的组件，例如：

```html
<div id="app">
	<component :is="myComponent"></component>
</div>
<script type="text/javascript">
	var comA = {
		template:"<p>组件A</p>"
	};
	var app = new Vue({
		el:"#app",
		data:{
			myComponent:"comA"
		},
		components:{
			comB:{
				template:"<p>组件B</p>"
			},
			comC:{
				template:"<p>组件C</p>"
			}
		}	
	});
</script>
```

可以设置`MyComponent`的值，来渲染相应的组件。

## 4 异步组件

如果项目过大，或者组件太多，这个时候要考虑性能的问题，Vue可以定义一个工厂函数，在有需要的时候，调用工厂函数中的某些方法，就可以实现异步加载组件

```html
<div id="app">
	<my-component></my-component>
</div>
<script type="text/javascript">
	Vue.component("my-component", function(resolve, reject){
		window.setTimeout(function(){
			resolve({
				template:"<p>一个异步记载的组件</p>"	
			});
		}, 2000);
	});
</script>
```

以上组件将在2秒后渲染，在业务中，我们经常要依靠从服务器获取数据，来渲染组件，这个时候，就可以使用这个功能，例如当AJAX加载到正确的数据的时候，将组件加载上去，当然，如果AJAX数据加载失败，我们也可以使用`reject(reason)`来输出组价加载失败信息。