Vue.component('input-number', {
	template: "<div class='input-number'><input type='text' :value='currentValue' @change='handleChange' @focus='handleFocus'/><button @click='handleDown' :disabled='currentValue <= min'>-</button><button @click='handleUp' :disabled='currentValue >= max'>+</button></div>",
	props: {
		max: {
			type: Number,
			default: Infinity
		},
		min: {
			type: Number,
			defalut: Infinity
		},
		value: {
			type: Number,
			defalut: 0
		},
		step: {
			type: Number,
			defalut: 1
		}
	},
	data: function() {
		return {
			currentValue: this.value
		}
	},
	watch: { // 两个监听函数也就是说内部修改数据向外部提交事件，外部修改数据内部做出反馈
		currentValue: function(val) {
			// 这个值是和父组件传递进来的value是一个值，如果这个值被改变了，触发父组件的input事件和父组件的on-change事件
			this.$emit('input', val);
			this.$emit('on-change', val);
		},
		value: function(val) {
			// 这个值是props外部传递进来的值，如果这个值改变了，也就是说通过组件内部或者外部改变了这个值，则执行这个函数
			this.updateValue(val);
		}
	},
	methods: {
		updateValue: function(val) {
			// 如果value改变，则判断改变的值是不是在范围之内，如果超出范围，设置为临界值
			if(val > this.max) {
				val = this.max;
			}
			if(val < this.min) {
				val = this.min;
			}
			this.currentValue = val;
		},
		handleDown: function() {
			if(this.currentValue <= this.min) {
				return;
			}
			this.currentValue -= this.step || 1;
		},
		handleUp: function() {
			if(this.currentValue >= this.max) {
				return;
			}
			this.currentValue += this.step || 1;
		},
		handleChange: function(event) {
			// 如果input的值改变了
			var val = event.target.value.trim();
			console.log(val);

			var max = this.max;
			var min = this.min;

			if(isValueNumber(val)) {
				val = Number(val);
				this.currentValue = val;

				if(val > max) {
					this.currentValue = max;
				} else if (val < min) {
					this.currentValue = min;
				}
 			} else {
 				/* 如果用户输入的不是数字，那么我们给输入组件当前的值 */
 				event.target.value = this.currentValue;
 			}
		},
		handleFocus: function(event) {
			/* 当输入框聚焦的时候，监听键盘上下事件 */
			var _this = this;
			event.target.onkeydown = function (e) {
				if(e.keyCode === 38) {
					e.preventDefault();
					_this.handleUp();
				} else if (e.keyCode === 40) {
					e.preventDefault();
					_this.handleDown();
				}
			}
		}
	}
});

function isValueNumber(val) {
	/* 判断一个数值是否是数字 */
	if(Number(val).toString() !== "NaN") {
		return true;
	} else {
		return false;
	}
}