var app = new Vue({
	el:"#app",
	data:{
		list:[
			{
				id:1,
				name:"iphone",
				price:6000,
				count:1
			},{
				id:2,
				name:"mac",
				price:9000,
				count:2
			},{
				id:3,
				name:"watch",
				price:3588,
				count:1
			},{
				id:4,
				name:"macbook",
				price:12000,
				count:3
			},{
				id:5,
				name:"pencil",
				price:700,
				count:2
			}
		]
	},
	computed:{
		totalPrice: function() {
			var total = 0;
			for(var i=0; i<this.list.length; i++) {
				var item = this.list[i];
				total += item.price + item.count;
			}
			return total;
		}
	},
	methods:{
		handleReduce: function(index) {
			if(this.list[index].count === 1)return;
			this.list[index].count --;
		},
		handleAdd: function(index) {
			this.list[index].count ++;
		},
		handleRemove: function(index) {
			this.list.splice(index, 1);
		}
	}
});