/* 声明组件 */
Vue.component("vTable", {
	props: {
		/* 外部传递进来的需要2个数据，默认是空的 */
		columns: {
			type: Array,
			default:function() {
				return [];
			}
		},
		data: {
			type: Array,
			default: function() {
				return [];
			}
		}
	},
	data: function() {
		return {
			/* 为了不破坏原有数据，将数据保存咋这里 */
			currentColumns: [],
			currentData: []
		}
	},
	methods: {
		makeColumns: function() {
			/* 处理表头数据--加入排序类型和索引 */
			this.currentColumns = this.columns.map(function(col, index) {
				col._sortType = "normal";
				col._index = index;
				return col;
			});
		},
		makeData: function() {
			/* 处理表体数据，加入索引 */
			this.currentData = this.data.map(function(row, index) {
				row._index = index;
				return row;
			});
		},
		handleSortByAsc: function(index) {
			/* 升序排列算法 */
			console.log('handleSortByAsc');
		},
		handleSortByDesc: function(index) {
			/* 降序排列算法 */
			console.log("降序");
		}
	},
	mounted: function() {
		/* 加载完成后，首先处理原始数据 */
		this.makeColumns();
		this.makeData();
	},
	render: function(h) {
		var _this = this;
		var ths = [];
		var trs = [];
		this.currentData.forEach(function(row) {
			var tds = [];
			_this.currentColumns.forEach(function(cell) {
				tds.push(h("td", row[cell.key]));
			});
			trs.push(h("tr", tds));
		});

		this.currentColumns.forEach(function(col, index) {
			if(col.sortable) {
				ths.push(h("th", [
					h("span", col.title),
					h("a", {
						class: {
							on: col._sortType === "asc"
						},
						on: {
							click: function() {
								_this.handleSortByAsc(index)
							}
						}
					}, "^"),
					h("a", {
						class: {
							on: col._sortType === "desc"
						},
						on: {
							click: function() {
								_this.handleSortByDesc(index)
							}
						}
					}, "/")
				]));
			} else {
				ths.push(h("th", col.title));
			}
		});

		return h("table", [
			h("thead", [
				h("tr", ths)
			]),
			h("tbody", trs)
		]);
	}
});