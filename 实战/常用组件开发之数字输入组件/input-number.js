Vue.component('input-number', {
	template: "<div class='input-number'></div>",
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
		}
	},
	data: function() {
		return {
			currentValue: this.value
		}
	}
});