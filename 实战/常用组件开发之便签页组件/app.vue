<template>
	<div>
		<h2>自定义组件之标签页</h2>
		<v-tabs v-model="activeKey">
			<v-pane label="标签一" name="1">
				标签一的内容
			</v-pane>
			<v-pane label="标签二" name="2">
				标签二的内容
			</v-pane>
			<v-pane label="标签三" name="3">
				标签三的内容
			</v-pane>
		</v-tabs>
	</div>
</template>
<script>
	import vTabs from "./tabs.vue";
	import vPane from "./pane.vue";
	export default {
		components: {
			vTabs,
			vPane
		},
		data: function () {
			return {
				activeKey: "1"
			}
		}
	}
</script>
<style>
	[v-cloak] {
		display: none;
	}

	.tabs {
		font-size: 14px;
		color: #657180;
	}
	.tabs-bar:after {
		content: " ";
		display: block;
		width: 100%;
		height: 1px;
		background: #f2f2f2;
		margin-top: -1px;
	}
	.tabs-tab {
		display: inline-block;
		padding: 4px 16px;
		margin-right: 6px;
		background: #ffffff;
		border: 1px solid #eeeeee;
		cursor: pointer;
		position: relative;
	}
	.tabs-tab-active {
		color: red;
		border-top: 1px solid blue;
		border-bottom: 1px solid #ffff;
	}
</style>