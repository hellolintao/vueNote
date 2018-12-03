# 第三节 单文件组件与vue-loader


## #什么是vue单文件

回想之前我们在做vue开发的时候，要在js文件中写一个组件，需要在`template`是书写模板信息，或者在`render`函数中写模板信息，然后在页面中单独引入一个css文件，来规范样式，这样的写法效率不高，很麻烦，尤其是在js文件中写template换行等问题很复杂，另外之前那种形式的代码也不便于管理，可以使用vue单文件的办法来解决这个问题。

一个vue单文件的后缀是`.vue`，它分为三个部分，分别是`template, script, style`。大概长这样：

```html
<template>
    <h1>{{title}}</h1>
</template>

<script>
    export default  {
        props:{
            name:{
                type: String,
                default: ""
            }
        }
    }
<script>

<style>
h1 {
    color: red;
}
</style>
```

显而易见，以上三个部分分别是vue组件的模板，js，样式。在`<style></style>`中，可以使用预编译语言，例如使用`less`的时候，可以这样写:`<style lang="less"></style>`，另外，在这个里面写的样式，会应用到整个页面，如果想让某个vue单文件中的样式只应用于当前组件，可以这样写`<style scoped></style>`

## #使用vue单文件

首先，安装一大堆的包：

```
npm install --save vue

npm install --save-dev vue-loader
npm install --save-dev vue-style-loader
npm install --save-dev vue-template-loader

npm install --save-dev vue-hot-reload-api

npm install --save-dev babel
npm install --save-dev babel-loader
npm install --save-dev babel-core
npm install --save-dev babel-plugin-transform-runtime
npm install --save-dev babel-preset-es2015
npm install --save-dev babel-runtime
```

然后，配置webpack.config.js

```javascript
var path = require("path");

var ExtractTextPlugin = require("extract-text-webpack-plugin");

var config = {
	entry: {
		main:"./main"
	},
	output: {
		path: path.join(__dirname, "./dist"),
		publicPath: "/dist/",
		filename: "main.js"
	},
	module: {
		rules: [
			{
				test: /\.vue$/,
				loader: "vue-loader",
				options: {
					loaders: {
						css: ExtractTextPlugin.extract({
							use:"css-loader",
							fallback:"vue-style-loader"
						})
					}
				}
			},{
				test:/\.js$/,
				loader:"babel-loader",
				exclude:/node-modules/
			},{
				test:/\.css$/,
				use: ExtractTextPlugin.extract({
					use:"css-loader",
					fallback:"vue-style-loader"
				})
			}
		]
	},
	plugins: [
		new ExtractTextPlugin("main.css")
	]
}
```

因为在编译vue单文件的时候，会对单文件中的三个部分分别打包，所以在vue-loader下面多了一个options选项，进一步对不同的语言进行配置。之前说到可以对style部分指定语言，当指定了语言之后，配置好对应的loader即可正常使用了。

上面的配置文件中，我们使用babel-loader来处理js文件，因为babel是编译es6使用的，babel也要依赖一个配置文件，故接下来，我们创建babel的依赖文件：`.babelrc`

```json
{
	"presets": ["es2015"],
	"plugins": ["transform-runtime"],
	"comments": false
}
```

配置好这些文件后！我们就可以使用vue单文件了！

### #实战

vue单文件中声明的组件，如何使用呢？一个简单的例子：

1， 在入口中声明文件

因为在webpack配置文件中，我们说明了入口文件是main.js， 那么在main.js文件中，首先导入根组件：

```javascript
import Vue from "vue";
import App from "./app.vue";

new App({
	el:"#app",
	render: h=> {
		return h(App)
	}
});
```

2， 你的组件

首先我们声明一个title组件

```html
<!-- title.vue文件 -->
<template>
	<h1>
		<a :href="'#' + title">{{ title }}</a>
	</h1>
</template>
<script>
	export default {
		props: {
			title: {
				type: String
			}
		}
	}
</script>
<style scoped>
	h1 a {
		color: #ffffff;
		font-size: 24px;
	}
</style>
```

然后声明一个button组件

```html
<!-- button.vue文件 -->
<template>
	<button @click="handleClick" :style="styles">
		<slot><slot>
	</button>
</template>
<script>
	export default {
		props: {
			color: {
				type: String,
				default: "#00FF66"
			}
		},
		computed: {
			styles: () => {
				return {
					background: this.color
				}
			}
		},
		methods: {
			handleClick: (e) => {
				this.$emilt("click", e);
			}
		}
	}
</script>
<style scoped>
	button {
		border: 0;
		outline: none;
		color: #ffffff;
		padding: 2px 4px;
	}
	button:active,button:hover {
		color: #00FF00;
	}
</style>
```

然后开始书写我们的app.vue文件！

```html
<!-- app.vue -->
<template>
	<div>
		<v-title title="测试标题"></title>
		<v-button color="#000000" @click="handelClick">按钮点击</v-button>
	</div>
</template>
<script>
	import vTitle from "./title.vue"
</script>
<style scoped>
	
</style>
```