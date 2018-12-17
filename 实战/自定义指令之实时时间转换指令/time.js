var Time = {
    // 现在的时间
    getUnix: function() {
        var date = new Date();
        return date.getTime();
    },
    // 今天0:0:0的时间
    getTodayUnix: function() {
        var date = new Date();
        date.setHours(0);
        date.setMinutes(0);
        date.setSeconds(0);
        date.setMilliseconds(0);
        return date.getTime();
    },
    // 今年0101,0:0:0的时间
    getYearUnix: function() {
        var date = new Date();
        date.setHours(0);
        date.setMinutes(0);
        date.setSeconds(0);
        date.setMilliseconds(0);
        date.setMonth(0);
        date.setDate(1);
        return date.getTime();
    },
    // 标准的yyyy-mm-dd
    getLastDate: function(time) {
        var date = new Date(time);
        var month = date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1;
        var day = date.getDate() < 10 ? '0' + date.getDate() : date.getDate();
        return date.getFullYear() + '-' + month + '-' + day;
    },
    // 获取格式化的时间
    getFormatTime: function(timestamp) {
        var now  = this.getUnix();
        var today = this.getTodayUnix();
        var year = this.getYearUnix();

        // 现在的时间减去传递进来的时间，使用秒级计算
        var timer = (now - timestamp) / 1000;

        var tip = '';

        if(timer <= 0) {
            tip = '刚刚';
        } else if (Math.floor(timer / 60) <= 0) {
            // 1分钟内是刚刚
            tip = '刚刚';
        } else if (timer < 3600) {
            // 一个小时是60*60=3600秒，一小时内是分钟计算
            tip = Math.floor(timer / 60) + '分钟前';
        } else if (timer >= 3600 && (timestamp - today >= 0)) {
            // 如果是1个小时之上，24小时之内（时间差）
            tip = Math.floor(timer / 3600) + '小时前';
        } else if (timer / 86400 <= 31){
            // 如果是在一个月之内
            tip = Math.ceil(timer / 86400) + '天前';
        } else {
            tip = this.getLastDate(timestamp);
        }

        return tip;
    }
}

Vue.directive("time", {
    bind: function(el, binding) {
        // 每隔一分钟更新一下状态
        el.innerHTML = Time.getFormatTime(binding.value);
        el.__timeout__ = setInterval(function() {
            el.innerHTML = Time.getFormatTime(binding.value);
        }, 6000);
    },
    unbind: function(el) {
        clearInterval(el.__timeout__);
        delete el.__timeout__;
    }
});