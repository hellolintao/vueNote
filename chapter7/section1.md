# 第一节 组件复用

## 1 为什么使用组件

    略

## 2 组件用法

```javascript
var app = new Vue({
    el:"#app"
});
```

上面的代码现在已经很熟悉了，这是声明一个Vue实例，组件的使用方式与之类似，组件在使用之前要进行组件注册，组件注册有全局注册和局部注册两种方式：

### 全局注册

```html
<div id="app">
    <my-component></my-component>
</div>
<script>
    Vue.component("my-component", {
        template:"<div>这里是组件内容</div>"
    });
</script>
```

以上渲染结果如下：

```html
<div id="app">
    <div>这里是组件内容</div>
</div>
```

需要注意的是，在注册组件的时候，`template`中的模板必须有且只有一个根元素，否则无法渲染。

另外，在html中，会对某些元素进行限制，例如`<table>`内规定只允许是`<tr><td>`等表格元素，如果我们想要将元素加载到这些元素上，可以使用`is`属性来挂载，例如`<tbody is="my-component"></tbody>`，*如果是在字符串模板中渲染这些被限制元素，其是不受限制的*

### 局部注册

```html
<div id="app">
    <my-component></my-component>
</div>
<script>
    var app = new Vue({
        el:"#app",
        components: {
            "my-component":{
                template:"<div>这里是组件的内容</div>"
            }
        }
    });
</script>
```

局部注册组件只在该实例的作用域内有效，也就是说，上面的代码，`my-component`这个组件只在`<div id="app"></div>`之内有效。

注册组件，可以使用实例中的特性，例如方法，计算属性，数据绑定等，但是在全局注册中，数据绑定要采用`return`的方式：

```javascript
Vue.component("my-component", {
    template:"<a></a>",
    data:function() {
        return {
            message:"this is my message"
        }
    }
});
```

因为在js中，对象是引用的关系，如果操作data我们使用直接赋值的方式而不是使用函数`return`的方式，如果组件被复用，那么一个组件数据被更改，所有组件都会收到反馈，这不是正确的解决方案，如果使用函数`return`的形式来给data赋值，那么每个组件的data指向的是自己专属的对象，则是一个完全独立的组件，达到了组件复用的效果。



