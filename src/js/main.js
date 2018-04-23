
var myFn = {
    ajax: function (type, data, url, sucFn) {
        sucFn = sucFn || function () {};
        $.ajax({
            url: url,
            type: type,
            data: data,
            cache: true,
            timeout: 30000,
            dataType: 'json',
            success: function (res, textStatus, XMLHttpRequest) {
                // window.myFn.option_loading();
                window.myFn.statusCode(res, sucFn);
            },
            error: function () {
                console.log('网络错误');
            }
        });
    },
    uploadImg: function (form, url, sucFn) {
        $.ajax({
            url: url,
            type: 'post',
            data: form,
            processData: false,
            contentType: false,
            success: function (res) {
                window.myFn.statusCode(res, sucFn);
            }
        });
    },
    // 服务器返回状态
    statusCode: function (res, sucFn) {
        switch (parseInt(res.code)) {
            case 200:
                sucFn(res);
                break;
            case 99994:
                window.vm.$router.push({name: 'statePage', params: {type: 3}});
                break;
            case 99995:
                // 高级授权
                this.getWxCode('99995');
                break;
            case 99996:
                // 普通授权
                this.getWxCode('99996');
                break;
            case 99997:
                // 未注册
                // location.href = location.protocol + '//' + location.hostname + ':8080/#/index/center/certify'
                location.href = location.protocol + '//' + location.hostname + '/mobile/#/index/center/certify'
                break;
            case 99999:
                localStorage.removeItem('userInfo');
                window.myFn.wxlogin()
                break;
            // 判断是否有默认地址
            case 99986:
                // ....
                break;
            case 99987:
                alert('res.msg')
                window.vm.$router.push({name: 'address'})
                break;
            case 10000:
                alert(res.msg)
                break;
            default:
                alert(res.msg);
                break;
        }
    },
    // 获取wxCode
    getWxCode: function (type) {
        // location.href = location.protocol + '//' + location.hostname + ':8080' + window.apiAddress.wx.getCode + '?redirect_uri=' + escape(location.protocol + '//' + location.hostname + ':8080/') + '&state=' + type + '&other=' + escape(location.hash);
        location.href = location.protocol + '//' + location.hostname + window.apiAddress.wx.getCode + '?redirect_uri=' + escape(location.protocol + '//' + location.hostname + '/mobile/') + '&state=' + type + '&other=' + escape(location.hash);
    },
    wxlogin: function () {
        var data = {
            code: '',
            state: ''
        }
        if (myFn.GetQueryString('code')) {
            data.code = myFn.GetQueryString('code');
            data.state = myFn.GetQueryString('state');
        } else {
            data.code = 0;
        }
        myFn.ajax('get', data, apiAddress.wx.login, function (res) {
            localStorage.userInfo = JSON.stringify(res.data);
            localStorage.is_auth = res.data.is_auth;
            // location.href = location.protocol + '//' + location.hostname + ':8080' + window.location.hash;
            location.href = location.protocol + '//' + location.hostname + '/mobile/' + window.location.hash;
        });
    },
    // 获取get参数
    GetQueryString: function (name) {
        var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)');
        var r = window.location.search.substr(1).match(reg);
        if (r != null) return unescape(r[2]); return '';
    },
    getTime: function (t) {
        var time = [];
        time[0] = t.getFullYear();
        time[1] = t.getMonth() + 1;
        time[2] = t.getDate();
        return [time[0] + '年' + time[1] + '月' + time[2] + '日', time[0] + '/' + time[1] + '/' + time[2]];
    },
    // 时间秒数格式化
    arrive_timer_format: function (s) {
        var t;
        if (s > -1) {
            var hour = Math.floor(s / 3600);
            var min = Math.floor(s / 60) % 60;
            var sec = s % 60;
            var day = parseInt(hour / 24);
            if (day > 0) {
                hour = hour - 24 * day;
                t = day + '天' + hour + ':';
            } else t = hour + ':';
            if (min < 10) { t += '0'; }
            t += min + ':';
            if (sec < 10) { t += '0'; }
            t += sec;
        }
        return t;
    }
}
export { myFn }
