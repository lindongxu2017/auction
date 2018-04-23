<template>
    <div class="cash">
        <div class="form">
            <p class="tips">提现</p>
            <mt-field class="first" label="金额" placeholder="请输入提现金额" v-model="sendData.money"></mt-field>
            <mt-field class="first" label="开户姓名" placeholder="请输入开户姓名" v-model="sendData.username"></mt-field>
            <mt-field class="first" label="开户银行" placeholder="例：工商银行" v-model="sendData.bankname"></mt-field>
            <mt-field class="first" label="开户行支行" placeholder="例：深圳观澜支行" v-model="sendData.bankbranch"></mt-field>
            <mt-field class="first" label="银行卡号" placeholder="例：888 8888 8888 88888" v-model="sendData.bankno"></mt-field>
        </div>
        <p style="font-size:14px;color:#999;padding:10px">可提现金额 <span style="color:red" v-html="'￥' + balance"></span></p>
        <p style="font-size:14px;color:#999;padding:10px;padding-top: 0">客服微信：<span v-html="wx_num"></span></p>
        <div class="submit-btn">
            <mt-button type="primary" size="large" @click.native="modify">提交</mt-button>
        </div>
    </div>
</template>

<script>
    import { MessageBox } from 'mint-ui';
    export default {
        name: 'cash',
        data () {
            return {
                sendData: {
                    money: '',
                    username: '',
                    bankname: '',
                    bankbranch: '',
                    bankno: ''
                },
                balance: '',
                wx_num: ''
            }
        },
        mounted () {
            this.balance = this.$route.params.balance;
            this.getWXnum();
        },
        methods: {
            modify () {
                if (this.sendData.money === '') {
                    alert('金额不能为空');
                    return false;
                };
                if (this.sendData.username === '') {
                    alert('姓名不能为空');
                    return false;
                };
                if (this.sendData.bankname === '') {
                    alert('开户银行不能为空');
                    return false;
                };
                if (this.sendData.bankbranch === '') {
                    alert('支行名称不能为空');
                    return false;
                };
                if (this.sendData.bankno === '') {
                    alert('银行卡号不能为空');
                    return false;
                };
                myFn.ajax('post', this.sendData, apiAddress.admin.cash, (res) => {
                    MessageBox({
                        title: '提交成功',
                        message: '已收到您的提现申请，为了保证您的资金安全，请添加客服微信' + this.wx_num + '，才可确认提现！',
                        showCancelButton: false
                    }).then(action => {
                        this.$router.push({name: 'center'})
                    })
                })
            },
            getWXnum () {
                myFn.ajax('get', {}, apiAddress.center.telephone, (res) => {
                    this.wx_num = res.data.wx_num;
                })
            }
        }
    }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
    .cash .mint-cell-wrapper {
        background-origin: border-box;
        padding: 0 3px;
    }
    .cash .mint-cell-wrapper {
        font-size: 16px;
    }
    .cash .mint-cell.first .mint-cell-wrapper {
        /* background: none; */
    }
    .cash .mint-cell-wrapper {
        background-position: bottom left;
    }
    .cash .mint-button--small {
        box-shadow: none;
        /* box-shadow: 0 0 2px #d4ceab; */
        border: 1px solid #AD9355;
        color: #AD9355;
        background: #fff;
    }
    .cash .mint-cell {
        min-height: 55px;
    }
</style>
<style scoped>
    .form {
        padding: 0 10px;
    }
    .submit-btn {
        padding: 10px;
        margin-top: 15%!important;
    }
    .tips {
        color: #585b67;
        font-size: 14px;
        padding: 12px 5px;
        padding-bottom: 5px;
    }
    .mobileCode {
        padding: 0 7px;
    }
</style>
