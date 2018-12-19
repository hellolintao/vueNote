var Days = {
	getUnix: function() {
		var date = new Date();
		return date.getTime();
	},
	getFormatTime: function(birthday) {
		var birthday = new Date(birthday).getTime();
		return '已经出生' + Math.floor((this.getUnix() - birthday) / 86400000) + '天';
	}
}

Vue.directive("birthday", {
	bind: function(el, binding) {
		el.innerHTML = Days.getFormatTime(binding.value);
	},
	unbind: function(el) {

	}
});