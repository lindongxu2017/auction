<template>
    <div class="balanceRecharge">
        <div class="recharge">
            <p>请输入充值金额</p>
            <div class="input-wrapper">
                <div>￥</div>
                <div><input type="text" placeholder="0.00" v-model="total_money"></div>
            </div>
            <p style="margin-top:10px;">
                <span v-html="type == 1?'当前余额为￥':'当前保证金为￥'"></span>
                <span v-html="type == 1?userData.cost:userData.wallet_pledge"></span>
                <span>，最低充值1元</span>
            </p>
        </div>
        <div class="submit-btn">
            <mt-button type="primary" size="large" @click="submit">充值</mt-button>
        </div>
    </div>
</template>

<script>
    export default {
        name: 'balanceRecharge',
        data () {
            return {
                total_money: '',
                type: '',
                userData: {}
            }
        },
        mounted () {
            this.type = this.$route.params.type;
            this.checkout_balance();
        },
        methods: {
            checkout_balance () {
                myFn.ajax('get', {}, apiAddress.center.userData, (res) => {
                    this.userData = res.data;
                })
            },
            submit () {
                var api = '';
                switch (parseInt(this.type)) {
                    case 1:
                        api = apiAddress.center.balance;
                        break;
                    case 2:
                        api = apiAddress.center.bondMoney;
                        break;
                }
                myFn.ajax('post', {total: this.total_money}, api, (res) => {
                    this.wxRecharge(res.data.jsApiParameters)
                })
            },
            wxRecharge (data) {
                var self = this;
                function onBridgeReady () {
                    WeixinJSBridge.invoke('getBrandWCPayRequest', data, (res) => {
                        if (res.err_msg === 'get_brand_wcpay_request:ok') {
                            if (parseInt(self.type) === 1) {
                                self.$router.push({name: 'balance'})
                            } else {
                                self.$routerpush({name: 'center'})
                            }
                        } else {
                            if (parseInt(self.type) === 1) {
                                self.$routerpush({name: 'balance'})
                            } else {
                                self.$routerpush({name: 'center'})
                            }
                        }
                    });
                }
                if (typeof WeixinJSBridge === 'undefined') {
                    if (document.addEventListener) {
                        document.addEventListener('WeixinJSBridgeReady', onBridgeReady, false);
                    } else if (document.attachEvent) {
                        document.attachEvent('WeixinJSBridgeReady', onBridgeReady);
                        document.attachEvent('onWeixinJSBridgeReady', onBridgeReady);
                    }
                } else {
                    onBridgeReady();
                }
            }
        }
    }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
    .balanceRecharge {
        box-sizing: border-box;
        overflow: hidden;
    }
    .recharge {
        padding: 10px 0;
    }
    .recharge > p {
        font-size: 14px;
        color: #585b67;
        padding: 0 17px;
    }
    .recharge > p:last-child {
        color: #9FA4B8;
    }
    .input-wrapper {
        padding: 0 10px;
        margin-top: 10px;
        padding-bottom: 5px;
        border-bottom: 1px solid #d9d9d9;
    }
    .input-wrapper > div:first-child {
        width: 40px;
        float: left;
        font-size: 32px;
    }
    .input-wrapper > div:last-child {
        padding-left: 40px;
    }
    .input-wrapper > div:last-child input {
        height: 100%;
        width: 100%;
        font-size: 30px;
        outline: none;
        border: 0;
    }
    .submit-btn {
        padding: 10px;
        margin-top: 40%;
        text-align: center;
    }
    .submit-btn button {
        display: inline-block;
        width: 80%;
        margin: auto;
        background: #1B1A1D;
        border: none;
        color: #fff;
    }
</style>