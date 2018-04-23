<template>
    <div class="pay">
        <div class="recharge">
            <p>支付金额</p>
            <div class="input-wrapper">
                <div>￥</div>
                <div><span v-html="orderInfo.total_money || '0.00'"></span></div>
            </div>
        </div>
        <div class="select">
            <span class="payWX iconfont icon-weixinzhifu"></span>
            <span class="payHK iconfont icon-logo"></span>
            <img class="payBalance" src="../../assets/icon/balance.png">
            <mt-radio align="right" title="支付方式" v-model="value" :options="options"></mt-radio>
        </div>
        <!-- <mt-field label="支付密码" placeholder="请输入密码" type="password" v-if="value==1" v-model="password"></mt-field> -->
        <mt-field label="汇款单号" placeholder="请输入汇款单号" v-if="value==4" v-model="order_no"></mt-field>
        <div class="submit-btn">
            <mt-button type="primary" size="large" @click="submit">支付</mt-button>
        </div>
    </div>
</template>

<script>
    import { MessageBox } from 'mint-ui';
    export default {
        name: 'pay',
        data () {
            return {
                id: '',
                payid: '',
                order_no: '',
                password: '',
                options: [
                    {
                        label: '微信支付',
                        value: '1'
                    },
                    {
                        label: '余额支付',
                        value: '2'
                    },
                    {
                        label: '汇款',
                        value: '4'
                    }
                ],
                value: '1',
                orderInfo: {},
                addressID: '',
                parameter: {}
            }
        },
        mounted () {
            // MessageBox('提示', '进来了进来了');
            // this.parameter = JSON.parse(this.$route.params.parameter);
            // this.id = this.parameter.id;
            this.id = this.$route.params.id;
            this.payid = this.$route.params.payid;
            this.getOrderInfo();
            this.isDefaultAddress();
            console.log(this.parameter)
        },
        methods: {
            getOrderInfo () {
                myFn.ajax('get', {order_id: this.id}, apiAddress.center.orderDetails, (res) => {
                    this.orderInfo = res.data;
                })
            },
            isDefaultAddress () {
                myFn.ajax('get', {}, apiAddress.center.isDefaultAddress, (res) => {
                    this.addressID = res.data.id;
                    // this.submit();
                })
            },
            submit () {
                var api = '';
                var data = {};
                var self = this;
                switch (parseInt(this.value)) {
                    case 1:
                        // wx.miniProgram.navigateTo({url: '/pages/recharge/recharge?type=certify' + '&id=' + this.parameter.pay_id})
                        // location.href = location.protocol + '//' + location.hostname + '/mobile/?/#/index/pay/' + id + '/1';
                        api = apiAddress.center.wxPay;
                        data = {
                            order_id: this.payid,
                            address_id: this.addressID
                        }
                        break;
                    default:
                        api = apiAddress.center.orderPay;
                        data = {
                            order_id: this.payid,
                            pay_type: this.value,
                            transaction_id: this.orderInfo.order_no,
                            address_id: this.addressID
                        }
                        break;
                }
                myFn.ajax('post', data, api, (res) => {
                    if (parseInt(this.value) === 1) {
                        this.wxRecharge(res.data.jsApiParameters);
                    } else if (parseInt(this.value) === 4) {
                        MessageBox({
                            title: '提示',
                            message: '提交成功、请等待后台确认汇款单据!',
                            showCancelButton: false
                        }).then(action => {
                            self.$router.back(-1);
                        })
                    } else {
                        // alert('支付成功');
                        // this.$router.push({name: 'pendingReceive'});
                        MessageBox({
                            title: '提示',
                            message: '支付成功',
                            showCancelButton: false
                        }).then(action => {
                            self.$router.back(-1);
                        })
                    }
                })
            },
            wxRecharge (data) {
                var self = this;
                function onBridgeReady () {
                    WeixinJSBridge.invoke('getBrandWCPayRequest', data, (res) => {
                        if (res.err_msg === 'get_brand_wcpay_request:ok') {
                            // self.$router.push({name: 'pendingReceive'});
                            self.$router.back(-1);
                        } else {
                            self.$router.back(-1);
                            // self.$router.push({name: 'pendingPay'});
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
<style>
    .pay .mint-field {
        border-bottom: 1px solid #d9d9d9;
    }
    .pay .mint-radiolist {
        margin-bottom: 20px;
    }
    .pay .mint-field-core {
        font-size: 14px;
    }
    .pay .mint-cell {
        min-height: 55px;
    }
    .pay .mint-cell-wrapper {
        background-origin: border-box;
    }
    .pay .select .mint-cell-wrapper {
        padding-left: 35px;
    }
    .pay .mint-radiolist-title {
        padding: 25px 15px 10px;
        font-size: 14px;
        background: #fff;
        margin: 0;
    }
    .pay .mint-radio-input:checked + .mint-radio-core {
        background-color: #D4CEAB;
        border-color: #D4CEAB;
    }
</style>
<style scoped>
    .recharge {
        padding: 10px;
        background: #fff;
        border-bottom: 1px solid #d9d9d9;
    }
    .recharge > p {
        font-size: 14px;
        padding-left: 7px;
        color: #858585;
    }
    .input-wrapper {
        margin-top: 10px;
        padding-bottom: 5px;
    }
    .input-wrapper > div:first-child {
        width: 40px;
        float: left;
        font-size: 32px;
        color: #585B67;
    }
    .input-wrapper > div:last-child {
        padding-top: 2px;
        padding-left: 40px;
    }
    .input-wrapper > div span {
        height: 100%;
        width: 100%;
        font-size: 28px;
        outline: none;
        border: 0;
        color: #585B67;
    }
    .submit-btn {
        padding: 10px;
        margin-top: 20%!important;
    }
    .lable-wrapper {
        padding: 20px 15px 5px;
        background: #fff;
    }
    .select {
        position: relative;
    }
    .select > span {
        position: absolute;
        left: 15px;
        z-index: 1;
        font-size: 24px;
        color: #434652;
    }
    .select .payWX {
        top: 70px;
        color: #57B64B;
    }
    .select .payHK {
        /* top: 125px; */
        top: 178px;
        color: #434652;
        font-size: 20px;
    }
    .select .payBalance {
        position: absolute;
        width: 25px;
        height: 25px;
        z-index: 2;
        top: 124px;
        left: 14px;
    }
</style>