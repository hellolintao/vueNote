# 第一节 前端工程化与webpack

## #预备知识

想使用webpack须具备一些ES6的知识，最主要的便是`export`和`import`。

`export`和`import`是用来导出和导入模块的，一个模块就是一个JS文件，它拥有独立的租用与，里面定义的变量外部是无法读取的，因此，可以通过`export`进行导出

```javascript
// config.js
var Config = {
    version:"1.0.0"
}
export {Config};

// or
export var Config = {
    version:"1.0.0"
}
```

也可以导出其他类型的数据，例如函数，数组，常量等。

```javascript
// add.js
export function add(a, b){
    return a + b;
}
```

模块导出后，要进行导入的操作：

```javascript
//main.js
import {Config} from "./config.js";
import {add} from "./add.js";

console.log(Config); // {vsersion:"1.0.0"}
console.log(add(1,1)); // 2
```

以上我们在导入的时候，是我们知道其他js文件中，导出数据的名称，但是我们导入某个数据的时候，可能不知道名称是什么，只是想把导出的数据拿来使用，那么可以使用`export`导出默认数据

```javascript
// config.js
export default {
    version:"1.0.0"
}

// add.js
export default function(a, b) {
    return a + b;
}

// main.js

import conf from "./config.js";
import Add from "./add.js";

console.log(conf); // {version:"1.0.0"}
console.log(Add(1, 1)); // 2
```

如果你是用npm安装了第三方的库，也可以使用这个语法进行导入：

```javascript
import Vue from "vue";
import $ from "jquery";
// 导入vue和jquery并且命名为Vue和$
```