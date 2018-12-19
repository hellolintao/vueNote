Vue.component("vTable", {
	props: {
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
			currentColumns: [],
			currentData: []
		}
	},
	methods: {
		makeColumns: function() {
			this.currentColumns = this.columns.map(function(col, index) {
				col._sortType = "normal";
				col._index = index;
				return col;
			});
		},
		makeData: function() {
			this.currentData = this.data.map(function(row, index) {
				row._index = index;
				return row;
			});
		},
		handleSortByAsc: function(index) {
			console.log('handleSortByAsc');
		},
		handleSortByDesc: function(index) {
			console.log("降序");
		}
	},
	mounted: function() {
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