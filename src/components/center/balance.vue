<template>
    <div class="balance" v-infinite-scroll="loadMore" :infinite-scroll-disabled="loading" infinite-scroll-distance="10">
        <div class="header">
            <div>
                <p>账户余额</p>
                <p><span v-html="userData.cost"></span></p>
                <mt-button type="primary" @click.native="goRecharge">余额充值</mt-button>
            </div>
        </div>
        <div class="title">
            <span>——</span>
            <span class="iconfont icon-logo"></span>
            <span>收支明细</span>
            <span>——</span>
        </div>
        <table>
            <thead>
                <tr>
                    <th>时间</th>
                    <th>收支</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="item in list">
                    <td v-html="item.create_time">2017/11/15 15:30</td>
                    <td v-if="Number(item.change) > 0" class="plus" v-html="'+' + item.change">+ 3000</td>
                    <td v-else class="minus" v-html="item.change">+ 3000</td>
                </tr>
            </tbody>
        </table>
        <div class="noMore" v-if="list.length == 0">暂无数据 ...</div>
    </div>
</template>

<script>
    export default {
        name: 'balance',
        data () {
            return {
                userData: {},
                list: [],
                loading: false,
                total: 1,
                page: 0
            }
        },
        mounted () {
            this.checkout_balance();
        },
        methods: {
            loadMore () {
                this.loading = true;
                setTimeout(() => {
                    this.loading = false;
                    if (this.list.length >= this.total) return false;
                    this.page ++;
                    myFn.ajax('get', {page: this.page}, apiAddress.center.incomeLog, (res) => {
                        this.list = this.list.concat(res.data.data);
                        this.total = res.data.total
                    })
                }, 1000)
            },
            goRecharge () {
                // wx.miniProgram.navigateTo({url: '/pages/recharge/recharge?type=2'});
                location.href = location.protocol + '//' + location.hostname + '/mobile/?/#/index/center/balance/recharge/2'
                // this.$router.push({name: 'recharge', params: {type: 2}});
            },
            checkout_balance () {
                myFn.ajax('get', {}, apiAddress.center.userData, (res) => {
                    this.userData = res.data;
                })
            }
        }
    }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
    .balance .mint-cell:first-child .mint-cell-wrapper {
        background-origin: content-box;
    }
    .balance .mint-cell-wrapper {
        background-origin: content-box;
        background-size: 100% 1px;
        background-position: bottom left;
    }
    .balance .mint-cell:last-child {
        background: none;
    }
    .balance .mint-cell-allow-right::after {
        width: 10px;
        height: 10px;
        right: 10px;
        border-right-width: 1px;
        border-top-width: 1px;
        right: 20px;
    }
    .balance .mint-cell-title {
        padding-left: 10px;
        color: #585b67;
    }
</style>
<style scoped>
    .header {
        background: #454752;
        text-align: center;
        padding: 20px;
        padding-bottom: 0;
        border-bottom: 1px solid #d9d9d9;
    }
    .header > div {
        height: 150px;
        background-image: linear-gradient(left, #51596D, rgb(109,124,148));
        border-radius: 10px;
        position: relative;
        border-bottom-right-radius: 0;
        border-bottom-left-radius: 0;
    }
    .header > div p:first-child {
        color: #9398A5;
        font-size: 14px;
        margin-bottom: 10px;
        padding-top: 10px;
    }
    .header > div p:nth-child(2) {
        font-size: 45px;
        color: #fff;
        margin-bottom: 10px;
    }
    .header > div button {
        font-size: 14px;
        height: 28px;
        background: none;
        border: 1px solid rgb(215, 183, 100);
        color: rgb(215, 183, 100);
    }
    /*
    .label {
        position: absolute;
        left: 0;
        bottom: 0;
        line-height: 20px;
        width: 100%;
        color: #9398A5;
        font-size: 14px;
        margin-bottom: 10px;
    }
    .header img {
        width: 50px;
        border-radius: 50%;
        margin-bottom: 10px;
    } */

    .noMore {
        position: absolute;
        left: 50%;
        margin-left: -39px;
        color: #999;
        font-size: 14px;
        letter-spacing: 1px;
        margin-top: 40px;
    }
    .title {
        text-align: center;
        padding: 30px 0;
        color: #D7B764;
        border-bottom: 1px solid #d4d4d4;
    }
    .title > span {
        vertical-align: middle;
    }
    .title > span:nth-child(1) {
        margin-right: 15px;
    }
    .title > span:nth-child(4) {
        margin-left: 15px;
    }
    table {
        width: 100%;
        border-collapse:collapse;
    }
    thead tr {
        height: 45px;
    }
    thead tr th {
        width: 50%;
        color: #393939;
        font-weight: 500;
        border-bottom: 1px solid #d4d4d4;
    }
    tbody tr td {
        height: 45px;
        text-align: center;
        font-size: 14px;
        color: #6f6f6f;
        border-bottom: 1px solid #d4d4d4;
        position: relative;
    }
    tbody tr td:nth-child(2) {
        font-size: 18px;
    }
    tbody tr td.plus {
        color: #209cf2;
    }
    tbody tr td.minus {
        color: #EA5F39;
    }
    tbody tr td:before {
        content: '';
        position: absolute;
        width: 15px;
        height: 2px;
        background: #fff;
        bottom: -1px;
    }
    tbody tr td:first-child:before {
        left: 0;
    }
    tbody tr td:last-child:before {
        right: 0;
    }
</style>