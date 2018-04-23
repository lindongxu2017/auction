<template>
    <div class="certify">
        <div class="form">
            <mt-field label="手机号" placeholder="请输入手机号" type="tel" v-model="phone"></mt-field>
            <mt-field class="Code" label="验证码" placeholder="请输入验证码" v-model="captcha">
                <div class="getCode"  @click="getCode">{{codeTitle}}</div>
            </mt-field>
        </div>
        <div class="submit-btn">
            <mt-button class="authentication-btn" type="primary" size="large" @click.native="binding">认证</mt-button>
        </div>
        <p class="tips">本次认证需支付保证金￥{{min_deposit}}</p>
    </div>
</template>

<script>
    import { MessageBox } from 'mint-ui';
    export default {
        name: 'certify',
        data () {
            return {
                phone: '',
                captcha: '',
                codeTitle: '获取',
                min_deposit: '',
                orderID: ''
            }
        },
        beforeRouteEnter (to, from, next) {
            console.log(to.path);
            console.log(to.path);
            next();
        },
        mounted () {
            this.get_bond();
        },
        methods: {
            get_bond () {
                myFn.ajax('get', {}, apiAddress.center.getBond, (res) => {
                    this.min_deposit = res.data.min_deposit;
                    this.get_orderID(this.min_deposit);
                })
            },
            get_orderID (value) {
                myFn.ajax('post', {total: value, type: 1}, apiAddress.admin.orderID, (res) => {
                    this.orderID = res.data.order_id;
                })
            },
            getCode () {
                if (this.codeTitle === '获取') {
                    if (this.phone === '') {
                        alert('请输入手机号');
                        return;
                    };
                    myFn.ajax('post', {mobile: this.phone}, apiAddress.center.getCode, (res) => {
                        console.log(res);
                        this.codeTitle = '60s';
                        this.set_codeTime();
                    })
                } else {
                    return false;
                }
            },
            binding () {
                var self = this;
                if (this.phone === '') {
                    alert('请输入手机号');
                    return;
                };
                if (this.captcha === '') {
                    alert('请输入验证码');
                    return;
                };
                myFn.ajax('post', {mobile: this.phone, code: this.captcha}, apiAddress.center.modify, () => {
                    // wx.miniProgram.navigateTo({url: '/pages/recharge/recharge?type=certify' + '&id=' + this.orderID})
                    myFn.ajax('post', {total: this.min_deposit}, apiAddress.center.bondMoney, (res) => {
                        // alert('调取支付接口')
                        self.wxRecharge(res.data.jsApiParameters);
                    })
                })
            },
            set_codeTime () {
                setTimeout(() => {
                    this.codeTitle = parseInt(this.codeTitle) - 1 + 's'
                    if (this.codeTitle === '0s') {
                        this.codeTitle = '获取';
                    } else {
                        this.set_codeTime();
                    }
                }, 1000);
            },
            wxRecharge (data) {
                var self = this;
                function onBridgeReady () {
                    WeixinJSBridge.invoke('getBrandWCPayRequest', data, (res) => {
                        if (res.err_msg === 'get_brand_wcpay_request:ok') {
                            // 支付成功操作
                            self.$router.push({name: 'center'})
                        } else {
                            MessageBox('提示', '支付失败')
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
    .certify .mint-cell-wrapper {
        background-origin: border-box;
        padding-left: 0;
        line-height: 50px;
    }
    .certify .mint-cell {
        min-height: 50px;
    }
    .certify .mint-field-other {
        position: absolute;
        top: 10px;
    }
    .certify .mint-cell.Code .mint-cell-wrapper {
        padding-right: 60px;
    }
</style>
<style scoped>
    .form {
        padding: 0 10px;
        margin-top: -1px;
    }
    .tips {
        margin-top: -10px;
        padding-left: 10px;
        font-size: 14px;
        color: #393939;
        text-align: center;
    }
    .submit-btn {
        margin-top: 40%;
        margin-bottom: 20px;
    }
    .submit-btn button{
        width: 80%;
        margin: auto;
        background: #1D1A1B;
        border:none;
        color: #fff;
    }
    .getCode {
        background: transparent;
        color: #C7B58B;
        border: 1px #C7B58B solid;
        box-shadow: none;
        font-size: 12px;
        height: 28px;
        line-height: 28px;
        width: 48px;
        text-align: center;
        border-radius: 3px;
    }
</style>
