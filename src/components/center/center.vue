<template>
    <div class="center">
        <div class="header">
            <div class="head-img">
                <span><img :src="experience.curr_rank_img" width="25"></span>
                <img :src="userInfo.wximg || require('../../assets/icon/nav/index.png')">
            </div>
            <div class="user-info">
                <p class="name" v-html="userInfo.nickname">杰克斯派洛</p>
                <p>经验：{{experience.curr_rank_point}}/{{experience.max_rank_point}}</p>
                <p>身份：{{experience.curr_rank_name}}
                <mt-button v-if="is_auth == 0" class="authentication-btn" size="small" @click.native="routerName='certify'">认证</mt-button></p>
            </div>
        </div>
        <div class="my-order">
            <p class="title-label">我的订单</p>
            <div class="order-classify">
                <div @click="routerName='pendingPay'"><span class="iconfont icon-daifukuan"></span><p>待付款</p></div>
                <div @click="routerName='pendingReceive'"><span class="iconfont icon-shijian1"></span><p>待收货</p></div>
                <div @click="routerName='received'"><span class="iconfont icon-yishouhuo1"></span><p>已收货</p></div>
                <div @click="routerName='protectRightsList'"><span class="iconfont icon-weiquan"></span><p>维权</p></div>
            </div>
        </div>
        <div class="cell-list">
            <mt-cell title="余额" @click.native="routerName='balance'" is-link></mt-cell>
            <mt-cell title="个人信息" @click.native="routerName='personInfo'" is-link></mt-cell>
            <mt-cell title="收货地址" @click.native="routerName='address'" is-link></mt-cell>
            <mt-cell title="保证金" @click.native="routerName='bond'" is-link></mt-cell>
            <a :href="'tel:' + telephone"><mt-cell title="联系客服" is-link></mt-cell></a>
        </div>
    </div>
</template>

<script>
    import { MessageBox } from 'mint-ui';
    export default {
        name: 'center',
        data () {
            return {
                userInfo: {},
                routerName: '',
                telephone: '',
                experience: {},
                is_auth: ''
            }
        },
        beforeMount (to, from, next) {
            if (localStorage.userInfo) return;
            myFn.wxlogin();
        },
        beforeRouteEnter (to, from, next) {
            console.log(to.path);
            console.log(from.path);
            next(() => {
                console.log(1);
            })
        },
        mounted () {
            this.getTelephone();
            this.getExperience();
            this.getInfo();
        },
        methods: {
            getInfo () {
                myFn.ajax('get', {}, apiAddress.center.userData, (res) => {
                    this.userInfo = res.data;
                    this.is_auth = res.data.is_auth;
                })
            },
            routerlink () {
                if (this.routerName === 'certify') {
                    location.href = location.protocol + '//' + location.hostname + '/mobile/?/#/index/center/certify'
                } else if (parseInt(this.is_auth) === 0) {
                    MessageBox('提示', '请先认证账户');
                    return false;
                } else {
                    this.$router.push({name: this.routerName})
                }
            },
            getTelephone () {
                myFn.ajax('get', {}, apiAddress.center.telephone, (res) => {
                    this.telephone = res.data.tel;
                })
            },
            getExperience () {
                myFn.ajax('get', {}, apiAddress.center.experience, (res) => {
                    this.experience = res.data;
                })
            }
        },
        watch: {
            routerName: function () {
                this.routerlink();
            }
        }
    }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
    .center .mint-button {
        height: 24px;
        margin-left: 10px;
    }
    .center .mint-cell-wrapper {
        background-origin: border-box;
    }
    .center .cell-list .mint-cell-wrapper {
        font-size: 15px;
        padding: 0;
        background-image: none;
        border-bottom: 1px #d4d4d4 solid;
    }
    .center .mint-cell:last-child .mint-cell-wrapper{
        border-bottom: 0;
    }
    .center .mint-cell:last-child {
        background-image: none;
    }
    .center .mint-cell-allow-right::after {
        width: 10px;
        height: 10px;
        right: 10px;
        border-right-width: 1px;
        border-top-width: 1px;
    }
    .center .mint-cell-title {
        color: #575A65;
    }
</style>
<style scoped>
    * {
        color: #585b67;
    }
    .center {
        padding-bottom: 62px;
        overflow: auto;
    }
    .header {
        background: #1B1A1D;
        padding: 15px 10px;
        padding-left: 5%;
        padding-bottom: 0;
        margin-bottom: 7px;
        height: 100px;
        position: relative;
        background-image: url('../../assets/icon/center_bg.png');
        background-size: cover;
        border-bottom: 1px solid #d9d9d9;
    }
    .head-img {
        box-sizing: border-box;
        float: left;
        position: relative;
    }
    .head-img > span {
        position: absolute;
        width: 25px;
        height: 25px;
        right: 0;
        bottom: 0;
    }
    .head-img > img {
        margin-top: 10px;
        width: 65px;
        height: 65px;
        border-radius: 50%;
        border: 3px solid #AD9355;
    }
    .user-info {
        padding-left: 100px;
    }
    .user-info .name {
        height: 24px;
        font-size: 17px;
        margin-top: 5px;
        margin-bottom: 10px;
    }
    .user-info p {
        font-size: 14px;
        margin: 7px 0;
        color: #fff;
    }
    .authentication-btn {
        margin-left: 20px;
        background: transparent;
        color: #c0ba9e;
        border: 1px #c0ba9e solid;
        box-shadow: none;
        float: right;
    }
    .my-order {
        background: #fff;
        margin-bottom: 7px;
    }
    .title-label {
        color: #585b67;
        font-size: 15px;
        margin: 0px 10px;
        padding: 15px 0 10px;
        border-bottom: 1px solid #d9d9d9;
    }
    .order-classify {
        font-size: 0;
        padding-bottom: 5px;
    }
    .order-classify > div {
        width: 25%;
        padding: 10px;
        font-size: 14px;
        padding-top: 15px;
         margin-top: 2px; 
        text-align: center;
        display: inline-block;
        box-sizing: border-box;
        line-height: 10px;
    }
    .order-classify > div span {
        position: relative;
        display: inline-block;
        font-size: 30px;
        width: 30px;
        height: 30px;
        margin-bottom: 7px;
        line-height: 30px;
        position: relative;
    }
    .order-classify > div span:before {
        position: absolute;
        width: 100%;
        height: 100%;
        left: 0;
        top: 0;
    }
    .cell-list {
        border: none;
        /* position: absolute; */
        width: 100%;
        bottom: 0;
        top: 255px;
        background: #fff;
        padding: 0 15px;
        box-sizing: border-box;
        /*font-size: 15px;*/
    }
</style>
