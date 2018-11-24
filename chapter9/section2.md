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
	attrs:{ 正常的html属性
		id:"foo"
	},
	props:{ // 组件props
		myProps:"bar"
	},
	domProps:{ // DOM属性
		innerHtml:"baz"
	},
	on:{ // 事件监听，不支持秀时期，需要手动匹配keyCode
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
## 约束
## 使用Javascript代替模板功能