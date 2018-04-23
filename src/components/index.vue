<template>
    <div class="index">
        <router-view></router-view>
        <keep-alive>
            <router-view name="footerNav" ref="footer"></router-view>
        </keep-alive>
    </div>
</template>
<script>
    import wx from 'weixin-js-sdk'
    export default {
        name: 'index',
        data () {
            return {
                msg: 'Welcome to Your Vue.js App'
            }
        },
        beforeRouteEnter (to, from, next) {
            // 微信分享
            var url = location.href.split('#')[0];
            myFn.ajax('post', {url: url}, apiAddress.wx.jssdk, (res) => {
                res.data.debug = false;
                res.data.jsApiList = [
                    'onMenuShareTimeline',
                    'onMenuShareAppMessage',
                    'onMenuShareQQ',
                    'onMenuShareWeibo',
                    'onMenuShareQZone'
                ]
                wx.config(res.data);
            })
            next();
        },
        mounted () {
            wx.ready(res => {
                this.wxShare();
            })
        },
        methods: {
            wxShare () {
                var title = '珠宝艺术臻品，0元起放漏拍卖';
                var link = `${location.origin}${location.pathname}?#${this.$route.fullPath}`;
                var imgUrl = location.protocol + '//' + location.hostname + '/mobile/static/img/logo.png';
                console.log(link)
                // 分享到朋友圈
                wx.onMenuShareTimeline({
                    title: title, // 分享标题
                    link: link,
                    imgUrl: imgUrl, // 分享图标
                    success: function () {
                        // 用户确认分享后执行的回调函数
                    },
                    cancel: function () {
                        // 用户取消分享后执行的回调函数
                    }
                });
                // 分享给朋友
                wx.onMenuShareAppMessage({
                    title: '珠宝汇', // 分享标题
                    desc: title, // 分享描述
                    link: link,
                    imgUrl: imgUrl, // 分享图标
                    success: function () {
                        // 用户确认分享后执行的回调函数
                    },
                    cancel: function () {
                        // 用户取消分享后执行的回调函数
                    }
                });
                // 分享到QQ
                wx.onMenuShareQQ({
                    title: '珠宝汇', // 分享标题
                    desc: title, // 分享描述
                    link: link,
                    imgUrl: imgUrl, // 分享图标
                    success: function () {
                    // 用户确认分享后执行的回调函数
                    },
                    cancel: function () {
                    // 用户取消分享后执行的回调函数
                    }
                });
                // 分享到腾讯微博
                wx.onMenuShareWeibo({
                    title: '珠宝汇', // 分享标题
                    desc: title, // 分享描述
                    link: link,
                    imgUrl: imgUrl, // 分享图标
                    success: function () {
                    // 用户确认分享后执行的回调函数
                    },
                    cancel: function () {
                    // 用户取消分享后执行的回调函数
                    }
                });
                // 分享到QQ空间
                wx.onMenuShareQZone({
                    title: '珠宝汇', // 分享标题
                    desc: title, // 分享描述
                    link: link,
                    imgUrl: imgUrl, // 分享图标
                    success: function () {
                    // 用户确认分享后执行的回调函数
                    },
                    cancel: function () {
                    // 用户取消分享后执行的回调函数
                    }
                });
            }
        },
        watch: {
            '$route': function () {
                this.wxShare();
            }
        }
    }
</script>