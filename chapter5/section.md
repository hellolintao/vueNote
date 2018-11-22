# 第五章 基本指令

## 5.1 基本指令
### 5.1.1 v-colak
当网速较慢的时候，或者其他原因，Vue控件没有加载完成，会导致页面上显示`{{xxx}}`这种信息，可以配合该指令来隐藏这种信息，在css中书写下面这段代码，即可隐藏。

```css
[v-colak]{
	opacity:0;
}
```

在简单的项目中，这个属性很实用，但是在组件化的项目中，运用到了*webpack*和*vue-router*，这个属性不会被使用，有其他的解决方案。

### 5.1.2 v-once

这个指令代表，使用该指令的组件，只渲染一次，一次之后，依赖数据变化也不会引起视图更新，组件将被视为静态内容，这个指令在业务逻辑中很少会用到，在优化性能时，可能会使用到。

## 5.2 条件渲染指令

### 5.2.1 v-if/v-else-if/v-else

这个指令的用法也比较简单，如下：

```html
<div v-if="status === 1"> 当status=1的时候，显示这一行 </div>
<div v-else-if="status === 2"> 当status=2的时候，显示这一行</div>
<div v-else> 当不满足于以上2中条件的时候，显示这一行 </div>
```

需要注意的是`v-else-if`和`v-else`前面必须有`v-if`，才可以正常使用。
当我们进行条件渲染时候，有时候可能不需要这个标签，那我们可以借助`template`来实现这个需求，例如

```html
<template v-if="status === 1">
	...
</template>
```

渲染结果中，并不会有`template`标签。
出于对效率的考虑，vue在条件渲染中，会更多的重复利用已经存在的元素，而不是重新渲染，例如下面这段代码：

```html
<div id="app">
    <template v-if="type === 'name'">
        <label>用户名：</label>
        <input placeholder="请输入用户名"/>
    </template>
    <template v-else>
        <label>邮箱：</label>
        <input placeholder="请输入邮箱"/>
    </template>
    <button @click="handleToggleClick">切换输入类型</button>
</div>
<script>
    var app = new Vue({
        el:"#app",
        data:{
            type:"name"
        },
        methods: {
            handleToggleClick: function() {
                this.type = this.type === "name" ? "email" : "name";
            }
        }
    });
</script>
```

如果我在输入框中已经输入了文字，然后点击了切换输入类型的按钮，那么我输入的文字并不会被清除，看代码中，应当是将`v-else`中的元素重新加载，但是为了提高效率，`input`元素并没有重新加载，只是替换了`placeholder`中的内容，如果不想这么做，可以使用Vue提供的`key`属性，`key`的值必须是唯一的，它可以让用户决定是否要复用该元素，我们修改上面的代码如下，即可避免该问题

```html
<div id="app">
    <template v-if="type === 'name'">
        <label>用户名：</label>
        <input placeholder="请输入用户名" key="name-input"/>
    </template>
    <template v-else>
        <label>邮箱：</label>
        <input placeholder="请输入邮箱" key="email-input"/>
    </template>
    <button @click="handleToggleClick">切换输入类型</button>
</div>
// 省略以下代码
```

### 5.2.2 v-show

`v-show`类似于条件渲染，使用方式如下：

```html
<div v-show="status === 1"></div>
```

渲染结果为：`<div style="display:none"></div>`，`v-show`和`v-if`有一些类似之处，但是`v-if`是真正的条件渲染，当不满足条件时，并不会渲染相关的html元素，而`v-show`无论条件是否满足，都会渲染这个元素，只是是否显示的问题。

### 5.2.3 v-if与v-show的选择

一般情况下，元素需要频繁的切换显示和隐藏，则采用`v-show`，可以提高效率。`v-if`则更适合条件不经常改变的情景

## 5.3 列表渲染指令v-for

### 5.3.1 基本用法

`v-for`指令比较简单，使用方式如下：

