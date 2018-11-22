# 第六章 表单与v-model

## 6.1 基本用法

### 文本输入框

```html

<div id="app">
    <input type="text" v-model="message"/>
    <h2>{{ message }}</h2>
</div>
<script>
var app = new Vue({
	el:"#app",
    data:{
		message:""
	}
});
// 此时，实例中的message和input标签中的message已经绑定了，一个数据更新，另外一个数据也会更新，同时，h2元素中的message也会及时更新。
</script>
```

### 单选按钮

```html
<!-- 单选模式可以直接使用数据绑定 -->
<div id="app">
    <input type="radio" :checked="picked">
</div>
<script type="text/javascript">
	var app = new Vue({
		el:"#app",
		data:{
			picked: true
		}	
	});
</script>

<!-- 互斥模式可以使用v-model -->
<div id="app">
	<input type="radio" value="js" v-model="picked"><label>js</label>
	<input type="radio" value="html" v-model="picked"><label>html</label>
	<input type="radio" value="css" v-model="picked"><label>css</label>

	<p>您选择的是：{{ picked }}</p>
</div>
<script type="text/javascript">
	var app = new Vue({
		el:"#app",
		data:{
			picked:"js"
		}	
	});
</script>
```

### 复选框

```html
<!-- 可以单独使用 -->
<div id="app">
	<input type="checkbox" v-model="checked">
</div>
<script type="text/javascript">
	var app = new Vue({
		el:"#app",
		data:{
			checked:true
		}	
	});
</script>

<!-- 可以组合使用 -->
<div id="app">
	<input type="checkbox" value="js" v-model="picked"><label>js</label>
	<input type="checkbox" value="html" v-model="picked"><label>html</label>
	<input type="checkbox" value="css" v-model="picked"><label>css</label>

	<p>您选择的是：{{ picked }}</p>
</div>
<script type="text/javascript">
	var app = new Vue({
		el:"#app",
		data:{
			picked:["js","html"]
		}	
	});
</script>
```

### 选择列表

```html
<div id="app">
	<select v-model="selected" multiple>
		<option v-for="option in options" :value="option.value">{{options.text}}</option>
		<!-- v-model会有限匹配option中的value的值，如果没有，则匹配标签中的text -->
	</select>
</div>
<script type="text/javascript">
	var app = new Vue({
		el:"#app",
		data:{
			selected:["html","css"], // 如果select中指定了multiple则是数组，否则是字符串
			options:[
				{
					value:"html",
					title:"超文本标记语言"
				},
				{
					value:"css",
					title:"层叠样式表"
				},
				{
					value:"JavaScript",
					title:"JS"
				}
			]
		}	
	});
</script>
```

如果使用的是汉字输入，那么在输入拼音的这个阶段，是不会更新`v-model`的，如果想随时更新，可以借助`@input`事件。

## 6.2 绑定值

使用`v-model`进行数据绑定之后，我们还可以对表单进行值的绑定，当可选中表单处于选中状态时，`value`和`v-model`同时更新，例如：

```html
<div id="app">
	<input type="checkbox" v-model="checked" :value="book"/>
</div>
<script>
	var app = new Vue({
		el:"#app",
		data:{
			checked:false,
			book:"js"
		}
	});
</script>
```

以上当checkbox选中的时候，`app.checked === app.book`，都是`js`。

```html
<div id="app">
	<input type="checkbox" v-model="checked" :true-value="value1" :false-value="value2"/>
</div>
<script>
	var app = new Vue({
		el:"#app",
		data:{
			checked:false,
			value1:"a",
			value1:"b"
		}
	});
</script>
```

以上，当checkbox选中的时候`app.checked === app.value1`，未选中时，`app.checked === app.value2`

## 6.3 修饰符

与事件类似，`v-model`也有很多的修饰符。

### .lazy

使用该修饰符`<input v-model.lazy="value1">`，该值不是实时更新的，只有元素失焦或者按下回车时才会更新

### .number

使用该修饰符`<input v-model.number="value1">`，可以把用户输入的值转成Number类型。

### .trim

`<input v-model.trim="value1">`，可以去掉输入的首尾空格。
