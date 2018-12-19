var app = new Vue({
	el: "#app",
	data: {
		columns: [
			{
				title: "姓名",
				key: "name"
			}, {
				title: "年龄",
				key: "age",
				sortable: true
			}
		],
		data: [
			{
				name: "小明",
				age: 18,
				birthday: "1999-08-08",
				address: "北京市海淀区中关村"
			}
		]
	}
});