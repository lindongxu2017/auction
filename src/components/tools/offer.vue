<template>
    <div class="offer">
        <mt-popup v-model="popup" :closeOnClickModal="!popup" position="right" >
            <div class="offerBox">
                <span class="reduce" :class="{'prohibitReduce_active' : money <= (currentMoney + limit)}"  @click="reduceMoney">-</span>
                <span class="money">{{money}}</span>
                <span class="add" @click="addMoney">+</span>
            </div>
            <p class="prompt">加价限制：每次至少{{limit}}元</p>
            <mt-button type="primary" class="popup_btn submit" @click="confirm_add">立即出价</mt-button>
            <mt-button type="danger" class="close" @click="close_popup">X</mt-button>
        </mt-popup>
    </div>
</template>
<script>
    export default {
        name: 'offer',
        data () {
            return {
                popupVisible: false,
                money: 500
            }
        },
        watch: {
            currentMoney: function (newVal, oldVal) {
                this.money = parseFloat(this.currentMoney) + parseFloat(this.limit);
            }
        },
        methods: {
            accAdd (arg1, arg2) {
                var r1, r2, m;
                try {
                    r1 = arg1.toString().split('.')[1].length;
                } catch (e) {
                    r1 = 0;
                }
                try {
                    r2 = arg2.toString().split('.')[1].length;
                } catch (e) {
                    r2 = 0
                }
                m = Math.pow(10, Math.max(r1, r2))
                return (arg1 * m + arg2 * m) / m
            },
            subtr (arg1, arg2) {
                var r1, r2, m, n;
                try {
                    r1 = arg1.toString().split('.')[1].length
                } catch (e) {
                    r1 = 0;
                }
                try {
                    r2 = arg2.toString().split('.')[1].length
                } catch (e) {
                    r2 = 0
                }
                m = Math.pow(10, Math.max(r1, r2));
                n = (r1 >= r2) ? r1 : r2;
                return ((arg1 * m - arg2 * m) / m).toFixed(n);
            },
            reduceMoney () {
                if (this.money > this.subtr(this.currentMoney, this.limit)) {
                    this.money = this.subtr(this.money, this.limit);
                }
            },
            addMoney () {
                this.money = this.accAdd(this.money, this.limit);
            },
            close_popup () {
                this.$emit('input', false, 1, this.money);
            },
            confirm_add () {
                // 出价请求,成功后关闭遮罩层
                /* var data = {
                    pid: this.shopId,
                    money: this.money
                } */
                this.$emit('input', false, 2, this.money);
                this.$emit('auction', this.money, false);
                // this.$emit('specialAuction', this.money);
            }
        },
        props: ['popup', 'currentMoney', 'limit', 'shopId']
    }
</script>
<style>
    .offer .mint-popup {
        width: 85%;
        height: 250px;
        border-radius: 10px;
        text-align: center;
        margin-right: 7.5%;
        background: #fff;
        padding: 0;
    }
</style>
<style scoped>
    .offerBox {
        width: 85%;
        margin-top: 20%;
        display: inline-block;
    }
    .offerBox .money {
        width: 110px;
        font-size: 35px;
        color: #C0BA96;
        margin: 0 10px;
        display: inline-block;
        vertical-align: middle;
    }
    .offerBox .reduce, .offerBox .add {
        width: 40px;
        height: 40px;
        display: inline-block;
        border-radius: 50%;
        border: 2px #C0BA96 solid;
        vertical-align: middle;
        font-size: 30px;
        line-height: 40px;
        color: #C0BA96;
    }
    .prompt {
        margin: 20px 0;
        font-size: 12px;
        color: #999;
    }
    .prohibitReduce_active {
        color: #999 !important;
        border-color: #999 !important;
    }
    .popup_btn {
        height: 45px;
        width: 85px;
    }
    .submit {
        width: 100%;
        position: absolute;
        bottom: 0;
        left: 0;
        border-radius: 0 0 10px 10px;
        background: #D4CEAB;
        font-size: 20px;
    }
    .close {
        width: 40px;
        height: 40px;
        position: absolute;
        bottom: -50%;
        left: 0;
        right: 0;
        margin: auto;
        background: transparent;
        border: 1px #fff solid;
        border-radius: 50%;
    }
</style>