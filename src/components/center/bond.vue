<template>
    <div class="bond">
        <div class="recharge">
            <!-- <p class="my">我的保证金<span v-if="userInfo.wallet_pledge < min_deposit">( 需缴纳满￥{{min_deposit}}保证金进行激活 )</span></p>  -->
            <p class="my">我的保证金 <span @click="cashlog">提现记录</span></p>
            <div class="input-wrapper">
                <span>￥</span>
                <span v-html="userInfo.wallet_pledge"></span>
            </div>
        </div>
        <!-- <p class="title">账号已冻结，需缴纳满￥500保证金进行激活</p>   -->
        <div class="submit-btn">
            <mt-button type="primary" size="large" @click="goPage">保证金充值</mt-button>
            <mt-button type="primary" size="large" class="cash-btn" @click="cash">提现</mt-button>
        </div>
    </div>
</template>

<script>
    export default {
        name: 'bond',
        data () {
            return {
                userInfo: {},
                min_deposit: 0,
                orderID: ''
            }
        },
        mounted () {
            this.getInfo();
            this.get_bond();
        },
        methods: {
            getInfo () {
                myFn.ajax('get', {}, apiAddress.center.userData, (res) => {
                    this.userInfo = res.data;
                })
            },
            goPage () {
                // wx.miniProgram.navigateTo({url: '/pages/recharge/recharge?type=1'});
                location.href = location.protocol + '//' + location.hostname + '/mobile/?/#/index/center/balance/recharge/1'
                // this.$router.push({name: 'recharge', params: {type: 1}});
            },
            get_bond () {
                myFn.ajax('get', {}, apiAddress.center.getBond, (res) => {
                    this.min_deposit = res.data.min_deposit;
                })
            },
            cash () {
                this.$router.push({name: 'cash', params: {balance: this.userInfo.wallet_pledge}})
            },
            cashlog () {
                this.$router.push({name: 'cashlog'})
            }
        }
    }
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
    .bond .mint-cell-wrapper {
        background-origin: border-box;
        border-bottom: 1px solid #d9d9d9;
    }
    .bond .mint-button::after {
        position: relative;
    }
</style>
<style scoped>

    .recharge {
        padding: 0 10px;
        padding-bottom: 20px;
        background: #fff;
        border-bottom: 1px solid #d9d9d9;
    }
    .recharge > p.my {
        color: #585b67;
        margin-top: 15px;
        text-align: left;
        font-size: 13px;
    }
    .recharge > p.my span {
        float: right;
    }
    /*.title {
        font-size: 12px;
        color: #a3a8b8;
        margin: 3px 10px;
    }*/
    .input-wrapper {
        padding-top: 25px;
        text-align: center;
    }
    .input-wrapper span {
        color: #bb9f56;
        font-size: 45px;
    }
    .input-wrapper span:first-child {
        font-size: 20px;
    }
    .submit-btn {
        padding: 10px;
        margin-top: 20%!important;
    }
    .submit-btn .cash-btn {
        background: none;
        color: #bb9f56;
        margin-top: 25px;
        border: 1px solid #bb9f56;
    }
</style>