<template>
	<div class="pane" v-show="show">
		<slot></slot>
	</div>
</template>
<script>
	export default {
		props: {
			name: {
				type: String
			},
			label: {
				type: String,
				default: ""
			}
		},
		data: function() {
			return {
				show: true
			}
		},
		methods: {
			updateNav: function() {
				console.log(this.$parent.updateNav);
				this.$parent.updateNav();
				// this.$parent.updateNav();
			}
		},
		watch: {
			label: function() {
				this.updateNav();
			}
		},
		mounted: function() {
			this.updateNav();
		}
	}
</script>
<style>

</style>