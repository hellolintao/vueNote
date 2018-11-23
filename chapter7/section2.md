# 第二节 props传递数据

props是父组件向子组件传递数据来用的。

## 1 基本用法

```html
<div id="app">
    <my-component message="这是父组件给你的信息"></my-component>
</div>
<script>
    Vue.componnet("my-componet",{
        data:function() {
            return {
                name:"lin"
            }
        },
        props:["message"], // 接收父组件传递的数据
        template:"<div>这里是父组件传递的数据：{{message}}。这里是组件自有数据:{{name}}</div>"
    });
</script>
```

全局注册的组件中的`data`和`props`都可以直接在`template`和`methods`和`computed`中使用！·

## 2 单向数据流

Vue2.X与Vue1.X不同的一个地方就是，`props`是单向的，父组件修改这个值，会引起子组件的响应、数据相应的改变，但是子组件修改这个值，不会影响到父组件的值，这样做是为了将父子组件解耦，也避免了子组件意外修改了父组件的数据，导致错误。

业务中一般有两种要修改`props`值的情况，第一种：

- 将`props`作为初始值传递进来，可以使子组件在自己的作用域下使用，代码如下

```javascript
Vue.component("my-component", {
    props:["message"],
    data:function(){
        return {
            myMessage: this.message
        }
    }
});
```

以上我们将来自父组件的`message`传递给`myMessage`，之后就与该props值无关了，以后只需要维护`myMessage`就可以了，这样既可以避免直接操作props，还有利于后期数据的维护。

- 对传递进来的`props`进行计算，这个时候使用计算属性就可以达到目的，代码如下

```javascript
Vue.component("my-component", {
    props:["width"], // 代表某个元素的宽度
    computed:{
        style: function(){
            return this.width + "px";
        }
    }
});
```
## 3 数据验证

我们写好的组件，如果提供给别人使用或者某些使用场景下，需要对传递进来的组件进行数据验证，之前写到子组件接收props都是使用数组的写法，如果需要进行数据验证，那么就要采用对象写法。代码如下：

```javascript
Vue.component("my-component", {
    props:{
        propsA:Number, // 必须是数字
        propsB:[Number, String], // 必须是数字或者字符串
        propsC:{ // 必须是布尔类型，默认值是false
            type:Boolean,
            default:false
        },
        propsD:{ // 必须是数字类型且必须填
            type:Number,
            required: true
        },
        propsE:{ // 必须是数组，
            type:Array, // 默认值是数组或者对象，默认值必须用函数返回
            default: function(){
                return [];
            }
        },
        propsF:{ // 自定义验证器
            validator: function(value) {
                return value > 10;
            }
        }
    }
});
```
可以验证的数据类型有

- String
- Number
- Boolean
- Object
- Array
- Function

*type也可以是一个自定义构造器，使用`instanceof`检测，当props验证失败的时候，在开发版本的控制台会抛出一条警告*