```html
<div id="app">
    <ul>
        <li v-for="(per, index) in persons">
            {{index+1}} - {{per.name}}
        </li>
    </ul>
</div>
<script>
    var app = new Vue({
        el:"#app",
        data:{
            persons:[
                {
                    name:"json"
                },
                {
                    name:"recal"
                },
                {
                    name:"mark"
                }
            ]
        }
    });
</script>
```

渲染结果如下

```html
<div id="app">
    <ul>
        <li>1-json</li>
        <li>2-recal</li>
        <li>3-mark</li>
    </ul>
</div>
```

循环指令支持一个`index`索引参数，该指令也可以用在`<template>`中。

**说明**`v-for`指令不仅可以循环*属性*，还可以循环*计算属性*

### 5.3.2 数组更新

在Vue中，操作数组可以采用JS原生的方法，常用操作如下

- push()
- pop()
- shift()
- unshift()
- splice()
- sort()
- reverse()
- filter() // 返回新数组，不会改变原数组
- concat() // 返回新数组，不会改变原有数组
- slice() // 返回新数组，不会改变原有数组

在Vue中操作数组不必考虑性能问题，因为Vue会自动判断已经更新的数据和没更新的数据，对于没有更新的数据，Vue也不会重新渲染该数组。

以下两种方式操作数组，Vue是检测不到的
- 使用索引的方式来修改数组`app.books[8] = {...}`
- 修改数组的长度`app.books.length = 3`

对于第一种情况，我们通常采用的方式是：

```javascript
Vue.set(app.books, 3, {
	// 具体信息
});

// webpack中默认是不导入Vue的，可以如下方式修改
this.$set(app.books,3,{
	// 具体信息
});

// 使用splice()来完后
app.books.splice(3,1, {

})
```

对于第二种情况，直接使用`splice`来解决即可

```javascript
app.books.splice(3);
```

### 5.3.3 过滤与排序

如果想要排序数组或者过滤数组，但是不想改变原有数组，那么可以借助*计算属性*来操作，在计算属性方法中对数组进行操作，然后返回即可，计算属性不仅可以用于普通的数据绑定，还可以用于`v-for`指令。

## 5.4 方法与事件

### 5.4.1 基本用法

绑定事件可以使用`v-on`指令，例如`<button v-on="myClick"></button>`，也可以使用语法糖的形式`<button @click="myClick"></button>`。以上两种方式，可以直接在引号中写js代码，但是不建议这么做。

绑定事件中，可以带括号，也可以不带括号，如果不带括号并且函数有参数，Vue会将原生的event参数传递进来，如果要传递其他参数，必须带有括号。
Vue提供了一个特殊变量`$event`，用于访问原生evnet事件，例如`<button @click="myClick('参数一', $event)"></button>`。

### 5.4.2 修饰符

在传统的前端项目中，我们想阻止默认行为，例如`event.preventDefault()`，在这里我们可以使用修饰符来实现，Vue中常用的修饰符如下：

- .stop  阻止事件冒泡
- .prevent 提交事件不在重载页面
- .capture 添加事件监听器的时候使用事件捕获的形式
- .self 事件只是发生在元素本身的时候才调用，（不包含子元素
- .once 只触发一次

使用方式如下

```html
<button @click.self="myClick"></button>
<button @click.self.stop="myClick"></button> <!-- 可以串联使用 -->
```

`keyup`是键盘事件，可以直接使用某个按键的键值作为修饰符，例如`<input @keyup=.13="submit" />`,当然，可以配置具体按键，例如`Vue.config.keyCodes.f1=112`，设置了*f1*的键值，就可以`@keyup.f1`这样使用了，同时，Vue也提供了一系列快捷名称:

- .enter
- .tab
- .delete
- .esc
- .space
- .up
- .down
- .left
- .right

下面这个可以组合使用

- .ctrl
- .alt
- .shift
- .meta (mac is command, windows is start)

例如：

```html
<input @keyup.shift.83 /> <!-- shift+s -->
<div @click.ctrl=""></div> <!-- 按住ctrl的点击事件 -->
```