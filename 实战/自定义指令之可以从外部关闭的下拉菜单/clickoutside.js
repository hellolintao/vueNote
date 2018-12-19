Vue.directive('clickoutside', {
	bind: function(el, binding, vnode) {
		console.log('指令运行');
		// binding是一个对象，里面包含了很多的属性
		function documentHandler(e) {
			// 如果是自身元素，则返回
			if(el.contains(e.target)) {
				return false;
			}
			// 如果指令中有绑定的字符串，那么
			if(binding.expression) {
				// 运行指令中绑定的值，binding.value是指定绑定值！
				binding.value(e);
			}
		}
		el.__vueClickOutside__ = documentHandler;
		document.addEventListener('click', documentHandler);
		
		function documentKeyup(e) {
			console.log(binding.modifiers);
			if(binding.modifiers['esc'] && e.which == 27) {
				binding.value(e);
			}
		}
		el.__vueKeyup__ = documentKeyup;
		document.addEventListener('keyup', documentKeyup);
	},
	unbind: function(el, binding) {
		documentHandler.removeEventListener('click', el.__vueClickOutside__);
		documentHandler.removeEventListener('keyup', el.__vueKeyup__);
		delete el.__vueClickOutside__;
		delete el.__vueKeyup__;
	}
});