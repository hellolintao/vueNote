# #第三节 JSX

## #什么是JSX

Render函数比较不友好的地方就是，代码结构过于复杂，当DOM结构比较复杂的时候，createElement变得十分复杂起来，为了让Render函数变得更好的书写和阅读，Vue提供了插件`babel-plugin-transform-vue-jsx`来支持JSX语法。

JSX是一种看起来想HTML，但是是JS的语法拓展。

## #如果使用JSX

直接改写一段createElement代码：

```javascript
render(createElement) {
    return createElement("div",{
        props:{
            text:"some text"
        },
        attrs:{
            id:"myDiv"
        },
        domProps:{
            innerHtml:"content"
        },
        on:{
            change:this.changeHandler
        },
        nativeOn:{
            click: this.clickHandler
        },
        class:{
            show:true,
            on:false
        },
        style:{
            color:"#fff",
            background:"#000"
        },
        key:"key",
        ref:"element",
        refInFor:true,
        slot:"slot"
    });
}
```

修改成JSX语法如下：

```JSX
render(h) {
    return (
        <div
            id="myDIv"
            domPropsInnerHtml = "content"
            onChange={this.changeHandler}
            nativeOnClick={this.clickHandler}
            class = {{ show:true, on:false }}
            style= {{ color:"#fff",background:"#000" }}
            key="key"
            ref="element"
            refInFor
            slot="slot"
        >
        </div>
    );
}
```
> JSX仍然是JS而不是DOM