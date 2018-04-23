<template>
    <mt-tabbar v-model="selected" fixed class="footerNav">
        <mt-tab-item id="1">
            <span slot="icon" class="iconfont icon-zhubao"></span>
            首页
        </mt-tab-item>
        <mt-tab-item id="2">
            <span slot="icon" class="iconfont icon-paimai"></span>
            拍卖会
        </mt-tab-item>
        <mt-tab-item id="3">
            <span slot="icon" class="iconfont icon-VIP"></span>
            专场拍卖
        </mt-tab-item>
        <mt-tab-item id="4">
            <span slot="icon" class="iconfont icon-wode"></span>
            我的
        </mt-tab-item>
    </mt-tabbar>
</template>

<!-- <template>
    <mt-tabbar v-model="selected" fixed class="footerNav" @input='go_page'>
        <mt-tab-item id="1" class="message" :class="[selected == 1?'is-selected':'']">
            <i class="iconfont icon-xiaoxi nav-icon" v-if="selected != 1"></i>
            <i class="iconfont icon-iconxiaoxihover nav-icon" v-if="selected == 1"></i>
            <div class="mas_satic" v-show="is_showMas"></div>
            消息
        </mt-tab-item>
        <mt-tab-item id="2" :class="[selected == 2?'is-selected':'']">
            <i class="iconfont icon-tongxunlu nav-icon" v-if="selected != 2"></i>
            <i class="iconfont icon-tongxunluxuanzhong nav-icon" v-if="selected == 2"></i>
            通讯录
        </mt-tab-item>
        <mt-tab-item id="3" :class="[selected == 3?'is-selected':'']">
            <i class="iconfont icon-work1 nav-icon" v-if="selected != 3"></i>
            <i class="iconfont icon-work nav-icon" v-if="selected == 3"></i>
            工作
        </mt-tab-item>
        <mt-tab-item id="4" :class="[selected == 4?'is-selected':'']">
            <i class="iconfont icon-gerenzhongxin nav-icon" v-if="selected != 4"></i>
            <i class="iconfont icon-5 nav-icon" v-if="selected == 4"></i>
            个人中心
        </mt-tab-item>
    </mt-tabbar>
</template>
 -->

<script>
    import { Indicator } from 'mint-ui';
    export default {
        name: 'footerNav',
        data () {
            return {
                selected: '',
                path: '',
                id: ''
            }
        },
        beforeRouteEnter (to, from, next) {
            if (localStorage.userInfo) {
                if (from.path === '/index/auction/room/' + JSON.parse(localStorage.userInfo).uid) {
                    Indicator.close();
                    window.is_inroom = false;
                    if (window.websocket) {
                        window.websocket.send(JSON.stringify({type: 'exit_room', room_id: 1}))
                        window.websocket.close();
                        window.websocket = false;
                    }
                    clearInterval(window.periods_timer)
                };
            };
            next()
        },
        mounted () {
            this.routerChange();
            if (localStorage.userInfo) {
                this.id = JSON.parse(localStorage.userInfo).uid;
            } else {
                this.id = 0;
            }
        },
        methods: {
            routerChange () {
                this.path = this.$route.path;
                // console.log(this.path)
                if (this.path === '/index/home') {
                    this.selected = '1';
                };
                if (this.path === '/index/special/auction') {
                    this.selected = '3';
                };
                if (this.path === '/index/center') {
                    this.selected = '4';
                };
            }
        },
        watch: {
            '$route': function () {
                this.routerChange();
            },
            selected: function (newVal, oldVal) {
                var index = parseInt(newVal);
                var goName = '';
                switch (index) {
                    case 1: goName = 'home'; break;
                    case 2: goName = 'room'; break;
                    case 3: goName = 'specialAuction'; break;
                    case 4: goName = 'center'; break;
                }
                if (localStorage.userInfo) {
                    if (goName === 'room') {
                        this.$router.push({name: goName, params: {id: this.id}});
                    } else {
                        this.$router.push({name: goName});
                    }
                }
            }
        }
    }
</script>
<style>
    .footerNav > .mint-tab-item.is-selected {
        color: #AD9355 !important;
    }
    .footerNav {
        border-top: 1px #F2F2F2 solid;
        background: #fff;
    }
    .footerNav .icon-zhubao {
        left: -3px;
    }
    .footerNav a.mint-tab-item {
        color: #585b67;
    }
</style>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
    .footerNav .iconfont {
        font-size: 24px;
        position: relative;
    }
    .footerNav .iconfont:before {
        position: absolute;
        width: 100%;
        height: 100%;
        left: 0;
    }
</style>
